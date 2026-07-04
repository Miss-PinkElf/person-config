# vscode-send-ref-to-terminal 对齐记录（Align Note）

## 背景

用户希望开发 VS Code 插件（VS Code Extension）`vscode-send-ref-to-terminal`，用于替代 Claude Code 内置代码引用快捷键在多终端场景下发送目标不稳定的问题。

原始需求来自 `zzz-prompt-debug/粘贴代码行到终端/prompt-1.md`。该文档记录了历史实现思路、关键决策、终端自动重命名探索和待验证事项。

## 本轮目标

在当前仓库中新建或恢复插件源码，默认落点为：

```text
vscode-extensions/vscode-send-ref-to-terminal/
```

插件第一版只解决一个核心工作流：

```text
选中代码行 -> 生成文件行号引用 -> 粘贴到当前活动终端输入区 -> 不自动执行
```

示例输出：

```text
@src/example.ts#L12-20 
```

## 已确认方案

采用方案 A：极简独立扩展（Minimal Standalone Extension）。

核心能力：

- 读取当前活动编辑器（Active Editor）。
- 读取当前选区（Selection），不支持多选区。
- 根据当前文件生成工作区相对路径（Workspace Relative Path）。
- 生成 Claude Code 可识别的文件引用（File Reference）：`@relative/path#Lx` 或 `@relative/path#Lx-y`。
- 通过当前活动终端（Active Terminal）的 `sendText(text, false)` 写入输入区。
- `sendText` 第二个参数使用 `false`，确保不自动执行命令。
- 引用末尾追加一个空格，方便用户继续输入 prompt。

## 跨平台策略

核心逻辑不按 Windows/macOS/Linux 分支实现。

原因：

- VS Code 扩展 API（VS Code Extension API）本身跨平台。
- 活动编辑器（Active Editor）、活动终端（Active Terminal）、选区（Selection）和 `terminal.sendText` 行为不需要系统分支。

需要显式处理的跨平台点：

- 默认快捷键（Default Keybinding）按平台约定声明：
  - macOS：`cmd+shift+l`
  - Windows/Linux：`ctrl+shift+l`
- 文件引用路径（Reference Path）统一使用 POSIX 风格斜杠（`/`），避免 Windows 反斜杠影响 Claude Code 引用可读性。

## 非目标

第一版不做以下能力：

- 不自动选择或识别 Claude Code 终端。
- 不实现终端自动重命名（Terminal Rename）。
- 不支持多选区（Multiple Selections）。
- 不提供复杂配置项（Configuration），例如是否追加空格、路径格式开关等。
- 不自动执行终端输入。

这些能力如后续需要，可进入待办池（Backlog）或新一轮 devflow 变更。

## 错误处理

插件应提供最小但明确的用户反馈：

- 没有活动编辑器时，提示用户先打开文件。
- 没有活动终端时，提示用户先打开或选中终端。
- 当前文件不在工作区时，使用 VS Code 能提供的相对路径策略；若无法得到可用引用，应提示用户。

## 验证标准

基础验证：

- TypeScript 编译通过。
- VS Code 扩展打包（VSIX Packaging）可生成安装包。
- `.vscodeignore` 不排除运行所需的编译产物。

行为验证：

- 单行选区生成 `@path#Lx `。
- 多行选区生成 `@path#Lx-y `。
- 发送到当前活动终端（Active Terminal），不自动执行。
- Windows 路径场景下生成的引用仍使用 `/`。

## 文档影响

本次需要补充或更新：

- 插件 README：说明安装、命令、默认快捷键、使用方式和限制。
- devflow 记录：后续计划（Plan）、规格（Spec）、任务（Tasks）继续写入本 mission。

## 当前结论

用户已确认：

- 使用 devflow 重型路径（Heavy Path）。
- 源码默认落到 `vscode-extensions/vscode-send-ref-to-terminal/`。
- 采用方案 A：极简独立扩展。
- 跨平台策略为“核心逻辑统一，快捷键按平台声明，引用路径统一 `/`”。
