# devflow-cli-worker 状态

## 当前快照

- Mission：devflow-cli-worker
- 路径：重型路径（Heavy Path）
- 阶段：Verify / Close（目录归并与 macOS CLI 冒烟验证已完成，等待是否提交）
- 当前主线：macOS CLI（CLI）已移入 Worker Skill（Worker Skill）主包，当前入口为 `.codex/skills/devflow-cli-worker/cli/`；macOS VSCode 插件入口（VSCode Extension Entry）已更新到新 CLI 路径；Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口不进入本轮实现。
- 原始输入索引：`origin.md`
- Align 文档：`plans/2026-07-04-macos-cli-worker-align.md`
- Plan 文档：`plans/2026-07-04-macos-cli-worker-plan.md`、`plans/2026-07-07-skill-bundled-cli-plan.md`
- Spec 文档：`spec/proposal.md`、`spec/design.md`、`spec/tasks.md`
- VSIX 产物：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`
- 延期项：`deferred/vscode-wsl-worker-entry.md`
- 最新 handoff：`handoffs/2026-07-07-002-skill-bundled-cli-macos-verified.md`
- 下次恢复提示词：`NEXT-SESSION-PROMPT-devflow-cli-worker.md`
- 收口提交：上一轮提交已完成；本轮 Skill + CLI 目录归并尚未提交，需先询问用户。

## 已确认范围

- macOS：完整实现可见终端（Visible Terminal）、tmux（tmux）会话控制、轮询（Polling）、result.md（Result File）路径、多 worker 并行（Parallel Workers）；CLI（Command Line Interface）当前作为 Skill（Skill）包内子目录维护。
- macOS VSCode 插件：本轮只做“新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker”的入口能力。
- Windows / WSL：延期，不做 PowerShell（pwsh）适配，不做 Windows 外部终端控制。
- Windows / WSL VSCode 入口：延期；未来第一版只需新开 WSL 终端（WSL Terminal）并启动 worker，其它管理能力继续延期。

## 当前验证

- 2026-07-07：`npm --prefix .codex/skills/devflow-cli-worker/cli test` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker run compile` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker test` 通过。
- 2026-07-07：`node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help` 通过。
- 2026-07-07：`npm --prefix vscode-extensions/devflow-cli-worker run package` 通过；仍有既有非阻断警告：缺少 `repository` 字段和 LICENSE 文件。
- 2026-07-07：真实 macOS iTerm2（iTerm2）路径通过：`start --id smoke-iterm2 --command bash --terminal iterm` 创建并 attach 到 tmux（tmux），`result.md` 写入成功。
- 2026-07-07：真实 Codex CLI（Codex CLI）worker 路径通过：`start --id codex-smoke --command codex --terminal iterm` 启动成功；通过 `send` 输入 `/clear`，单独 `key Enter` 后清空上下文并进入新对话；新对话中写入 `.devflow/devflow-cli-worker/sessions/codex-smoke/result.md` 成功。

## 当前风险

- 尚未完成 VSCode 内置终端（VSCode Integrated Terminal）通过插件命令面板触发的真实 UI 冒烟验证；本轮已验证 VSIX 安装、插件编译 / 测试和 CLI 核心链路。
- VSIX 打包仍有非阻断警告：缺少 `repository` 字段和 LICENSE 文件。

## 下一步

1. 如仍需插件 UI 验证，在 VSCode 内通过命令面板执行 `Start devflow CLI Worker`，确认内置终端 attach 到 `devflow-worker-macos-worker`。
2. 如验证失败，按 bug 路径（Bug Path）记录问题现象、原因和解决方案。
