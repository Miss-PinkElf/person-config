# Proposal

## 背景

用户需要从零实现受控第二文件管理器（Controlled Explorer）VS Code 插件（VS Code Extension）。原始提示词要求插件在侧边栏提供独立文件管理视图，由 JSON 配置控制展示哪些文件、文件夹和虚拟分组，并支持拖拽、排序、文件操作和打包。

## 目标

- 在 `vscode-extensions/vscode-controlled-explorer/` 新建完整插件。
- 覆盖原始提示词中“已实现能力总览”的 22 项能力。
- 提供 README、示例配置、`controlled-explorer-config` skill 和 VSIX 打包脚本。
- 提供可运行的 TypeScript 编译和 Node 单元测试（Unit Tests）。

## 范围

- 独立 Activity Bar 入口和 Tree View（树视图）。
- 项目级 `.vscode/controlled-explorer.json` 和全局级 JSON 配置。
- `group` / `folder` / `file` 三类节点。
- 文件打开、显示、创建、重命名、删除到废纸篓、路径复制、终端集成。
- 外部拖拽添加、树内拖拽移动、原生 Explorer 右键添加。
- 配置根入口 inline 移除、失效路径兜底、默认排序和频率排序。
- 配置文件监听和已展开目录按需监听。

## 非目标

- 不修改 VS Code 源码。
- 不实现 Git 状态、搜索、永久删除、完整 Explorer 复刻。
- 不统计原生 Explorer 或编辑器标签页的打开频率；频率排序只统计受控树内打开行为。
- 不强制支持远程 SSH / WSL / Codespaces 的专项行为。

## 边界场景

- 配置不存在时自动创建空配置。
- JSON 解析失败时提示用户并保留原始文件。
- 路径不存在时展示“路径不存在”，不触发创建文件流程。
- 文件移动或重命名遇到同名冲突时拒绝覆盖。
- 移除配置只修改 JSON，不删除磁盘文件。

## 开放问题

- VS Code 不同版本的外部拖拽 MIME 类型可能不同，实施中需要兼容常见格式并通过手动验证确认。
- VSIX 产物默认由插件目录 `.gitignore` 忽略，是否纳入版本控制后续由用户决定。
