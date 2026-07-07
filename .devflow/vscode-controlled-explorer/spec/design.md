# Design

## 总体思路

插件采用 VS Code 官方扩展 API 实现，不改 VS Code 源码。配置 JSON 只记录受控入口和虚拟分组；真实目录 children 从磁盘实时读取，避免 JSON 与磁盘状态漂移。

## 结构与边界

- 扩展入口（Extension Entry）：`src/extension.ts`，注册命令、Tree View、菜单和服务。
- 配置服务（Config Service）：`src/configService.ts`，负责项目级和全局级 JSON 读写、排序、添加、移除。
- 树数据服务（Tree Data Provider）：`src/treeDataProvider.ts`，负责把配置节点和磁盘节点映射为 TreeItem。
- 文件操作服务（File Operation Service）：`src/fileOperations.ts`，负责真实文件系统操作和剪贴板/终端集成。
- 拖拽控制器（Drag And Drop Controller）：`src/dragAndDropController.ts`，处理外部拖拽添加和树内移动。
- 频率服务（Frequency Service）：`src/frequencyService.ts`，记录并读取受控树内打开频率。
- 监听服务（Watcher Service）：`src/watcherService.ts`，监听配置文件和已展开目录。

## 数据流与接口

1. Tree View 请求根节点。
2. 配置服务读取项目级与全局级配置。
3. 树数据服务生成 `group` / `folder` / `file` / `missing` / `directory-child` 节点。
4. 用户执行命令后，文件操作服务或配置服务更新磁盘或 JSON。
5. Tree View 刷新；监听服务在配置文件或已展开目录变化时触发局部刷新。
6. 打开文件时频率服务更新 `globalState`。

## 复用点

- 沿用仓库内 `vscode-send-ref-to-terminal` 的 TypeScript、`out/`、`vsce package --no-dependencies` 风格。
- 使用 VS Code `workspace.fs` 完成跨平台文件操作。
- 使用 VS Code `env.openExternal` 实现在系统文件管理器中显示路径。

## 风险与权衡

- Tree View 的 inline `x` 通过 `TreeItem.command` 或行内菜单实现，实际呈现受 VS Code 版本和主题影响。
- 外部拖拽 MIME 类型存在版本差异，控制器需要尝试 `text/uri-list`、`text/plain` 和 VS Code 自有文件列表格式。
- 频率排序只统计插件内打开行为，避免为了全局统计引入过度复杂度。
