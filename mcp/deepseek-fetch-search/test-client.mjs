/**
 * 冒烟测试：以 MCP 客户端身份通过 stdio 启动服务并调用两个工具。
 * 运行：node test-client.mjs
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL("./index.js", import.meta.url))],
  env: { ...process.env },
  stderr: "inherit",
});

const client = new Client({ name: "deepseek-web-smoke", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log(
  "工具列表:",
  tools.map((t) => `${t.name}(${Object.keys(t.inputSchema?.properties ?? {}).join(",")})`),
);

const search = await client.callTool({
  name: "deepseek_search",
  arguments: { query: "DeepSeek Search Fetch API pricing", count: 2 },
});
console.log("\n--- search ---");
console.log(String(search.content?.[0]?.text ?? "").slice(0, 700));

const page = await client.callTool({
  name: "deepseek_fetch",
  arguments: { url: "https://api-docs.deepseek.com/guides/search", max_chars: 500 },
});
console.log("\n--- fetch ---");
console.log(String(page.content?.[0]?.text ?? "").slice(0, 600));

await client.close();
