# devflow-cli-worker 状态

## 当前快照

- Mission：devflow-cli-worker
- 路径：重型路径（Heavy Path）
- 阶段：Close（本轮功能、真实 macOS 验证、文档与 VSIX 打包完成，待提交）
- 当前主线：Worker CLI（Worker CLI）直接控制 tmux（tmux），默认使用字面量文本注入；VSCode 插件（VSCode Extension）通过 Unix Socket（Unix 域套接字）创建或聚焦指定 worker 的 attach 终端。Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口继续延期。
- 原始输入索引：`origin.md`
- Align 文档：`plans/2026-07-04-macos-cli-worker-align.md`
- Plan 文档：`plans/2026-07-04-macos-cli-worker-plan.md`、`plans/2026-07-07-skill-bundled-cli-plan.md`、`plans/2026-07-10-vscode-auto-start-reuse-plan.md`、`plans/2026-07-10-vscode-attach-bridge-plan.md`
- Spec 文档：`spec/proposal.md`、`spec/design.md`、`spec/tasks.md`
- VSIX 产物：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.7.vsix`
- 延期项：`deferred/vscode-wsl-worker-entry.md`
- 最新 handoff：`handoffs/2026-07-10-003-vscode-bridge-and-codex-input.md`
- 下次恢复提示词：`NEXT-SESSION-PROMPT-devflow-cli-worker.md`
- 收口提交：本轮相关代码与文档待按用户明确授权提交。

## 已确认范围

- macOS：完整实现可见终端（Visible Terminal）、tmux（tmux）会话控制、轮询（Polling）、result.md（Result File）路径、多 worker 并行（Parallel Workers）；CLI（Command Line Interface）当前作为 Skill（Skill）包内子目录维护。
- macOS VSCode 插件：工作区自动启动默认 `macos-worker`，并接受 CLI 的 `open-in-vscode` 请求新建或聚焦指定 worker attach 终端。
- Windows / WSL：延期，不做 PowerShell（pwsh）适配，不做 Windows 外部终端控制。
- Windows / WSL VSCode 入口：延期；未来第一版只需新开 WSL 终端（WSL Terminal）并启动 worker，其它管理能力继续延期。

## 当前验证

- 2026-07-07：`npm --prefix .codex/skills/devflow-cli-worker/cli test` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker run compile` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker test` 通过。
- 2026-07-07：`node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker run package` 通过；仍有既有非阻断警告：缺少 `repository` 字段和 LICENSE 文件。
- 2026-07-07：真实 macOS iTerm2（iTerm2）路径通过：`start --id smoke-iterm2 --command bash --terminal iterm` 创建并 attach 到 tmux（tmux），`result.md` 写入成功。
- 2026-07-10：CLI、插件编译与测试通过；VSIX（VSCode Extension Package）`0.1.7` 已打包，仍有 repository 与 LICENSE 非阻断警告。
- 2026-07-10：真实 macOS VSCode 路径通过：`start-and-open-in-vscode` 创建可见 worker，重复 open 返回 reused，tmux `mouse on` 生效。
- 2026-07-10：真实 Codex CLI（Codex CLI）路径验证：任务 1 写入 result.md，字面量 `/clear` + Enter 后 Context 回到 100%，任务 2 追加成功。

## 当前风险

- 菜单型 slash 命令（Slash Command）仍需人工读取屏幕后显式选择；尚未实现自动菜单识别。
- VSIX 打包仍有非阻断警告：缺少 `repository` 字段和 LICENSE 文件。

## 下一步

1. 新对话可从菜单型 slash 命令自动化、`--prompt-file` 或 worker 管理 UI（User Interface）中选择下一项进入 Align。
2. 默认恢复读取本文件、`checkpoints.md` 与最新 handoff。
