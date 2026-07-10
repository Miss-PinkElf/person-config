# tmux 鼠标支持与 Codex 多轮验证计划

**目标：** 为每个 devflow worker tmux（tmux）会话启用 `mouse on`，使 VSCode、iTerm2 与 Terminal.app attach 后可使用鼠标滚动，并验证 Codex CLI（Codex CLI）可完成两次任务之间的 `/clear` 新对话。

### Task 1：启用会话鼠标

- 修改 tmux Driver（tmux Driver），新增 `setMouse`，执行 `tmux set-option -t <session> mouse on`。
- 新建 worker 后调用 `setMouse`；`ensure-in-vscode` 复用已有 session 时也调用。
- 所有 attach 命令在 `tmux attach` 前运行同一 `set-option`，确保历史 session 生效。
- 补 tmux Driver、CLI 和插件命令构造测试。

### Task 2：验证与文档

- 运行 CLI 测试、插件编译和插件测试。
- 启动 `mouse-smoke` Codex worker，发送任务 1，执行 `/clear`，发送任务 2，检查屏幕和 result.md（Result File）。
- 更新 Skill（Skill）与 CLI README，说明 `mouse on` 行为。
