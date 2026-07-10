# devflow-cli-worker 后续想法

## 轻量增强

- `--prompt-file`：用于避免复杂 prompt（Prompt）通过命令行参数传递，降低引号转义和多语言文本输入风险。
- Codex CLI TUI（Codex CLI Terminal UI）适配增强：评估是否为 Codex worker 增加专用提交命令，例如 `submit` 或 `send --enter-twice`，但第一版先通过 Skill（Skill）规程使用 `key <worker-id> Enter`。
- VSCode 插件 UI 验证：后续可人工触发命令面板中的 `Start devflow CLI Worker`，确认 VSCode 内置终端（VSCode Integrated Terminal）attach 到 tmux（tmux）会话。
- VSIX（VSCode Extension Package）分发元数据：如果准备长期分发，补 `repository` 字段和 LICENSE 文件。
- 菜单型 slash 命令（Slash Command）交互：当前需要 `paste` 后读取屏幕并显式 `key` 选择；如需自动化，应单独设计菜单状态识别，不进入本轮第一版。

## 不进入第一版

- worker 管理 UI（User Interface）、状态列表、result.md 快速打开、轮询提醒。
- Windows 原生终端控制（Windows Native Terminal Control）与 PowerShell（pwsh）适配。
