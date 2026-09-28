# Design

## 总体思路

同一个命令服务所有快捷键。差异全部放在 `args` 中。路径和光标规则写成纯函数，扩展入口只连接文件系统和 VS Code 编辑器 API。这样测试不需要启动 VS Code，行为也不会散落在命令回调里。

## 结构与边界

| 单元 | 文件 | 职责 |
| --- | --- | --- |
| 光标位置（Cursor Position） | `src/cursorPosition.ts` | 根据文本和 `CursorMode` 计算偏移 |
| 打开目标（Open Target） | `src/openTarget.ts` | 校验参数并解析成本机绝对路径 |
| 命令入口（Command Entry） | `src/extension.ts` | 读取工作区、确认文件存在、打开编辑器并设置选区 |

`CursorMode` 只定义一次，值为 `end` 或 `lastContent`。`resolveOpenTarget` 的输入是 `unknown` 和只读的 `WorkspaceRoot[]`，输出是带 `ok` 的结果对象。它不访问磁盘，也不调用 VS Code。

## 数据流与接口

1. 快捷键调用 `quickOpenTarget.openFile(args)`。
2. 入口只收集 `scheme === "file"` 的工作区文件夹名称和 `fsPath`。
3. `resolveOpenTarget` 按固定顺序校验参数、拒绝 `~` / URI / 变量、区分绝对路径和相对路径，并阻止相对路径越界。
4. 入口用 `fs.stat` 确认目标是文件。失败时提示错误并返回。
5. `openTextDocument` 打开文档。`resolveCursorOffset(document.getText(), cursor)` 得到偏移，`positionAt` 转成编辑器位置。
6. `showTextDocument` 使用非预览、获取焦点和该选区，再设置 `selection` 并 `revealRange`。整个过程不写文件。

相对路径的工作区选择：

- 零个本机工作区：拒绝。
- 一个本机工作区：名称可省略；写了名称就必须匹配。
- 多个本机工作区：名称必须恰好匹配一个。

绝对路径忽略工作区。它和 `workspaceFolder` 同时出现时直接失败。

## 复用点

复用 `vscode-extensions/vscode-send-ref-to-terminal/` 的 TypeScript、测试和打包方式：`tsc` 编译，`node:assert/strict` 做断言，`vsce package --no-dependencies` 产出 VSIX。不复用它的命令和引用格式。

## 风险与权衡

- 纯函数测试覆盖规则，打不开真实 VS Code 窗口。手动快捷键验证留在安装 VSIX 之后。
- 不展开 `~` 和变量会让部分习惯写法失败。失败提示写明要改成绝对路径或工作区相对路径。
- 已打开且未保存的文档按编辑器缓冲区计算光标，不回读磁盘，避免覆盖未保存内容。
- `.vscodeignore` 排除测试产物，但不排除 `out/` 中的运行文件。
