# VSCode 自动启动与会话复用对齐记录

## 目标

当 macOS VSCode（VSCode）打开当前工作区后，devflow CLI Worker（devflow CLI Worker）插件自动创建可见的 VSCode 内置终端（VSCode Integrated Terminal），并确保默认 worker `macos-worker` 正在运行或已被复用。用户不需要运行命令面板或输入任何终端命令。

## 已确认行为

- 插件以 `onStartupFinished` 激活；若没有打开工作区，不创建终端。
- 默认 worker id 固定为 `macos-worker`，终端名为 `devflow worker: macos-worker`。
- 不存在 `devflow-worker-macos-worker` tmux（tmux）会话时：创建 session、启动 Codex CLI（Codex CLI），并 attach 到该会话。
- 同名 tmux 会话已经存在时：不启动第二个 Codex CLI，也不覆盖 session 附件，直接 attach 到现有会话。
- 现有 `Start devflow CLI Worker` 命令保留，用于输入其他 worker id 的手动多 worker（Multiple Workers）场景。

## 方案比较

1. 在 CLI（Command Line Interface）新增 `ensure-in-vscode` 命令，由插件调用（采用）。CLI 集中管理 `tmux` 状态、session 附件和复用判断，插件只负责 VSCode 终端生命周期。
2. 在插件拼接 `tmux has-session || start-in-vscode` shell 条件。实现更少，但将会话协议复制到 TypeScript（TypeScript）和 shell 字符串中，测试与错误处理不稳定。
3. 改变现有 `start-in-vscode` 的语义，使其隐式复用。可能改变已有显式启动调用的失败语义，因此不采用。

## 组件设计

### Worker CLI（Worker CLI）

- 新增 `ensure-in-vscode --id <worker-id> --command <command>`。
- tmux Driver（tmux Driver）新增 `hasSession({ sessionName })`，仅返回布尔值；非“会话不存在”的 tmux 错误继续抛出。
- `ensure-in-vscode` 首先检查 tmux session；存在时输出 `worker <id> reused`，不改写 `result.md`（Result File）、`prompt.md`、`cli-session.json` 或 transcript；不存在时复用既有 `start` 创建流程，并输出 `worker <id> started`。
- 只有默认自动启动路径使用 `ensure-in-vscode`；`start` 与 `start-in-vscode` 保持原有语义。

### VSCode 插件（VSCode Extension）

- `package.json` 的 activation event 改为 `onStartupFinished`，保留 `onCommand:devflowCliWorker.start` 以兼容手动命令。
- 抽取创建终端和发送启动命令的函数；自动启动调用固定 `macos-worker` 与 `ensure-in-vscode`，手动命令继续显示 worker id 输入框并使用 `start-in-vscode`。
- 自动终端启动命令继续以 `tmux attach -t devflow-worker-macos-worker` 结束，从而在 VSCode 内可见、可人工介入。

## 错误处理

- `tmux` 未安装、CLI 无法执行或 attach 失败：错误显示在自动创建的 VSCode 终端中；不在插件中吞掉异常。
- 已有 tmux session 但缺少 session 附件：仍可 attach；CLI 不尝试重建或覆盖附件，避免损坏运行中的 worker。
- 运行多个 VSCode 窗口：每个窗口可能创建一个 attach 终端，但只共享同一个 `macos-worker` tmux session，不启动重复 Codex CLI。

## 测试与验收

- CLI 单元测试覆盖 `ensure-in-vscode` 的首次创建与已有 tmux session 复用，且复用不调用 `createSession` 或 `newSession`。
- 插件测试覆盖自动启动命令构造、固定 id、`ensure-in-vscode` 和 attach；保留手动命令的原有构造测试。
- 运行 CLI 测试、VSCode 插件编译与插件测试。
- 真实 macOS 冒烟：重新加载 VSCode 工作区后，无需命令面板操作即出现 `devflow worker: macos-worker` 终端；再次打开窗口时 attach 而不创建第二个 tmux session。

## 非目标

- 不实现 worker 管理 UI（User Interface）、状态列表或 result.md 快速打开。
- 不改变 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）支持范围。
- 不把自动启动设计为重启已存在的 Codex CLI worker。
