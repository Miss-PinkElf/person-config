# 下一次对话提示词：devflow-cli-worker

请继续 `.devflow/devflow-cli-worker` mission。

## 当前进度概述

macOS devflow CLI Worker（devflow CLI Worker）已完成 VSCode attach 桥接、单命令启动可见终端、tmux 鼠标支持与 Codex CLI（Codex CLI）输入语义分层。最新 VSIX（VSCode Extension Package）是 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.7.vsix`。

## 当前使用规则

- 普通提示词：`send <id> "..."`。
- 直接执行的 slash 命令：`command <id> "/compact"`。
- 新对话：`clear <id>`，命令会等待 Context 100%。
- 菜单型 slash 命令：`paste` 后读取屏幕，再显式 `key` 选择。
- 在 VSCode 新建可见 worker：`start-and-open-in-vscode --id <new-id> --command codex`。

## 未完成任务

1. 如需增强，先从 `backlog.md` 选择菜单型 slash 命令自动化、`--prompt-file`、worker 管理 UI 或 VSIX 分发元数据。
2. Windows / WSL 范围继续延期，除非用户明确重新进入 Align。

## 恢复顺序

1. `.devflow/devflow-cli-worker/state.md`
2. `.devflow/devflow-cli-worker/checkpoints.md`
3. `.devflow/devflow-cli-worker/handoffs/2026-07-10-003-vscode-bridge-and-codex-input.md`
4. 需要完整背景时再读 `development-overview.md`、`decision-log.md`、`backlog.md` 与 `spec/`。
