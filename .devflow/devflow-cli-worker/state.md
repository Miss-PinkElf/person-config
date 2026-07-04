# devflow-cli-worker 状态

## 当前快照

- Mission：devflow-cli-worker
- 路径：重型路径（Heavy Path）
- 阶段：Close（当前轮次已收口并提交）
- 当前主线：macOS CLI（CLI）、Worker Skill（Worker Skill）与 macOS VSCode 插件入口（VSCode Extension Entry）已实现；Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口不进入本轮实现。
- 原始输入索引：`origin.md`
- Align 文档：`plans/2026-07-04-macos-cli-worker-align.md`
- Plan 文档：`plans/2026-07-04-macos-cli-worker-plan.md`
- Spec 文档：`spec/proposal.md`、`spec/design.md`、`spec/tasks.md`
- VSIX 产物：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`
- 延期项：`deferred/vscode-wsl-worker-entry.md`
- 最新 handoff：`handoffs/2026-07-05-001-close-and-macos-verify.md`
- 下次恢复提示词：`NEXT-SESSION-PROMPT-devflow-cli-worker.md`
- 收口提交：本提交（提交信息：实现 macOS 可见 CLI Worker 与 VSCode 入口；具体 hash 以 `git log -1` 为准）

## 已确认范围

- macOS：完整实现可见终端（Visible Terminal）、tmux（tmux）会话控制、轮询（Polling）、result.md（Result File）路径、多 worker 并行（Parallel Workers）。
- macOS VSCode 插件：本轮只做“新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker”的入口能力。
- Windows / WSL：延期，不做 PowerShell（pwsh）适配，不做 Windows 外部终端控制。
- Windows / WSL VSCode 入口：延期；未来第一版只需新开 WSL 终端（WSL Terminal）并启动 worker，其它管理能力继续延期。

## 当前风险

- 当前 Windows 环境无法验证 tmux（tmux）、Terminal.app / iTerm2 与 macOS VSCode 真实终端启动。
- macOS 冒烟验证需要在 Mac 环境补跑。

## 下一步

1. 下次在 macOS 环境补跑 tmux（tmux）、Terminal.app / iTerm2、VSCode 内置终端真实冒烟验证。
2. 如验证失败，按 bug 路径（Bug Path）记录问题现象、原因和解决方案。
