# Tasks

## 任务清单

- [x] 1. 初始化 `vscode-extensions/vscode-controlled-explorer/` 插件骨架。
- [x] 2. 实现配置类型、路径工具和配置服务。
- [x] 3. 实现 Tree View（树视图）核心展示和打开文件。
- [x] 4. 实现文件管理命令：显示、新建、重命名、删除、复制路径、终端集成。
- [x] 5. 实现拖拽、原生 Explorer 菜单、inline 移除和监听。
- [x] 6. 实现频率排序、README、示例配置、skill 和 VSIX 打包。

## 验收点

- [x] `npm test` 通过。
- [x] `npm run compile` 通过。
- [x] `npm run package` 通过并生成 VSIX。
- [x] README 覆盖配置结构、命令、排序模式和使用方式。
- [x] `controlled-explorer-config` skill 已创建。

## 验证

在 `vscode-extensions/vscode-controlled-explorer/` 下运行：

```bash
npm test
npm run compile
npm run package
```
