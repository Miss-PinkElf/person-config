# VSCode 内置终端闭环冒烟测试对齐记录

## 目标

在 macOS 的 VSCode 内置终端（VSCode Integrated Terminal）中，通过现有插件命令启动可见 CLI worker（Visible CLI Worker），验证主 Agent（Main Agent）能够清空 Codex CLI（Codex CLI）对话、发送原始提示词、观察状态并收回 `result.md`（Result File）。

## 范围与成功条件

- 使用已安装的 `local.devflow-cli-worker` 插件的 `Start devflow CLI Worker` 命令，新建名为 `devflow worker: vscode-smoke` 的 VSCode 内置终端。
- 终端执行 `start-in-vscode` 后 attach 到 `tmux` 会话 `devflow-worker-vscode-smoke`，并显示 Codex CLI。
- 主 Agent 通过 Worker CLI（Worker CLI）执行 `send vscode-smoke "/clear"` 与 `key vscode-smoke Enter`，确认 Codex CLI 进入新对话。
- 主 Agent 使用原始测试提示词启动写入 `.devflow/devflow-cli-worker/sessions/vscode-smoke/result.md` 的任务，并通过 `get-info` 轮询会话状态。
- 读取 `result.md`，确认其包含 worker 的结论；测试后执行 `kill vscode-smoke` 清理临时 `tmux` 会话。

## 方案比较

1. VSCode 插件真实闭环测试（推荐）：验证命令面板、内置终端、`tmux` attach 与 CLI 控制的完整路径，能覆盖当前唯一未验证的入口。
2. 直接运行 `start-in-vscode`：可验证 CLI 创建会话，但不会证明 VSCode 插件能创建和显示内置终端。
3. 仅运行单元测试：速度最快，但不能验证用户实际使用的 GUI（Graphical User Interface）路径。

本轮选择方案 1；不新增 worker 管理 UI（User Interface）、状态面板或 `result.md` 快捷打开能力。

## 交互与数据流

```text
VSCode 命令面板
  -> 新建内置终端
  -> start-in-vscode + tmux attach
  -> Codex CLI worker（可见）

主 Agent
  -> send / key / get-info / kill
  -> tmux 会话
  -> result.md
```

VSCode 终端只承担可见与人工介入入口；会话控制保持在现有 Worker CLI，以复用已通过 iTerm2 验证的控制协议。

## 错误处理

- 插件命令未显示、终端未创建或未 attach：记录现象、保留终端截图或 `get-info` 输出，进入 bug 路径（Bug Path），不猜测修复。
- `send` 后内容停留在输入行：按既有 Codex CLI TUI（Codex CLI Terminal UI）规程补发 `key Enter`。
- `result.md` 未写入或 worker 无响应：保留 `screen.txt`、`transcript.log` 与 `cli-session.json`，执行 `kill` 后记录阻塞原因。

## 非目标

- 不修改 CLI（Command Line Interface）、VSCode 插件或 Skill（Skill）实现，除非测试发现可复现缺陷。
- 不测试 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）。
- 不将 session 附件作为长期真相源；验证结论回写当前 devflow mission。
