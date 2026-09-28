# Tasks

## 实施任务

- [x] 任务 1：创建插件骨架
  - `vscode-extensions/vscode-quick-open-target/package.json`
  - `vscode-extensions/vscode-quick-open-target/tsconfig.json`
  - `vscode-extensions/vscode-quick-open-target/.vscodeignore`
  - `vscode-extensions/vscode-quick-open-target/.gitignore`
  - 不贡献默认快捷键。

- [x] 任务 2：光标偏移纯函数与测试
  - `src/cursorPosition.ts`
  - `src/cursorPosition.test.ts`
  - 覆盖 `end`、`lastContent`、空文件、全空白、结尾换行和 CRLF。

- [x] 任务 3：参数与路径解析纯函数与测试
  - `src/openTarget.ts`
  - `src/openTarget.test.ts`
  - 覆盖相对路径、绝对路径、多根工作区、越界路径和不受支持的写法。

- [x] 任务 4：命令入口
  - `src/extension.ts`
  - 注册 `quickOpenTarget.openFile`。
  - 先确认目标是已存在文件，再打开并把光标移到计算结果。

- [x] 任务 5：中文 README 与打包
  - `README.md`
  - 生成 `vscode-quick-open-target-0.1.0.vsix`。

- [x] 任务 6：验证并回写 devflow
  - `npm test` 通过。
  - `npm run package` 通过。
  - 更新本文件、`state.md` 和 `checkpoints.md`。
  - VS Code 内的手动快捷键验证留待安装后执行。

## 验证

在 `vscode-extensions/vscode-quick-open-target/` 下执行：

```bash
npm install
npm test
npm run package
```

实际验证（2026-09-28）：

- 失败测试先出现：光标桩返回 `-1`，断言 ` -1 !== 0 `；路径桩返回“尚未实现”。
- 实现后 `npm test` 通过，输出 `cursor position tests passed` 和 `open target tests passed`。
- `npm run package` 通过，生成 `vscode-quick-open-target-0.1.0.vsix`（6.93 KB）。
- `vsce` 警告缺少 `repository` 和 LICENSE。这不影响本地 VSIX，与既有本地插件的处理一致。
- VSIX 包含 `out/extension.js`、`out/cursorPosition.js`、`out/openTarget.js`，不包含测试文件。
- 未把 VSIX 安装到当前 VS Code，因此快捷键的界面行为尚未手动验证。

手动验证仍待执行：

1. 安装 VSIX。
2. 在 `keybindings.json` 配置两条规则，分别打开不同文件，并分别使用 `end` 和 `lastContent`。
3. 确认光标位置正确且文件内容不变。
4. 把路径改成不存在的文件，确认只显示错误。
