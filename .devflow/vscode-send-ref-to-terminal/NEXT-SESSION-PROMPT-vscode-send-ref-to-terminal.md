# 下一次对话提示词：vscode-send-ref-to-terminal

请继续 `.devflow/vscode-send-ref-to-terminal/` mission。

## 恢复读取建议

默认先读：

1. `.devflow/vscode-send-ref-to-terminal/state.md`
2. `.devflow/vscode-send-ref-to-terminal/checkpoints.md`

然后按需读：

- `.devflow/vscode-send-ref-to-terminal/handoffs/2026-07-04-001-close-ready.md`
- `.devflow/vscode-send-ref-to-terminal/spec/tasks.md`
- `.devflow/vscode-send-ref-to-terminal/backlog.md`
- `.devflow/vscode-send-ref-to-terminal/deferred/`

## 当前进度概述

VS Code 插件（VS Code Extension）`vscode-send-ref-to-terminal` 第一版已完成：

- 源码：`vscode-extensions/vscode-send-ref-to-terminal/`
- VSIX：`vscode-extensions/vscode-send-ref-to-terminal/vscode-send-ref-to-terminal-0.1.0.vsix`
- 验证：
  - `npm run compile` 通过。
  - `npm test` 通过，输出 `reference tests passed`。
  - `npm run package` 通过。

## 未完成任务

- 在 VS Code 中手动安装 VSIX 并验证实际行为。
- 如准备正式发布，补齐 `repository` 字段和 LICENSE 文件。

## 未讨论完 / 延期议题

- 自动识别 Claude Code 终端：见 `deferred/terminal-identification.md`
- 终端自动重命名（Terminal Rename）：见 `deferred/terminal-rename.md`
- 配置项（Configuration Options）：见 `deferred/configuration-options.md`

## 下次优先处理

优先做手动安装验证：

1. 安装 `vscode-extensions/vscode-send-ref-to-terminal/vscode-send-ref-to-terminal-0.1.0.vsix`。
2. 打开工作区文件并选中代码行。
3. 激活目标终端。
4. 触发命令（Command）`Send File Reference to Terminal` 或快捷键。
5. 确认终端输入区出现 `@relative/path#Lx-y `，且没有自动执行。
