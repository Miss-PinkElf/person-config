/**
 * 零费用测试：用本地 HTTP Mock 代替 DeepSeek API，验证 MCP 协议、
 * 密钥来源优先级、转义还原、URL 校验和截断逻辑。
 *
 * 运行：npm test
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.join(HERE, "index.js");

/** 记录服务端收到的请求，用于断言请求体与 Authorization */
const requests = [];

const mock = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    requests.push({
      path: req.url,
      auth: req.headers.authorization,
      body: raw ? JSON.parse(raw) : {},
    });

    res.setHeader("Content-Type", "application/json");
    if (req.url === "/v1/tools/search") {
      res.end(
        JSON.stringify({
          results: [
            {
              title: "示例标题",
              url: "https://example.com/a",
              summary: "纯文本 \\# 保持原样",
              content: [
                "正文\\. 转义\\. 结束",
                "```js",
                "const re = /\\./g;",
                "    ```js",
                "```",
                "行内 `\\*` 保留，双反引号 ``a`b`` 与 \\# 还原",
              ].join("\n"),
              site_name: "示例站点",
              date: "2026-06-01T00:00:00+00:00",
              rerank_score: 2.4,
              authority: 3,
            },
          ],
        }),
      );
      return;
    }

    if (req.url === "/v1/tools/fetch") {
      const content =
        "# 标题\n\n正文\\! 转义\n\n```\ncode \\| 原样\n```\n\n" +
        "长".repeat(600);
      res.end(JSON.stringify({ title: "抓取标题", content }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: { message: "not found" } }));
  });
});

const port = await new Promise((resolve) => {
  mock.listen(0, "127.0.0.1", () => resolve(mock.address().port));
});

/** 完整环境变量，避免本机 .env 干扰测试 */
const baseEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined),
);
baseEnv.DEEPSEEK_BASE_URL = `http://127.0.0.1:${port}`;
// 故意设置成 Claude Code 的凭据，验证服务不会使用它
baseEnv.ANTHROPIC_AUTH_TOKEN = "claude-code-key-should-be-ignored";
baseEnv.ANTHROPIC_API_KEY = "claude-code-key-should-be-ignored";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "deepseek-mcp-"));
const tempEnvFile = path.join(tempDir, ".env");
fs.writeFileSync(tempEnvFile, "DEEPSEEK_API_KEY=from-dotenv\n# 注释行\n");
const missingEnvFile = path.join(tempDir, ".env-does-not-exist");

async function connect(env) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [ENTRY],
    env,
    stderr: "inherit",
  });
  const client = new Client({ name: "deepseek-web-mock", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

let clientWithKey;
let clientFromDotEnv;
let clientWithoutKey;

try {
  // 1) 环境变量优先于 .env
  clientWithKey = await connect({
    ...baseEnv,
    DEEPSEEK_API_KEY: "test-key",
    DEEPSEEK_MCP_ENV_FILE: tempEnvFile,
  });

  const { tools } = await clientWithKey.listTools();
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    ["deepseek_fetch", "deepseek_search"],
  );

  const search = await clientWithKey.callTool({
    name: "deepseek_search",
    arguments: { query: "测试", count: 1, ori_question: "原始问题" },
  });
  assert.equal(search.isError, undefined);

  const searchText = search.content[0].text;
  assert.ok(searchText.includes("示例标题"));
  // summary 是纯文本，不做 Markdown 反转义
  assert.ok(searchText.includes("摘要: 纯文本 \\# 保持原样"));
  // 普通正文还原转义
  assert.ok(searchText.includes("正文. 转义. 结束"));
  // 围栏代码块内原样保留（含 4 空格缩进的 ```js，不应提前闭合）
  assert.ok(searchText.includes("const re = /\\./g;"));
  assert.ok(searchText.includes("    ```js"));
  // 行内代码与双反引号代码段原样保留，代码外的 # 正常还原
  assert.ok(searchText.includes("行内 `\\*` 保留"));
  assert.ok(searchText.includes("``a`b``"));
  assert.ok(searchText.includes("与 # 还原"));

  assert.equal(requests[0].auth, "Bearer test-key");
  assert.deepEqual(requests[0].body, {
    query: "测试",
    count: 1,
    need_content: false,
    ori_question: "原始问题",
  });

  // 2) Fetch：转义还原 + 截断提示
  const page = await clientWithKey.callTool({
    name: "deepseek_fetch",
    arguments: { url: "https://example.com/a?x=1", max_chars: 500 },
  });
  assert.equal(page.isError, undefined);

  const pageText = page.content[0].text;
  assert.ok(pageText.startsWith("# 抓取标题"));
  assert.ok(pageText.includes("正文! 转义"));
  assert.ok(pageText.includes("code \\| 原样"));
  assert.match(pageText, /内容已截断：原文 \d+ 字符，仍有 \d+ 字符未返回/);
  assert.deepEqual(requests[1].body, {
    url: "https://example.com/a?x=1",
  });

  // 3) URL 在本地就被拦截，不产生请求
  // SDK 会把输入校验失败包装成 isError 结果，而不是让 callTool 抛异常
  const beforeInvalid = requests.length;
  const badProtocol = await clientWithKey.callTool({
    name: "deepseek_fetch",
    arguments: { url: "ftp://example.com/a" },
  });
  assert.equal(badProtocol.isError, true);
  assert.match(badProtocol.content[0].text, /http\/https/);

  const badCredentials = await clientWithKey.callTool({
    name: "deepseek_fetch",
    arguments: { url: "https://user:pass@example.com/a" },
  });
  assert.equal(badCredentials.isError, true);
  assert.match(badCredentials.content[0].text, /用户名或密码/);
  assert.equal(requests.length, beforeInvalid);

  // 4) 没有环境变量时回退到本地 .env
  const envWithoutKey = {
    ...baseEnv,
    DEEPSEEK_MCP_ENV_FILE: tempEnvFile,
  };
  delete envWithoutKey.DEEPSEEK_API_KEY;

  clientFromDotEnv = await connect(envWithoutKey);
  const fromDotEnv = await clientFromDotEnv.callTool({
    name: "deepseek_search",
    arguments: { query: "测试" },
  });
  assert.equal(fromDotEnv.isError, undefined);
  assert.equal(requests[2].auth, "Bearer from-dotenv");

  // 5) 既没有环境变量也没有 .env 时，绝不回退到 ANTHROPIC_* 凭据
  const envWithoutAnyKey = {
    ...baseEnv,
    DEEPSEEK_MCP_ENV_FILE: missingEnvFile,
  };
  delete envWithoutAnyKey.DEEPSEEK_API_KEY;

  clientWithoutKey = await connect(envWithoutAnyKey);
  const beforeMissingKey = requests.length;
  const missingKey = await clientWithoutKey.callTool({
    name: "deepseek_search",
    arguments: { query: "测试" },
  });
  assert.equal(missingKey.isError, true);
  assert.ok(missingKey.content[0].text.includes("未找到 DeepSeek API Key"));
  assert.equal(requests.length, beforeMissingKey);

  console.log("\n[test-mock] 全部通过");
} finally {
  await clientWithKey?.close();
  await clientFromDotEnv?.close();
  await clientWithoutKey?.close();
  await new Promise((resolve) => mock.close(resolve));
  fs.rmSync(tempDir, { recursive: true, force: true });
}
