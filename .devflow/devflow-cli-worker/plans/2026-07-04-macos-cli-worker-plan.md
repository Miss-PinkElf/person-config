# macOS devflow CLI Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 macOS devflow CLI Worker（devflow CLI Worker）、配套 Skill（Skill）和 macOS VSCode 插件入口（VSCode Extension Entry），让 worker 以可见、可介入的终端会话替代黑盒 subagent。

**Architecture:** 使用无第三方运行时依赖的 Node.js CLI（Node.js CLI）管理 session 目录、tmux（tmux）会话、macOS 外部终端与轮询逻辑。VSCode 插件（VSCode Extension）只负责在 macOS VSCode 内置终端（VSCode Integrated Terminal）启动 CLI。Skill（Skill）负责指导主 Agent（Main Agent）组装 prompt、轮询 worker、读取 result.md（Result File）并回写 devflow 记录。

**Tech Stack:** Node.js ESM（Node.js ESM）、tmux（tmux）、AppleScript / osascript（AppleScript / osascript）、VSCode Extension API（VSCode Extension API）、TypeScript（TypeScript）、node:assert 测试（node:assert Tests）。

---

## 实施原则

- 当前执行环境是 Windows，macOS 的 tmux（tmux）、iTerm2 / Terminal.app（macOS Terminal）冒烟验证必须在 Mac 上补跑。
- 本计划先保证纯逻辑、路径、命令组装、VSCode 插件 TypeScript（TypeScript）可在当前环境做静态或单元验证。
- 本仓库约束要求：完成代码修改后先询问用户是否需要提交代码；没有用户明确允许，不执行 commit。
- 本轮不实现 Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）或 Windows / WSL VSCode 入口。

## 文件结构

- Create: `tools/devflow-cli-worker/package.json`
  - CLI（CLI）子项目定义、测试命令、bin 入口。
- Create: `tools/devflow-cli-worker/bin/devflow-worker.mjs`
  - CLI 可执行入口，解析命令并调用实现。
- Create: `tools/devflow-cli-worker/src/session-store.mjs`
  - session 目录、result.md、prompt.md、cli-session.json、transcript.log、screen.txt 管理。
- Create: `tools/devflow-cli-worker/src/tmux-driver.mjs`
  - tmux 命令组装、发送输入、捕获 pane、kill / interrupt / key。
- Create: `tools/devflow-cli-worker/src/macos-terminal.mjs`
  - iTerm2 / Terminal.app 打开策略与 osascript 命令组装。
- Create: `tools/devflow-cli-worker/src/wait-agent.mjs`
  - diff-based 轮询等待逻辑。
- Create: `tools/devflow-cli-worker/src/cli.mjs`
  - `start`、`start-in-vscode`、`send`、`paste`、`get-info`、`capture`、`wait-agent`、`interrupt`、`key`、`kill`、`status`、`transcript` 命令实现。
- Create: `tools/devflow-cli-worker/src/*.test.mjs`
  - Node 内置断言测试。
- Create: `.codex/skills/devflow-cli-worker/SKILL.md`
  - 给主 Agent 使用 CLI Worker 的 Skill（Skill）。
- Create: `.codex/skills/devflow-cli-worker/references/prompt-template.md`
  - worker prompt 组装模板。
- Create: `vscode-extensions/devflow-cli-worker/package.json`
  - macOS VSCode 插件项目。
- Create: `vscode-extensions/devflow-cli-worker/tsconfig.json`
  - TypeScript 编译配置。
- Create: `vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`
  - VSCode 插件终端命令组装。
- Create: `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
  - 命令组装单元测试。
- Create: `vscode-extensions/devflow-cli-worker/src/extension.ts`
  - 注册命令、新开 VSCode 终端并启动 worker。
- Create: `vscode-extensions/devflow-cli-worker/README.md`
  - 插件安装与使用说明。

## Task 1: CLI Session Store

**Files:**
- Create: `tools/devflow-cli-worker/package.json`
- Create: `tools/devflow-cli-worker/bin/devflow-worker.mjs`
- Create: `tools/devflow-cli-worker/src/session-store.mjs`
- Create: `tools/devflow-cli-worker/src/session-store.test.mjs`

- [ ] **Step 1: 创建 CLI 子项目配置**

写入 `tools/devflow-cli-worker/package.json`：

```json
{
  "name": "devflow-cli-worker",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "bin": {
    "devflow-worker": "./bin/devflow-worker.mjs"
  },
  "scripts": {
    "test": "node src/session-store.test.mjs && node src/tmux-driver.test.mjs && node src/macos-terminal.test.mjs && node src/wait-agent.test.mjs && node src/cli.test.mjs"
  }
}
```

- [ ] **Step 2: 创建最小 CLI 入口**

写入 `tools/devflow-cli-worker/bin/devflow-worker.mjs`：

```js
#!/usr/bin/env node
import { runCli } from "../src/cli.mjs";

runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  env: process.env,
  stdout: process.stdout,
  stderr: process.stderr
}).catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
```

- [ ] **Step 3: 写 session store 失败测试**

写入 `tools/devflow-cli-worker/src/session-store.test.mjs`：

```js
import { equal, ok } from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSessionStore } from "./session-store.mjs";

const root = await mkdtemp(join(tmpdir(), "devflow-worker-test-"));

try {
  const store = createSessionStore({ repoRoot: root });
  const session = await store.createSession({
    workerId: "alpha",
    command: "codex",
    prompt: "原始提示词",
    visualMode: "terminal"
  });

  equal(session.workerId, "alpha");
  equal(session.relativeResultPath, ".devflow/devflow-cli-worker/sessions/alpha/result.md");
  ok(session.absoluteResultPath.endsWith("result.md"));

  const result = await readFile(session.absoluteResultPath, "utf8");
  equal(result, "");

  const prompt = await readFile(session.absolutePromptPath, "utf8");
  equal(prompt, "原始提示词");

  const metadata = JSON.parse(await readFile(session.absoluteMetadataPath, "utf8"));
  equal(metadata.workerId, "alpha");
  equal(metadata.status, "created");

  console.log("session-store tests passed");
} finally {
  await rm(root, { recursive: true, force: true });
}
```

- [ ] **Step 4: 运行测试确认失败**

Run:

```powershell
node tools/devflow-cli-worker/src/session-store.test.mjs
```

Expected: FAIL，错误包含 `Cannot find module` 或 `createSessionStore` 未定义。

- [ ] **Step 5: 实现 session store**

写入 `tools/devflow-cli-worker/src/session-store.mjs`：

```js
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const SESSION_ROOT = ".devflow/devflow-cli-worker/sessions";

export function createSessionStore({ repoRoot }) {
  const absoluteRepoRoot = resolve(repoRoot);

  function resolveSession(workerId) {
    const relativeSessionPath = `${SESSION_ROOT}/${workerId}`;
    const absoluteSessionPath = join(absoluteRepoRoot, relativeSessionPath);

    return {
      workerId,
      relativeSessionPath,
      absoluteSessionPath,
      relativeResultPath: `${relativeSessionPath}/result.md`,
      absoluteResultPath: join(absoluteSessionPath, "result.md"),
      absolutePromptPath: join(absoluteSessionPath, "prompt.md"),
      absoluteMetadataPath: join(absoluteSessionPath, "cli-session.json"),
      absoluteTranscriptPath: join(absoluteSessionPath, "transcript.log"),
      absoluteScreenPath: join(absoluteSessionPath, "screen.txt")
    };
  }

  async function createSession({ workerId, command, prompt, visualMode }) {
    validateWorkerId(workerId);
    const session = resolveSession(workerId);
    await mkdir(session.absoluteSessionPath, { recursive: true });
    await writeFile(session.absoluteResultPath, "", "utf8");
    await writeFile(session.absolutePromptPath, prompt, "utf8");

    const metadata = {
      workerId,
      command,
      visualMode,
      status: "created",
      tmuxSessionName: `devflow-worker-${workerId}`,
      relativeSessionPath: session.relativeSessionPath,
      relativeResultPath: session.relativeResultPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await writeJson(session.absoluteMetadataPath, metadata);
    await writeFile(session.absoluteTranscriptPath, "", "utf8");
    await writeFile(session.absoluteScreenPath, "", "utf8");
    return { ...session, ...metadata };
  }

  async function readSession(workerId) {
    const session = resolveSession(workerId);
    const metadata = JSON.parse(await readFile(session.absoluteMetadataPath, "utf8"));
    return { ...session, ...metadata };
  }

  async function updateSession(workerId, patch) {
    const session = await readSession(workerId);
    const next = { ...session, ...patch, updatedAt: new Date().toISOString() };
    await writeJson(session.absoluteMetadataPath, pickMetadata(next));
    return next;
  }

  async function appendTranscript(workerId, line) {
    const session = resolveSession(workerId);
    await mkdir(dirname(session.absoluteTranscriptPath), { recursive: true });
    await appendFile(session.absoluteTranscriptPath, `${new Date().toISOString()} ${line}\n`, "utf8");
  }

  return { resolveSession, createSession, readSession, updateSession, appendTranscript };
}

function validateWorkerId(workerId) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(workerId)) {
    throw new Error("worker id 只能包含字母、数字、点、下划线和短横线，且长度不超过 64。");
  }
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function pickMetadata(session) {
  return {
    workerId: session.workerId,
    command: session.command,
    visualMode: session.visualMode,
    status: session.status,
    tmuxSessionName: session.tmuxSessionName,
    relativeSessionPath: session.relativeSessionPath,
    relativeResultPath: session.relativeResultPath,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt
  };
}
```

- [ ] **Step 6: 运行测试确认通过**

Run:

```powershell
node tools/devflow-cli-worker/src/session-store.test.mjs
```

Expected: PASS，输出 `session-store tests passed`。

## Task 2: tmux Driver

**Files:**
- Create: `tools/devflow-cli-worker/src/tmux-driver.mjs`
- Create: `tools/devflow-cli-worker/src/tmux-driver.test.mjs`

- [ ] **Step 1: 写 tmux driver 测试**

写入 `tools/devflow-cli-worker/src/tmux-driver.test.mjs`：

```js
import { deepEqual, equal } from "node:assert/strict";
import { createTmuxDriver, quoteForShell } from "./tmux-driver.mjs";

