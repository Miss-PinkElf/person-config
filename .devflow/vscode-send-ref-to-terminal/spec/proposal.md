# Proposal

## 背景

Claude Code 内置的代码引用快捷键在多个 Claude Code 终端同时存在时，可能把引用粘贴到非当前选择的终端。用户需要一个 VS Code 插件（VS Code Extension）稳定地把当前选中代码行的文件引用发送到当前活动终端（Active Terminal）。

## 目标

构建 `vscode-send-ref-to-terminal`：

- 读取当前活动编辑器（Active Editor）的单个选区（Selection）。
- 生成 Claude Code 可识别的文件行号引用（File Line Reference）。
- 将引用发送到当前活动终端输入区。
- 不自动执行终端输入。
- 在引用末尾追加空格，方便用户继续输入 prompt。

## 范围

- 新建插件源码目录：`vscode-extensions/vscode-send-ref-to-terminal/`
- 实现命令（Command）：`sendRefToTerminal.send`
- 默认快捷键（Default Keybinding）：
  - macOS：`cmd+shift+l`
  - Windows/Linux：`ctrl+shift+l`
- 生成引用格式：
  - 单行：`@relative/path#L12 `
  - 多行：`@relative/path#L12-20 `
- 引用路径统一使用 `/`。
- 提供 README 和 VSIX 打包产物。

## 非目标

- 不识别或自动选择 Claude Code 终端。
- 不实现终端自动重命名（Terminal Rename）。
- 不支持多选区（Multiple Selections）。
- 不提供配置项（Configuration）。
- 不自动执行终端输入。

## 边界场景

- 没有活动编辑器：弹出中文警告。
- 没有活动终端：弹出中文警告。
- Windows 路径：引用中统一转成 `/`。
- 空选区：按当前光标所在行生成单行引用。

## 开放问题

无阻塞开放问题。用户已授权完成 Plan 后直接进入 Apply。
