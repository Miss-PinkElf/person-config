# devflow-cli-worker 总记录（Development Overview）

## 定位

本文件用于理解完整开发过程，不是默认恢复热路径。默认恢复请先读 `state.md` 和 `checkpoints.md`。

## 背景

用户希望解决 Claude / Codex CLI 调用 subagent 时的黑盒问题：subagent 后台运行、不可见、不可中途介入。目标是用可见 CLI worker（Visible CLI Worker）替代黑盒 subagent，使主 Agent（Main Agent）像人一样观察和控制独立终端会话。

## 已完成阶段

### Align（需求对齐）

- 输入：`zzz-prompt-debug/不让subagent黑盒/prompt-1.md`、`prompt-2.md`。
- 关键结论：采用方案 A，即 tmux 核心（tmux Core）+ macOS 可见终端（Visible Terminal）+ macOS VSCode 入口（VSCode Terminal Entry）+ Skill 调度（Skill Orchestration）。
- 延期边界：Windows 原生、PowerShell（pwsh）、WSL（Windows Subsystem for Linux）和 Windows / WSL VSCode 入口延期。

### Plan / Spec（计划与规格）

- Plan：`plans/2026-07-04-macos-cli-worker-plan.md`
- Proposal：`spec/proposal.md`
- Design：`spec/design.md`
- Tasks：`spec/tasks.md`

### Apply（实施）

- 实现 CLI：`.codex/skills/devflow-cli-worker/cli/`（初版曾位于 `tools/devflow-cli-worker/`，2026-07-07 已归并进 Skill 主包）
- 实现 Skill：`.codex/skills/devflow-cli-worker/`
- 实现 VSCode 插件入口：`vscode-extensions/devflow-cli-worker/`
- 打包 VSIX：`vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.0.vsix`

### Verify / Close（验证与收口）

已完成自动化验证：

- `npm --prefix .codex/skills/devflow-cli-worker/cli test`
- `npm --prefix vscode-extensions/devflow-cli-worker run compile`
- `npm --prefix vscode-extensions/devflow-cli-worker test`
- `npm --prefix vscode-extensions/devflow-cli-worker run package`
- `node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs --help`

已在真实 macOS 完成 CLI + Skill 主链路冒烟验证：

- iTerm2（iTerm2）可见终端启动与 tmux（tmux）attach 成功。
- Codex CLI（Codex CLI）worker 启动成功。
- `/clear` 清空上下文后进入新对话，Context 回到 100%。
- 新对话中写入 result.md（Result File）成功，内容为 `codex worker smoke ok`。

## 关键决策

- 使用 tmux（tmux）作为 worker 控制层，外部终端和 VSCode 内置终端作为可见入口。
- Skill（Skill）目录作为完整能力包主目录，CLI（Command Line Interface）放在 `.codex/skills/devflow-cli-worker/cli/`。
- VSCode 插件第一版只做入口，不做 worker 管理 UI（User Interface）。
- Windows / WSL 入口作为明确延期项，写入 `deferred/vscode-wsl-worker-entry.md`。

## 当前开放问题

- VSCode 插件（VSCode Extension）命令面板触发内置终端的人工 UI 验证仍可后续补跑；CLI + Skill 主链路已通过。
- 是否补 `--prompt-file` 支持，避免复杂 prompt 通过命令行参数传递。
- 是否补 VSCode 插件的 repository / LICENSE 分发元数据。

## 推荐读取策略

- 日常恢复：`state.md` + `checkpoints.md`
- 当前交接：`handoffs/index.md` + 最新 handoff
- 深度理解：本文件 + `decision-log.md`
- 延期项：`deferred/`