equal(quoteForShell("a b"), "'a b'");
equal(quoteForShell("a'b"), "'a'\"'\"'b'");

const calls = [];
const driver = createTmuxDriver({
  execFile: async (file, args) => {
    calls.push([file, args]);
    return { stdout: "screen\n", stderr: "" };
  }
});

await driver.newSession({ sessionName: "devflow-worker-alpha", cwd: "/repo", command: "codex" });
await driver.sendText({ sessionName: "devflow-worker-alpha", text: "hello", submit: true });
const screen = await driver.capturePane({ sessionName: "devflow-worker-alpha" });

deepEqual(calls[0], ["tmux", ["new-session", "-d", "-s", "devflow-worker-alpha", "-c", "/repo", "codex"]]);
deepEqual(calls[1], ["tmux", ["send-keys", "-t", "devflow-worker-alpha", "hello", "Enter"]]);
deepEqual(calls[2], ["tmux", ["capture-pane", "-p", "-t", "devflow-worker-alpha"]]);
equal(screen, "screen\n");

console.log("tmux-driver tests passed");
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```powershell
node tools/devflow-cli-worker/src/tmux-driver.test.mjs
```

Expected: FAIL，提示 `tmux-driver.mjs` 不存在。

- [ ] **Step 3: 实现 tmux driver**

写入 `tools/devflow-cli-worker/src/tmux-driver.mjs`：

```js
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const defaultExecFile = promisify(execFileCallback);

export function createTmuxDriver({ execFile = defaultExecFile } = {}) {
  async function run(args) {
    try {
      return await execFile("tmux", args, { encoding: "utf8" });
    } catch (error) {
      const message = error.code === "ENOENT"
        ? "未找到 tmux（tmux）。请先在 macOS 上安装 tmux，例如：brew install tmux。"
        : `tmux 命令失败：${error.message}`;
      throw new Error(message);
    }
  }

  return {
    async newSession({ sessionName, cwd, command }) {
      await run(["new-session", "-d", "-s", sessionName, "-c", cwd, command]);
    },

    async sendText({ sessionName, text, submit }) {
      const args = ["send-keys", "-t", sessionName, text];
      if (submit) {
        args.push("Enter");
      }
      await run(args);
    },

    async sendKey({ sessionName, key }) {
      await run(["send-keys", "-t", sessionName, key]);
    },

    async capturePane({ sessionName }) {
      const result = await run(["capture-pane", "-p", "-t", sessionName]);
      return result.stdout;
    },

    async killSession({ sessionName }) {
      await run(["kill-session", "-t", sessionName]);
    }
  };
}

export function quoteForShell(value) {
  return `'${String(value).replaceAll("'", "'\"'\"'")}'`;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```powershell
node tools/devflow-cli-worker/src/tmux-driver.test.mjs
```

Expected: PASS，输出 `tmux-driver tests passed`。

## Task 3: macOS Terminal Opener

**Files:**
- Create: `tools/devflow-cli-worker/src/macos-terminal.mjs`
- Create: `tools/devflow-cli-worker/src/macos-terminal.test.mjs`

- [ ] **Step 1: 写 macOS terminal opener 测试**

写入 `tools/devflow-cli-worker/src/macos-terminal.test.mjs`：

```js
import { ok } from "node:assert/strict";
import { buildTerminalScript, buildITermScript } from "./macos-terminal.mjs";

const terminalScript = buildTerminalScript({ attachCommand: "tmux attach -t devflow-worker-alpha" });
ok(terminalScript.includes("Terminal"));
ok(terminalScript.includes("tmux attach -t devflow-worker-alpha"));

const itermScript = buildITermScript({ attachCommand: "tmux attach -t devflow-worker-alpha" });
ok(itermScript.includes("iTerm2"));
ok(itermScript.includes("write text"));

