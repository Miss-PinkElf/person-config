# 下一次对话提示词：devflow-cli-worker

请继续 `.devflow/devflow-cli-worker` mission。

## 当前进度概述

macOS devflow CLI Worker（devflow CLI Worker）已完成 VSCode attach 桥接、可见终端、tmux 鼠标支持、Codex CLI（Codex CLI）输入语义分层，以及孤立 tmux（tmux）会话保护。Session Store（会话存储）会验证元数据归属；缺失或错配时拒绝复用，不自动终止会话。最新 VSIX（VSCode Extension Package）是 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.7.vsix`。

本轮收口提交已完成（修复孤立tmux会话误复用）；准确提交标识以 `git log -1` 为准。

## 当前使用规则

- 普通提示词：`send <id> "..."`。
- 直接执行的 slash 命令：`command <id> "/compact"`。
- 新对话：`clear <id>`，命令会等待 Context 100%。
- 菜单型 slash 命令：`paste` 后读取屏幕，再显式 `key` 选择。
- 在 VSCode 新建可见 worker：`start-and-open-in-vscode --id <new-id> --command codex`。
- 同名 tmux 会话缺失或错配 cli-session.json：CLI 会拒绝操作；确认会话无用后手工运行 `tmux kill-session -t devflow-worker-<worker-id>`。

## 未完成任务

1. 如需增强，先从 `backlog.md` 选择菜单型 slash 命令自动化、`--prompt-file`、显式确认的会话管理 UI 或 VSIX 分发元数据，并先进入 Align（需求对齐）。
2. Windows / WSL 范围继续延期，除非用户明确重新进入 Align。
3. 不在 session 附件上直接试错；当前正常 worker 是 `clear-task-test-20260710` 与 `macos-worker`，对应附件未跟踪且不提交。

## 恢复顺序

1. `.devflow/devflow-cli-worker/state.md`
2. `.devflow/devflow-cli-worker/checkpoints.md`
3. `.devflow/devflow-cli-worker/handoffs/2026-07-10-004-orphan-session-guard-close.md`
4. 需要完整背景时再读 `development-overview.md`、`decision-log.md`、`backlog.md` 与 `spec/`。
