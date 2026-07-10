# 原子清空对话计划

**目标：** 用单一 CLI `clear` 命令原子提交 `/clear`，并在确认 Codex Context 回到 100% 前不继续后续任务。

1. CLI 新增 `clear`：`sendText("/clear", submit: true)`、记录 transcript、轮询 `Context 100% left`。
2. CLI 测试覆盖成功确认与超时错误。
3. Skill 改为普通任务使用 `send`，新对话使用 `clear`；提升版本并打包。