console.log("macos-terminal tests passed");
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```powershell
node tools/devflow-cli-worker/src/macos-terminal.test.mjs
```

Expected: FAIL，提示 `macos-terminal.mjs` 不存在。

- [ ] **Step 3: 实现 macOS terminal opener**

写入 `tools/devflow-cli-worker/src/macos-terminal.mjs`：

```js
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const defaultExecFile = promisify(execFileCallback);

export function createMacOSTerminalOpener({ execFile = defaultExecFile } = {}) {
  return {
    async open({ terminalApp, attachCommand }) {
      const script = terminalApp === "iterm"
        ? buildITermScript({ attachCommand })
        : buildTerminalScript({ attachCommand });
      await execFile("osascript", ["-e", script], { encoding: "utf8" });
    }
  };
}

export function buildTerminalScript({ attachCommand }) {
  return [
    'tell application "Terminal"',
    "activate",
    `do script ${JSON.stringify(attachCommand)}`,
    "end tell"
  ].join("\n");
}

export function buildITermScript({ attachCommand }) {
  return [
    'tell application "iTerm2"',
    "activate",
    "create window with default profile",
    `tell current session of current window to write text ${JSON.stringify(attachCommand)}`,
    "end tell"
  ].join("\n");
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```powershell
node tools/devflow-cli-worker/src/macos-terminal.test.mjs
```

Expected: PASS，输出 `macos-terminal tests passed`。

## Task 4: wait-agent 轮询

**Files:**
- Create: `tools/devflow-cli-worker/src/wait-agent.mjs`
- Create: `tools/devflow-cli-worker/src/wait-agent.test.mjs`

- [ ] **Step 1: 写 wait-agent 测试**

写入 `tools/devflow-cli-worker/src/wait-agent.test.mjs`：

```js
import { equal } from "node:assert/strict";
import { waitForStableScreen } from "./wait-agent.mjs";

const screens = ["a", "b", "b", "b"];
let index = 0;

const result = await waitForStableScreen({
  capture: async () => screens[Math.min(index++, screens.length - 1)],
  sleep: async () => {},
  now: (() => {
    let time = 0;
    return () => {
      time += 1000;
      return time;
    };
  })(),
  timeoutMs: 10000,
  pollMs: 1000,
  staleMs: 2000
});

equal(result.status, "stale");
equal(result.screen, "b");

console.log("wait-agent tests passed");
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```powershell
node tools/devflow-cli-worker/src/wait-agent.test.mjs
```

Expected: FAIL，提示 `wait-agent.mjs` 不存在。

- [ ] **Step 3: 实现 wait-agent**

写入 `tools/devflow-cli-worker/src/wait-agent.mjs`：

```js
export async function waitForStableScreen({
  capture,
  sleep = defaultSleep,
  now = Date.now,
  timeoutMs = 1200_000,
  pollMs = 15_000,
  staleMs = 30_000
}) {
  const startedAt = now();
  let lastScreen = await capture();
  let lastChangedAt = now();

  while (now() - startedAt < timeoutMs) {
    await sleep(pollMs);
    const screen = await capture();

    if (screen !== lastScreen) {
      lastScreen = screen;
      lastChangedAt = now();
      continue;
    }

    if (now() - lastChangedAt >= staleMs) {
      return { status: "stale", screen: lastScreen };
    }
  }

  return { status: "timeout", screen: lastScreen };
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:

```powershell
node tools/devflow-cli-worker/src/wait-agent.test.mjs
```

Expected: PASS，输出 `wait-agent tests passed`。

## Task 5: CLI Commands

**Files:**
- Create: `tools/devflow-cli-worker/src/cli.mjs`
- Create: `tools/devflow-cli-worker/src/cli.test.mjs`
- Modify: `tools/devflow-cli-worker/bin/devflow-worker.mjs`

- [ ] **Step 1: 写 CLI 命令测试**

写入 `tools/devflow-cli-worker/src/cli.test.mjs`：

```js
import { ok, equal } from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCli } from "./cli.mjs";

const root = await mkdtemp(join(tmpdir(), "devflow-cli-test-"));
const output = [];
const fakeTmux = {
  newSession: async () => {},
  sendText: async () => {},
  sendKey: async () => {},
  capturePane: async () => "worker screen",
  killSession: async () => {}
};
const fakeTerminal = { open: async () => {} };

try {
  await runCli(["start", "--id", "alpha", "--command", "codex", "--prompt", "原始提示词"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal
  });

  ok(output.join("").includes(".devflow/devflow-cli-worker/sessions/alpha/result.md"));

  await runCli(["capture", "alpha"], {
    cwd: root,
    stdout: { write: (text) => output.push(text) },
    stderr: { write: (text) => output.push(text) },
    tmux: fakeTmux,
    terminal: fakeTerminal
  });

  const screen = await readFile(join(root, ".devflow/devflow-cli-worker/sessions/alpha/screen.txt"), "utf8");
  equal(screen, "worker screen");

  console.log("cli tests passed");
} finally {
  await rm(root, { recursive: true, force: true });
}
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```powershell
node tools/devflow-cli-worker/src/cli.test.mjs
```

