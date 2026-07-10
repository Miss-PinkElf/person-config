# CLI 命令语义分层计划

**目标：** 区分普通提示词、直接执行的 slash 命令、菜单型 slash 命令与新对话清空。

1. CLI 新增 `command <worker-id> <slash-command>`，要求以 `/` 开头并一次输入提交。
2. 保留 `paste + key` 仅用于菜单型 slash 命令的显式后续选择。
3. `/clear` 保持独立 `clear` 命令和 Context 100% 验证。
4. 更新 Skill、CLI README、测试和版本产物。
