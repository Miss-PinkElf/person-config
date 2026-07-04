# Tasks

## 实施任务

- [x] 任务 1：创建 VS Code 插件（VS Code Extension）项目骨架
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/package.json`
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/tsconfig.json`
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/.vscodeignore`

- [x] 任务 2：实现引用生成纯函数（Pure Functions）与测试
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/src/reference.ts`
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/src/reference.test.ts`
  - 覆盖 Windows 反斜杠转 `/`、单行引用、多行引用。

- [x] 任务 3：实现 VS Code 命令入口（Command Entry）
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/src/extension.ts`
  - 注册 `sendRefToTerminal.send`
  - 使用 `terminal.sendText(reference, false)` 发送到当前活动终端。

- [x] 任务 4：补充 README 与打包验证
  - 创建 `vscode-extensions/vscode-send-ref-to-terminal/README.md`
  - 运行打包命令生成 `.vsix`

- [x] 任务 5：验证并收口 devflow 状态
  - 编译通过。
  - 测试通过。
  - 打包通过。
  - 更新本文件任务状态、`state.md` 与 `checkpoints.md`。

## 验证

在 `vscode-extensions/vscode-send-ref-to-terminal/` 下执行：

```powershell
npm install
npm run compile
npm test
npm run package
```

期望结果：

- TypeScript 编译通过。
- 测试输出 `reference tests passed`。
- 生成 `vscode-send-ref-to-terminal-0.1.0.vsix`。

实际验证（2026-07-04）：

- `npm run compile`：通过。
- `npm test`：通过，输出 `reference tests passed`。
- `npm run package`：通过，生成 `vscode-send-ref-to-terminal-0.1.0.vsix`。
- `vsce` 警告：缺少 `repository` 字段和 LICENSE 文件；不影响本地 VSIX 生成。