Expected: FAIL，提示 `cli.mjs` 不存在或 `runCli` 未导出。

- [ ] **Step 3: 实现 CLI 命令分发**

写入 `tools/devflow-cli-worker/src/cli.mjs`：

```js
import { readFile, writeFile } from "node:fs/promises";
import { createSessionStore } from "./session-store.mjs";
import { createTmuxDriver } from "./tmux-driver.mjs";
import { createMacOSTerminalOpener } from "./macos-terminal.mjs";
import { waitForStableScreen } from "./wait-agent.mjs";

export async function runCli(argv, options) {
  const context = createContext(options);
  const [command, ...rest] = argv;

  if (command === "start") return start(rest, context, "terminal");
  if (command === "start-in-vscode") return start(rest, context, "vscode");
  if (command === "send") return send(rest, context, true);
  if (command === "paste") return send(rest, context, false);
  if (command === "capture") return capture(rest, context);
  if (command === "get-info") return getInfo(rest, context);
  if (command === "wait-agent") return waitAgent(rest, context);
  if (command === "interrupt") return keyCommand(rest, context, "C-c");
  if (command === "key") return keyCommand(rest, context);
  if (command === "kill") return kill(rest, context);
  if (command === "status") return status(rest, context);
  if (command === "transcript") return transcript(rest, context);

  throw new Error("未知命令。可用命令：start、start-in-vscode、send、paste、capture、get-info、wait-agent、interrupt、key、kill、status、transcript。");
}

function createContext(options) {
  return {
    cwd: options.cwd,
    stdout: options.stdout,
    stderr: options.stderr,
    store: createSessionStore({ repoRoot: options.cwd }),
    tmux: options.tmux ?? createTmuxDriver(),
    terminal: options.terminal ?? createMacOSTerminalOpener()
  };
}

async function start(args, context, visualMode) {
  const id = readOption(args, "--id") ?? `worker-${Date.now()}`;
  const command = readOption(args, "--command") ?? "codex";
  const prompt = readOption(args, "--prompt") ?? "";
  const terminalApp = readOption(args, "--terminal") ?? "terminal";
  const session = await context.store.createSession({ workerId: id, command, prompt, visualMode });

  await context.tmux.newSession({
    sessionName: session.tmuxSessionName,
    cwd: context.cwd,
    command
  });

  if (prompt) {
    await context.tmux.sendText({ sessionName: session.tmuxSessionName, text: prompt, submit: true });
  }

  if (visualMode === "terminal") {
    await context.terminal.open({
      terminalApp,
      attachCommand: `tmux attach -t ${session.tmuxSessionName}`
    });
  }

  await context.store.updateSession(id, { status: "running" });
  await context.store.appendTranscript(id, `start command=${command} result=${session.relativeResultPath}`);
  context.stdout.write(`worker ${id} started\nresult: ${session.relativeResultPath}\n`);
}

async function send(args, context, submit) {
  const [id, ...messageParts] = args;
  const session = await context.store.readSession(id);
  const text = messageParts.join(" ");
  await context.tmux.sendText({ sessionName: session.tmuxSessionName, text, submit });
  await context.store.appendTranscript(id, `${submit ? "send" : "paste"} ${text}`);
}

async function capture(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  const screen = await context.tmux.capturePane({ sessionName: session.tmuxSessionName });
  await writeFile(session.absoluteScreenPath, screen, "utf8");
  context.stdout.write(screen);
}

async function getInfo(args, context) {
  const [id] = args;
  const tail = Number(readOption(args, "--tail") ?? "20");
  const session = await context.store.readSession(id);
  const screen = await context.tmux.capturePane({ sessionName: session.tmuxSessionName });
  const lines = screen.split(/\r?\n/).slice(-tail).join("\n");
  context.stdout.write(JSON.stringify({
    workerId: session.workerId,
    status: session.status,
    result: session.relativeResultPath,
    tail: lines
  }, null, 2) + "\n");
}

async function waitAgent(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  const result = await waitForStableScreen({
    capture: () => context.tmux.capturePane({ sessionName: session.tmuxSessionName }),
    timeoutMs: Number(readOption(args, "--timeout") ?? "1200") * 1000,
    pollMs: Number(readOption(args, "--poll") ?? "15") * 1000,
    staleMs: Number(readOption(args, "--stale") ?? "30") * 1000
  });
  context.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

async function keyCommand(args, context, defaultKey) {
  const [id, key = defaultKey] = args;
  const session = await context.store.readSession(id);
  await context.tmux.sendKey({ sessionName: session.tmuxSessionName, key });
}

async function kill(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  await context.tmux.killSession({ sessionName: session.tmuxSessionName });
  await context.store.updateSession(id, { status: "killed" });
}

async function status(args, context) {
  const [id] = args;
  const session = await context.store.readSession(id);
  context.stdout.write(JSON.stringify(session, null, 2) + "\n");
}

async function transcript(args, context) {
  const [id] = args;
  const session = context.store.resolveSession(id);
  context.stdout.write(await readFile(session.absoluteTranscriptPath, "utf8"));
}

function readOption(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
```

