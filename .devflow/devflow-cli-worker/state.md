# devflow-cli-worker 状态

## 当前快照

- Mission：devflow-cli-worker
- 路径与阶段：重型路径（Heavy Path） / Close（已收口）
- 当前目标：macOS devflow CLI Worker（devflow CLI Worker）已完成孤立 tmux（tmux）会话保护；本轮交接和提交已完成。
- 关键实现：Session Store（会话存储）校验元数据归属并忽略额外字段；`ensure-in-vscode` 与 `open-in-vscode` 在副作用前拒绝缺失或错配元数据。
- 生命周期产物：Align 为 `plans/2026-07-10-orphaned-tmux-session-align.md`，Plan 为 `plans/2026-07-10-orphaned-tmux-session-recovery-plan.md`，Task 11 已在 `spec/tasks.md` 完成。
- 最新 handoff：`handoffs/2026-07-10-004-orphan-session-guard-close.md`
- 下次提示词：`NEXT-SESSION-PROMPT-devflow-cli-worker.md`

## 验证与边界

- `npm --prefix .codex/skills/devflow-cli-worker/cli test` 的 6 组测试通过；真实缺失元数据会话被拒绝且未自动终止；`macos-worker` 已重新创建、复用并在 VSCode attach。
- 用户已要求清理运行时资源；`clear-task-test-20260710` 与 `macos-worker` 均已结束，session 附件已删除。下次需要使用时重新启动 worker。
- 已延期：Windows / WSL（Windows Subsystem for Linux）入口；菜单型 slash 命令自动化、`--prompt-file`、显式确认的 worker 管理 UI 和 VSIX 分发元数据在 `backlog.md`。

## 下一步

1. 本轮提交已完成（修复孤立tmux会话误复用）；准确提交标识以 `git log -1` 为准。
2. 新对话默认读取本文件、`checkpoints.md` 和最新 handoff；需要使用 worker 时先运行 `ensure-in-vscode --id macos-worker --command codex`，需要增强时先从 backlog 选择一项进入 Align（需求对齐）。
