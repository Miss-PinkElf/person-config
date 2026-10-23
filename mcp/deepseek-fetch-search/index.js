#!/usr/bin/env node
/**
 * DeepSeek Web MCP Server
 * 把 DeepSeek 官方的 Search / Fetch API 暴露成 MCP 工具。
 *
 *   POST {API_ROOT}/v1/tools/search
 *   POST {API_ROOT}/v1/tools/fetch
 *
 * 认证：只读取本服务自己的 DEEPSEEK_API_KEY
 *      优先级：进程环境变量 > 同目录 .env
 *      不会使用 ANTHROPIC_* 或 ~/.claude/settings.json 中的 Claude Code 凭据
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE =
  process.env.DEEPSEEK_MCP_ENV_FILE || path.join(MODULE_DIR, ".env");

/**
 * 读取本服务自己的 .env。
 * 已存在的环境变量优先，不会被 .env 覆盖；文件不存在属于正常情况。
 * 只支持 KEY=VALUE、# 注释和成对引号，保持零依赖。
 */
function loadEnvFile(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return false;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      // 去掉未加引号值后面的行内注释，例如 KEY=value # 说明
      const commentAt = value.indexOf(" #");
      if (commentAt >= 0) value = value.slice(0, commentAt).trim();
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}

loadEnvFile(ENV_FILE);

const API_ROOT = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/anthropic$/, "");

const DEFAULT_FETCH_CHARS = 60000;
const DEFAULT_RESULT_CHARS = 4000;
const SEARCH_TIMEOUT_MS = 30_000;
const FETCH_TIMEOUT_MS = 60_000;

function resolveApiKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  return typeof key === "string" && key.trim() ? key.trim() : null;
}

