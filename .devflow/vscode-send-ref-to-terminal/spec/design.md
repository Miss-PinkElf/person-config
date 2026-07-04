# Design

## 总体思路

插件采用极简独立 VS Code 扩展（VS Code Extension）结构。与 VS Code API 相关的逻辑集中在 `src/extension.ts`，可测试的字符串生成逻辑集中在 `src/reference.ts`。

核心链路：

```text
命令触发 -> 获取活动编辑器 -> 获取活动终端 -> 计算相对路径 -> 生成引用 -> terminal.sendText(reference, false)
```

## 结构与边界

- `package.json`
  - 声明扩展入口、命令（Command）、快捷键（Keybinding）和脚本。
- `src/reference.ts`
  - 提供纯函数（Pure Functions）：
    - `normalizeReferencePath(relativePath)`
    - `buildLineReference(input)`
  - 不依赖 VS Code API，便于用 Node.js 直接测试。
- `src/reference.test.ts`
  - 使用 Node.js 内置 `assert` 验证引用生成逻辑。
- `src/extension.ts`
  - 注册命令并调用 VS Code Extension API。
  - 负责用户反馈（Warning Message）与终端发送。

## 数据流与接口

输入：

- `editor.document.uri`
- `editor.selection`
- `vscode.window.activeTerminal`

转换：

- `vscode.workspace.asRelativePath(editor.document.uri, false)` 生成工作区相对路径（Workspace Relative Path）。
- `selection.start.line + 1` 与 `selection.end.line + 1` 转成 1-based 行号。
- `buildLineReference` 生成最终引用字符串。

输出：

- `terminal.sendText(reference, false)` 写入当前活动终端输入区。

## 复用点

历史需求文档中确认过的关键点将复用：

- 使用 `terminal.sendText(text, false)` 防止自动执行。
- 引用末尾追加空格。
- `.vscodeignore` 不排除 `out/`，避免打包后扩展无法运行。

## 风险与权衡

- 默认快捷键可能与用户本地绑定冲突；该问题交给 VS Code 快捷键系统（Keybinding System）允许用户覆盖。
- 当前活动终端由 VS Code 决定；插件不额外识别 Claude Code 终端，以避免不稳定判断。
- 第一版不做配置项，保持实现边界清晰。后续如需要再扩展。