- [ ] **Step 4: 运行 CLI 测试**

Run:

```powershell
node tools/devflow-cli-worker/src/cli.test.mjs
```

Expected: PASS，输出 `cli tests passed`。

- [ ] **Step 5: 运行 CLI 子项目测试**

Run:

```powershell
npm --prefix tools/devflow-cli-worker test
```

Expected: PASS，所有 CLI 逻辑测试通过。

## Task 6: Skill 文档

**Files:**
- Create: `.codex/skills/devflow-cli-worker/SKILL.md`
- Create: `.codex/skills/devflow-cli-worker/references/prompt-template.md`

- [ ] **Step 1: 写 Skill 主文档**

写入 `.codex/skills/devflow-cli-worker/SKILL.md`：

```markdown
---
name: devflow-cli-worker
description: |
  当需要把黑盒 subagent 改成可见、可介入的独立 CLI worker 时使用本技能。适用于用户要求“不要黑盒 subagent”、“开一个可见 worker”、“让主 Agent 操作终端里的 codex/claude”、“多 worker 并行”、“轮询 worker 状态”、“把结果写到 result.md”或在 devflow mission 中分派可观察子任务。本技能指导主 Agent 使用 devflow Worker CLI（devflow Worker CLI）启动、观察、控制、轮询并收回 worker 结果。
---

# devflow CLI Worker

## 适用范围

使用 devflow Worker CLI（devflow Worker CLI）把子任务放进可见、可介入的 macOS tmux（tmux）会话中运行。

本技能默认只覆盖 macOS。Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口不在本轮范围内。

## 核心原则

- 保留用户原始提示词（Original Prompt），不要改写。
- 每个 worker 必须有独立 worker id。
- 每个 worker 必须写入自己的 result.md（Result File）。
- 主 Agent 必须轮询观察，不要长时间盲等。
- worker 的长期结论必须回写到当前 devflow mission，不把 session 附件当成唯一真相源。

## 启动流程

1. 选择 worker id，例如 `research-a`。
2. 读取 `references/prompt-template.md`。
3. 组装 prompt，明确写入 result.md 相对路径。
4. 运行：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id research-a --command codex --prompt "<assembled prompt>"
```

## 观察与控制

优先使用轻量轮询：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info research-a --tail 5
```

需要发送下一步指令：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs send research-a "继续执行下一步，并把结论写入 result.md"
```

需要等待但不能盲等：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent research-a --timeout 1200 --poll 15 --stale 30
```

## 多 worker 并行

多 worker 并行（Parallel Workers）时，不要同时长阻塞多个 `wait-agent`。

推荐循环读取：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info worker-a --tail 5
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info worker-b --tail 5
```

## 收回结果

读取对应 session 的 result.md，并将有效结论整合回当前任务。

结果路径格式：

```text
.devflow/devflow-cli-worker/sessions/<worker-id>/result.md
```
```

- [ ] **Step 2: 写 prompt 模板**

写入 `.codex/skills/devflow-cli-worker/references/prompt-template.md`：

```markdown
# Worker Prompt Template

你是一个可见 CLI worker（Visible CLI Worker），正在被主 Agent（Main Agent）通过 devflow Worker CLI（devflow Worker CLI）观察和控制。

## Worker 信息

- worker id：`{{WORKER_ID}}`
- result.md 相对路径：`{{RESULT_PATH}}`

## 必须遵守

1. 保留并执行用户原始提示词（Original Prompt）。
2. 如果需要阶段性汇报，直接在终端输出简短状态。
3. 完成后必须把最终结论写入 `{{RESULT_PATH}}`。
4. 如果无法完成，也必须在 `{{RESULT_PATH}}` 写明阻塞原因、已尝试动作和建议下一步。

## 用户原始提示词

