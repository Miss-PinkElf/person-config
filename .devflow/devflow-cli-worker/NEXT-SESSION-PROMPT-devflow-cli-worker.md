# 下一次对话提示词：devflow-cli-worker

请继续 `.devflow/devflow-cli-worker` mission。

## 当前进度概述

macOS devflow CLI Worker（devflow CLI Worker）第一版已实现；CLI（Command Line Interface）已归并进 Skill（Skill）主包：

- CLI（CLI）：`.codex/skills/devflow-cli-worker/cli/`
- Skill（Skill）：`.codex/skills/devflow-cli-worker/`
- macOS VSCode 插件入口（VSCode Extension Entry）：`vscode-extensions/devflow-cli-worker/`
- VSIX 安装包：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`

2026-07-07 已完成 CLI 归并后的单元测试、VSCode 插件编译 / 测试、CLI help 自检和 VSIX 重新打包；真实 macOS iTerm2（iTerm2）与 Codex CLI（Codex CLI）worker 冒烟验证已通过。

## 未完成任务清单

1. 如仍需插件 UI 验证，在 VSCode 内通过命令面板执行 `Start devflow CLI Worker`，确认内置终端 attach 到 `devflow-worker-macos-worker`。
2. 根据 VSCode 插件 UI 验证结果修复可能出现的终端启动、tmux attach 或路径问题。
3. 如准备长期分发 VSIX，补 `repository` 字段和 LICENSE 文件。
4. 后续如需要 Windows / WSL VSCode 入口，读取 `deferred/vscode-wsl-worker-entry.md` 后单独进入 Align。

## 未讨论完的议题

- 是否需要 `--prompt-file` 来避免复杂 prompt 通过命令行参数传递。
- 是否需要 worker 管理 UI（User Interface）、result.md 快速打开、状态列表、轮询提醒。
- 是否需要把 VSCode 插件发布流程标准化。

## 需要注意的上下文信息

- 本轮明确不做 Windows 原生、PowerShell（pwsh）和 WSL 入口。
- macOS VSCode 插件本轮只做“新开 VSCode 内置终端（VSCode Integrated Terminal）并启动 worker，然后 attach 到 tmux 会话”。
- CLI 当前为第一版，重点是可见 worker 闭环，不是完整多 Agent 工作台。
- Codex CLI TUI（Codex CLI Terminal UI）实测中，`send` 可输入文本；如文本未提交，继续执行 `key <worker-id> Enter`。
- `checkpoints.md` 只保留最近三条；旧内容在 `checkpoints-archive.md`。

## 建议下次优先处理

1. 先读 `state.md` 与 `checkpoints.md`。
2. 再读最新 handoff：`handoffs/2026-07-05-001-close-and-macos-verify.md`。
3. 如需要继续验证 VSCode 插件 UI，使用已安装的 `local.devflow-cli-worker` 或重新安装 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`。
4. 如果验证失败，按失败点进入 bug 路径（Bug Path），并写 `bug-log.md`。

## 恢复读取建议

- 默认恢复热路径（Resume Hot Path）：`state.md` + `checkpoints.md`
- 需要交接细节：`handoffs/index.md` + 最新 handoff
- 需要理解完整过程：`development-overview.md`
- 需要追溯原始输入：`origin.md`
- 需要看延期项：`deferred/`