async function post(pathname, body, timeoutMs) {
  const key = resolveApiKey();
  if (!key) {
    throw new Error(
      [
        "未找到 DeepSeek API Key，请任选一种方式配置：",
        `  1) 在 ${ENV_FILE} 中写入 DEEPSEEK_API_KEY=sk-...`,
        "  2) 设置环境变量 DEEPSEEK_API_KEY",
        "本服务不会读取 ANTHROPIC_* 或 ~/.claude/settings.json 中的凭据。",
      ].join("\n"),
    );
  }
  const res = await fetch(`${API_ROOT}${pathname}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw };
  }
  if (!res.ok) {
    const detail =
      data?.error?.message || data?.raw || raw.slice(0, 300) || res.statusText;
    throw new Error(`DeepSeek ${pathname} 请求失败 (HTTP ${res.status}): ${detail}`);
  }
  return data;
}

/**
 * 按 Unicode 码点截断，避免把 emoji 等代理对切成半个字符。
 * 长度足够时走快速路径，不为长文本创建数组。
 */
function truncate(text, max) {
  const s = typeof text === "string" ? text : "";
  if (s.length <= max) return { text: s, truncated: false, omitted: 0 };
  const chars = Array.from(s);
  if (chars.length <= max) return { text: s, truncated: false, omitted: 0 };
  return {
    text: chars.slice(0, max).join(""),
    truncated: true,
    omitted: chars.length - max,
  };
}

/** CommonMark 中可被反斜杠转义的 ASCII 标点 */
function isAsciiPunctuation(ch) {
  const c = ch.charCodeAt(0);
  return (
    (c >= 33 && c <= 47) ||
    (c >= 58 && c <= 64) ||
    (c >= 91 && c <= 96) ||
    (c >= 123 && c <= 126)
  );
}

function unescapeSegment(seg) {
  return seg.replace(/\\(.)/g, (m, ch) => (isAsciiPunctuation(ch) ? ch : m));
}

/**
 * 还原一行中「行内代码之外」的反斜杠转义。
 * 用扫描器而不是正则切分，才能正确处理内容里带单个反引号的双反引号代码段，
 * 例如 ``a`b``。
 */
function unescapeInlineCode(line) {
  let out = "";
  let i = 0;
  let textStart = 0;

  while (i < line.length) {
    if (line[i] !== "`") {
      i += 1;
      continue;
    }

    // 当前反引号串的长度
    let runEnd = i;
    while (line[runEnd] === "`") runEnd += 1;
    const runLength = runEnd - i;

    // 找长度相同的闭合反引号串
    let closeAt = -1;
    let j = runEnd;
    while (j < line.length) {
      if (line[j] !== "`") {
        j += 1;
        continue;
      }
      let closeEnd = j;
      while (line[closeEnd] === "`") closeEnd += 1;
      if (closeEnd - j === runLength) {
        closeAt = j;
        break;
      }
      j = closeEnd;
    }

    // 没有闭合：这些反引号按普通文本处理，继续向后扫描
    if (closeAt === -1) {
      i = runEnd;
      continue;
    }

    out += unescapeSegment(line.slice(textStart, i));
    out += line.slice(i, closeAt + runLength); // 代码段原样保留
    i = closeAt + runLength;
    textStart = i;
  }

  return out + unescapeSegment(line.slice(textStart));
}

/** 最多 3 个空格缩进的围栏起始行（CommonMark） */
const FENCE_OPEN_RE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
/** 闭合围栏不能带 info string，缩进最多 3 个空格 */
const FENCE_CLOSE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/;

/**
 * DeepSeek 的 Fetch 转换器会对标点做反斜杠转义（\. \; \/ \# 等）。
 * 渲染器能正确显示，但作为纯文本交给模型只是噪声。
 * 这里只还原围栏代码块和行内代码之外的 ASCII 标点转义，避免破坏正则、路径等。
 */
function unescapeMarkdown(text) {
  const s = typeof text === "string" ? text : "";
  if (!s.includes("\\")) return s;

  let fence = null; // { char, length }
  return s
    .split("\n")
    .map((line) => {
      if (fence) {
        const close = line.match(FENCE_CLOSE_RE);
        if (
          close &&
          close[1][0] === fence.char &&
          close[1].length >= fence.length
        ) {
          fence = null;
        }
        return line;
      }

      const open = line.match(FENCE_OPEN_RE);
      // 反引号围栏的 info string 不能包含反引号（CommonMark）
      if (open && !(open[1][0] === "`" && open[2].includes("`"))) {
        fence = { char: open[1][0], length: open[1].length };
        return line;
      }

      return unescapeInlineCode(line);
    })
    .join("\n");
}

/** 官方要求：http/https、带主机名、不含用户名或密码、长度 ≤ 8192 */
function isFetchableUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return (
    (parsed.protocol === "http:" || parsed.protocol === "https:") &&
    Boolean(parsed.hostname) &&
    !parsed.username &&
    !parsed.password
  );
}

function formatResults(query, results, contentLimit) {
  if (!results.length) {
    return `搜索「${query}」没有返回结果（空结果不计费）。可以换个关键词或放宽条件。`;
  }
  const lines = [`搜索「${query}」共 ${results.length} 条结果：`];
  results.forEach((r, i) => {
    lines.push("");
    lines.push(`[${i + 1}] ${r.title || "(无标题)"}`);
    lines.push(`URL: ${r.url}`);
    const meta = [];
    if (r.site_name) meta.push(`站点: ${r.site_name}`);
    if (r.date) meta.push(`日期: ${r.date}`);
    if (typeof r.rerank_score === "number") meta.push(`相关度: ${r.rerank_score}`);
    if (typeof r.authority === "number" && r.authority >= 0) {
      meta.push(`权威度: ${r.authority}`);
    }
    if (meta.length) lines.push(meta.join(" | "));
    // summary / snippet 按官方定义是纯文本，不做 Markdown 反转义，
    // 否则会改动文本里本身存在的反斜杠。
    if (r.summary) lines.push(`摘要: ${r.summary}`);
    else if (r.snippet) lines.push(`片段: ${r.snippet}`);
    if (r.content) {
      const t = truncate(unescapeMarkdown(r.content), contentLimit);
      lines.push(
        `正文: ${t.text}${t.truncated ? `\n…（已截断，剩余 ${t.omitted} 字符）` : ""}`,
      );
    }
  });
  return lines.join("\n");
}

function formatPage(url, page, maxChars) {
  const title = page.title || "(无标题)";
  const content = unescapeMarkdown(page.content);
  const t = truncate(content, maxChars);
  const tail = t.truncated
    ? `\n\n…（内容已截断：原文 ${content.length} 字符，仍有 ${t.omitted} 字符未返回）`
    : "";
  return `# ${title}\nURL: ${url}\n\n${t.text}${tail}`;
}

const server = new McpServer({ name: "deepseek-web", version: "1.0.0" });

server.registerTool(
  "deepseek_search",
  {
    title: "DeepSeek 网页搜索",
    description:
      "调用 DeepSeek 自研搜索引擎检索实时网页，返回标题、URL、摘要与相关度。支持 site:、lang:、after:/before:、\"精确短语\"、-排除 等查询运算符。",
    inputSchema: {
      query: z
        .string()
        .min(1)
        .max(128)
        .describe(
          '搜索词（1-128 字符），支持运算符，例如：DeepSeek site:github.com lang:en after:2025',
        ),
      count: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe("返回结果条数（1-50），不影响计费"),
      need_content: z
        .boolean()
        .default(false)
        .describe("是否附带每条结果的正文，会显著增加上下文长度"),
      content_chars: z
        .number()
        .int()
        .min(200)
        .max(20000)
        .default(DEFAULT_RESULT_CHARS)
        .describe("need_content=true 时每条正文的最大字符数"),
      ori_question: z
        .string()
        .max(128)
        .optional()
        .describe("触发本次搜索的原始问题，用于提升检索理解"),
      localization: z
        .string()
        .optional()
        .describe("用于本地化搜索结果的 IP 地址"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ query, count, need_content, content_chars, ori_question, localization }) => {
    try {
      const body = { query, count, need_content };
      if (ori_question) body.ori_question = ori_question;
      if (localization) body.localization = localization;
      const data = await post("/v1/tools/search", body, SEARCH_TIMEOUT_MS);
      const results = Array.isArray(data.results) ? data.results : [];
      return {
        content: [
          { type: "text", text: formatResults(query, results, content_chars) },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: String(err?.message || err) }],
      };
    }
  },
);

server.registerTool(
  "deepseek_fetch",
  {
    title: "DeepSeek 网页抓取",
    description:
      "调用 DeepSeek Fetch API 抓取单个网页并返回 Markdown 正文（由 DeepSeek 服务端抓取，不受本机网络和代理影响）。",
    inputSchema: {
      url: z
        .string()
        .min(1)
        .max(8192)
        .refine(isFetchableUrl, {
          message:
            "URL 必须是带主机名的 http/https 地址，且不能包含用户名或密码",
        })
        .describe("要抓取的网页 URL，必须是 http/https 且带主机名"),
      max_chars: z
        .number()
        .int()
        .min(500)
        .max(200000)
        .default(DEFAULT_FETCH_CHARS)
        .describe("返回正文的最大字符数，超出会截断"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ url, max_chars }) => {
    try {
      const data = await post("/v1/tools/fetch", { url }, FETCH_TIMEOUT_MS);
      return {
        content: [{ type: "text", text: formatPage(url, data, max_chars) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: String(err?.message || err) }],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[deepseek-web] 已启动，API 根地址: ${API_ROOT}`);