{{ORIGINAL_PROMPT}}
```

- [ ] **Step 3: 自检 Skill 触发语**

Run:

```powershell
Select-String -Path '.codex/skills/devflow-cli-worker/SKILL.md' -Pattern '黑盒|worker|result.md|轮询|devflow'
```

Expected: 能匹配到技能触发相关关键词，且没有英文-only 文档。

## Task 7: macOS VSCode 插件入口

**Files:**
- Create: `vscode-extensions/devflow-cli-worker/package.json`
- Create: `vscode-extensions/devflow-cli-worker/tsconfig.json`
- Create: `vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`
- Create: `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
- Create: `vscode-extensions/devflow-cli-worker/src/extension.ts`
- Create: `vscode-extensions/devflow-cli-worker/README.md`

- [ ] **Step 1: 创建 VSCode 插件 package.json**

写入 `vscode-extensions/devflow-cli-worker/package.json`：

```json
{
  "name": "devflow-cli-worker",
  "displayName": "devflow CLI Worker",
  "description": "Start a visible devflow CLI worker from a macOS VSCode terminal.",
  "version": "0.1.0",
  "publisher": "local",
  "engines": {
    "vscode": "^1.90.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onCommand:devflowCliWorker.start"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "devflowCliWorker.start",
        "title": "Start devflow CLI Worker"
      }
    ]
  },
  "scripts": {
    "compile": "tsc -p ./",
    "test": "node out/commandBuilder.test.js",
    "package": "vsce package --no-dependencies"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/vscode": "^1.90.0",
    "@vscode/vsce": "^3.1.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig**

写入 `vscode-extensions/devflow-cli-worker/tsconfig.json`：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": [
      "ES2022"
    ],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  },
  "include": [
    "src"
  ]
}
```

- [ ] **Step 3: 写命令构造测试**

写入 `vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`：

```ts
import { equal, ok } from "node:assert/strict";
import { buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

equal(sanitizeWorkerId("My Worker 01"), "my-worker-01");
equal(sanitizeWorkerId(""), "worker");

const command = buildStartWorkerCommand({
  workspacePath: "/Users/demo/project",
  workerId: "macos-worker",
  cliRelativePath: "tools/devflow-cli-worker/bin/devflow-worker.mjs"
});

ok(command.includes("cd '/Users/demo/project'"));
ok(command.includes("node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id macos-worker"));

console.log("commandBuilder tests passed");
```

- [ ] **Step 4: 实现命令构造**

写入 `vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`：

```ts
export interface BuildStartWorkerCommandInput {
  workspacePath: string;
  workerId: string;
  cliRelativePath: string;
}

export function buildStartWorkerCommand(input: BuildStartWorkerCommandInput): string {
  return [
    `cd ${quoteForShell(input.workspacePath)}`,
    `node ${input.cliRelativePath} start-in-vscode --id ${input.workerId} --command codex`
  ].join(" && ");
}

export function sanitizeWorkerId(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "worker";
}

function quoteForShell(value: string): string {
  return `'${value.replace(/'/g, "'\"'\"'")}'`;
}
```

- [ ] **Step 5: 实现 VSCode extension**

写入 `vscode-extensions/devflow-cli-worker/src/extension.ts`：

```ts
import * as vscode from "vscode";
import { buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

const START_COMMAND = "devflowCliWorker.start";
const CLI_RELATIVE_PATH = "tools/devflow-cli-worker/bin/devflow-worker.mjs";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(START_COMMAND, startWorker);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // VSCode 扩展生命周期（Extension Lifecycle）要求保留该出口。
}

async function startWorker(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage("请先打开一个工作区再启动 devflow worker。");
    return;
  }

  const input = await vscode.window.showInputBox({
    title: "devflow worker id",
    prompt: "输入 worker id，用于 session 目录和 tmux 会话名。",
    value: "macos-worker"
  });

  if (input === undefined) {
    return;
  }

  const workerId = sanitizeWorkerId(input);
  const command = buildStartWorkerCommand({
    workspacePath: workspaceFolder.uri.fsPath,
    workerId,
    cliRelativePath: CLI_RELATIVE_PATH
  });

  const terminal = vscode.window.createTerminal({ name: `devflow worker: ${workerId}` });
  terminal.show();
  terminal.sendText(command, true);
}
```

- [ ] **Step 6: 写 README**

写入 `vscode-extensions/devflow-cli-worker/README.md`：

```markdown
# devflow CLI Worker VSCode Extension

本插件用于 macOS VSCode（VSCode Extension）中快速新开终端并启动 devflow CLI Worker（devflow CLI Worker）。

## 范围

- 支持 macOS VSCode 内置终端（VSCode Integrated Terminal）。
- 不支持 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）。
- 不提供 worker 管理 UI（User Interface）。

## 使用

1. 在 VSCode 中打开仓库根目录。
2. 运行命令：`Start devflow CLI Worker`。
3. 输入 worker id。
4. 插件会新开终端并执行：

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex
```
```

- [ ] **Step 7: 安装依赖并编译插件**

Run:

