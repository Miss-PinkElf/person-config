# devflow CLI Worker Design

## 总体结构

本轮由三个模块组成：

1. macOS Worker CLI（macOS Worker CLI）：位于 `tools/devflow-cli-worker/`，负责 session 文件、tmux 控制、macOS 外部终端和轮询。
2. Worker Skill（Worker Skill）：位于 `.codex/skills/devflow-cli-worker/`，负责指导主 Agent（Main Agent）使用 CLI worker。
3. macOS VSCode 插件入口（macOS VSCode Extension Entry）：位于 `vscode-extensions/devflow-cli-worker/`，负责在 VSCode 内置终端启动 CLI。

## CLI 模块

### session-store.mjs

负责 `.devflow/devflow-cli-worker/sessions/<worker-id>/` 下的文件管理：

- 创建 session 目录。
- 预创建 `result.md`、`prompt.md`、`transcript.log`、`screen.txt`。
- 维护 `cli-session.json`。
- 提供 `readSession`、`updateSession`、`appendTranscript`。

### tmux-driver.mjs

负责 tmux（tmux）命令封装：

- `newSession`
- `sendText`
- `sendKey`
- `capturePane`
- `killSession`

该模块只做命令封装，不负责业务状态。

### macos-terminal.mjs

负责构造并执行 osascript（osascript）：

- Terminal.app 默认打开。
- iTerm2 可通过参数选择。
- 打开失败时由 CLI 上层处理错误。

### wait-agent.mjs

负责 diff-based 轮询：

- `capture` 函数由调用方传入。
- 屏幕变化时刷新 `lastChangedAt`。
- 屏幕稳定超过 stale 阈值后返回 `stale`。
- timeout 后返回 `timeout`。

### cli.mjs

负责命令分发和模块编排：

- `start` 创建 session、启动 tmux、发送 prompt、打开外部终端。
- `start-in-vscode` 创建 session、启动 tmux、发送 prompt，但不打开外部终端。
- `capture` 写入 `screen.txt`。
- `get-info` 输出结构化 JSON。
- `wait-agent` 输出结构化 JSON。

## Skill 模块

Skill（Skill）不实现控制逻辑，只规定主 Agent 使用 CLI 的流程：

- 何时启动 worker。
- 如何保留用户原始提示词（Original Prompt）。
- 如何写入 result.md（Result File）路径。
- 如何轮询和处理 stale。
- 如何收回结果并回写 devflow。

## macOS VSCode 插件入口

插件使用 VSCode Extension API（VSCode Extension API）：

- 注册 `devflowCliWorker.start` 命令。
- 提示用户输入 worker id。
- 使用 `vscode.window.createTerminal` 创建终端。
- 发送 `node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id <worker-id> --command codex && tmux attach -t devflow-worker-<worker-id>`。

插件第一版不管理 worker 状态，不打开 result.md，不做 Windows / WSL 适配。

## 数据流

1. 主 Agent 或 VSCode 插件调用 CLI。
2. CLI 创建 session 文件。
3. CLI 创建 tmux session。
4. CLI 发送 prompt。
5. 用户在可见终端中观察或介入。
6. 主 Agent 使用 `get-info` / `wait-agent` 轮询。
7. worker 把结果写入 `result.md`。
8. 主 Agent 读取 result.md 并整合回当前 devflow mission。

## 验证策略

- Windows 当前环境：运行 Node.js 单元测试、VSCode TypeScript 编译与命令构造测试。
- macOS 后续环境：运行 tmux、Terminal.app / iTerm2、VSCode 内置终端冒烟测试。