```powershell
npm --prefix vscode-extensions/devflow-cli-worker install
npm --prefix vscode-extensions/devflow-cli-worker run compile
```

Expected: PASS，TypeScript（TypeScript）编译通过。若当前环境网络受限导致 install 失败，记录为验证阻塞并在已有 `vscode-send-ref-to-terminal` 依赖模式下补跑。

- [ ] **Step 8: 运行插件测试**

Run:

```powershell
npm --prefix vscode-extensions/devflow-cli-worker test
```

Expected: PASS，输出 `commandBuilder tests passed`。

## Task 8: 文档与验证清单

**Files:**
- Create: `tools/devflow-cli-worker/README.md`
- Modify: `.devflow/devflow-cli-worker/state.md`
- Modify: `.devflow/devflow-cli-worker/checkpoints.md`

- [ ] **Step 1: 写 CLI README**

写入 `tools/devflow-cli-worker/README.md`：

```markdown
# devflow CLI Worker

devflow CLI Worker（devflow CLI Worker）用于在 macOS 上启动可见、可介入的 worker 会话。

## 依赖

- macOS
- Node.js
- tmux（tmux）
- Terminal.app 或 iTerm2

## 常用命令

```bash
node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id research-a --command codex --prompt "把结果写到 result.md"
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info research-a --tail 5
node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent research-a --timeout 1200 --poll 15 --stale 30
node tools/devflow-cli-worker/bin/devflow-worker.mjs send research-a "继续，并更新 result.md"
node tools/devflow-cli-worker/bin/devflow-worker.mjs kill research-a
```

## Session 文件

```text
.devflow/devflow-cli-worker/sessions/<worker-id>/
├── cli-session.json
├── result.md
├── transcript.log
├── screen.txt
└── prompt.md
```

## 当前限制

- Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）不在本轮范围内。
- macOS 真实终端冒烟验证需要在 Mac 上执行。
```

- [ ] **Step 2: 运行可在 Windows 执行的验证**

Run:

```powershell
npm --prefix tools/devflow-cli-worker test
npm --prefix vscode-extensions/devflow-cli-worker run compile
npm --prefix vscode-extensions/devflow-cli-worker test
```

Expected: CLI 纯逻辑测试通过；VSCode 插件编译和命令构造测试通过。

- [ ] **Step 3: 记录 macOS 手工验证命令**

在最终交付说明中列出以下 Mac 验证命令：

```bash
tmux -V
node tools/devflow-cli-worker/bin/devflow-worker.mjs start --id smoke-a --command bash --prompt "echo ok > .devflow/devflow-cli-worker/sessions/smoke-a/result.md"
node tools/devflow-cli-worker/bin/devflow-worker.mjs get-info smoke-a --tail 5
node tools/devflow-cli-worker/bin/devflow-worker.mjs wait-agent smoke-a --timeout 60 --poll 5 --stale 10
node tools/devflow-cli-worker/bin/devflow-worker.mjs kill smoke-a
```

Expected: Mac 上能打开可见终端、创建 tmux 会话、捕获屏幕、轮询 stale、写入 result.md。

- [ ] **Step 4: 更新 devflow 状态**

将 `.devflow/devflow-cli-worker/state.md` 更新为：

```markdown
# devflow-cli-worker 状态

## 当前快照

- Mission：devflow-cli-worker
- 路径：重型路径（Heavy Path）
- 阶段：Plan（计划）已完成，等待 Propose / Tasks
- 当前主线：macOS CLI（CLI）、macOS VSCode 插件入口（VSCode Extension Entry）、Skill（Skill）实施计划已落盘。
- Align 文档：`plans/2026-07-04-macos-cli-worker-align.md`
- Plan 文档：`plans/2026-07-04-macos-cli-worker-plan.md`
- 延期项：`deferred/vscode-wsl-worker-entry.md`

## 下一步

1. 创建 proposal.md、design.md、tasks.md。
2. 用户确认后进入 Apply（实施）。
3. 实施后在 Windows 做静态/单元验证，在 macOS 补跑终端冒烟验证。
```

- [ ] **Step 5: 提交前询问用户**

不要执行 commit。完成本任务后向用户询问是否需要提交代码，提交信息必须使用中文。

## 自检

- Spec 覆盖：计划覆盖 CLI、Skill、macOS VSCode 插件入口、session 文件、轮询、多 worker、延期项和验证。
- 占位扫描：计划不包含待填写实现项；所有新增文件都有明确内容。
- 类型一致：CLI 使用 ESM（ESM）；VSCode 插件使用 TypeScript（TypeScript）与现有 `vscode-send-ref-to-terminal` 项目结构一致。
- 环境风险：macOS 终端集成无法在当前 Windows 环境完整验证，已在验证任务中明确 Mac 手工冒烟命令。
