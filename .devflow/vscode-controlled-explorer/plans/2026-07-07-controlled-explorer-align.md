# 受控第二文件管理器（Controlled Explorer）对齐文档（Align Doc）

## 背景

本 mission 基于 `zzz-prompt-debug/受控文件夹/prompt.md` 从零实现一个 VS Code 插件（VS Code Extension）：受控第二文件管理器（Controlled Explorer）。

插件目标是在 VS Code 侧边栏提供一个独立的文件管理视图，只展示用户或 AI 主动维护的文件、文件夹和虚拟分组，不与原生 Explorer 混淆。入口清单由 JSON 配置驱动，便于人工和 AI 共同维护。

## 用户已确认的范围

用户选择首版范围为 B：覆盖原始提示词中“已实现能力总览”的全部 22 项能力。

这意味着首版不是只做 MVP（Minimum Viable Product，最小可用版本），而是完整实现第一轮与第二轮提示词中整理出的能力集合。

## 总目标

实现一个可安装、可使用、可配置、可验证的 `vscode-controlled-explorer` 插件，包含：

1. 独立 Activity Bar 入口与 Tree View（树视图）。
2. 项目级与全局级 JSON 配置。
3. `folder` / `file` / `group` 三类节点。
4. 常用文件操作、路径复制、终端集成和 Finder 集成。
5. 拖拽添加、拖拽移动、原生 Explorer 右键添加。
6. 配置移除不删除磁盘文件。
7. 失效路径兜底、默认排序和频率排序。
8. README、示例配置、VSIX 打包与 `controlled-explorer-config` skill。

## 方案比较

### 方案 A：先做 MVP（Minimum Viable Product）

- 内容：只实现独立入口、Tree View、项目级 JSON、基础打开与移除配置。
- 优点：风险最低，验证最快。
- 缺点：不满足用户本轮选择的完整 22 项范围。
- 结论：不采用。

### 方案 B：一次性实现全部能力

- 内容：一个阶段内完成所有 22 项能力。
- 优点：表面上最直接。
- 缺点：范围过大，跨 Tree View（树视图）、文件系统操作（File System Operations）、拖拽（Drag and Drop）、菜单贡献（Menu Contribution）、排序（Sorting）和打包（Packaging），调试和验收成本高。
- 结论：不采用。

### 方案 C：完整范围，分 3 个里程碑实施

- 内容：首版仍覆盖完整 22 项能力，但按基础骨架、文件管理交互、受控配置增强分阶段实现。
- 优点：满足完整范围，同时每阶段可验证、可回退。
- 缺点：需要更严格的任务拆分和阶段验收。
- 结论：采用。

## 已确认设计

### 里程碑 1：基础骨架（Extension Foundation）

目标是跑通插件主体结构与受控文件树核心闭环。

范围：

- 独立 Activity Bar 入口。
- Tree View（树视图）受控文件树。
- 项目级 `.vscode/controlled-explorer.json` 配置。
- 全局级 JSON 配置。
- `folder` / `file` / `group` 三类节点。
- 点击 file 节点打开文件。
- 基础刷新。
- README 和示例配置。

### 里程碑 2：文件管理交互（File Management Interactions）

目标是让受控视图具备常用文件管理能力。

范围：

- 在 Finder 中显示。
- 新建文件 / 新建文件夹。
- 重命名。
- 删除到废纸篓，带确认。
- 复制绝对路径 / 相对路径。
- 发送路径到终端 / 在终端中打开。
- 拖拽移动真实文件 / 文件夹。
- 配置文件和已展开目录按需监听刷新。

### 里程碑 3：受控配置增强（Controlled Config Enhancements）

目标是补齐第二轮 prompt 中的配置维护、排序和打包能力。

范围：

- 原生 Explorer 右键“添加到受控文件”。
- 外部拖拽文件 / 文件夹到受控视图并写入项目级 JSON。
- 配置根入口 inline `x` 移除按钮，只改 JSON，不删除磁盘文件。
- 失效路径显示“路径不存在”，避免进入 VS Code 默认创建文件流程。
- 默认排序写回 JSON：`group` -> `folder` -> `file`，同类型按名称排序。
- 按文件打开频率排序，频率数据存入 `globalState`，不写回 JSON。
- `controlled-explorer-config` skill。
- VSIX 打包。

## 架构方向

插件建议新建在 `vscode-extensions/vscode-controlled-explorer/`。

核心模块建议拆分为：

- 扩展入口（Extension Entry）：注册命令、视图容器、Tree View 和上下文菜单。
- 配置服务（Config Service）：读取、写入、排序项目级和全局级 JSON 配置。
- 树数据服务（Tree Data Provider）：把配置节点和磁盘节点转换为 VS Code TreeItem。
- 文件操作服务（File Operation Service）：封装新建、重命名、删除到废纸篓、移动、显示、路径复制。
- 拖拽控制器（Drag And Drop Controller）：处理外部拖拽添加和树内拖拽移动。
- 频率统计服务（Frequency Service）：记录受控树内打开频率并参与排序。
- 监听服务（Watcher Service）：监听配置文件和已展开目录，避免全量递归监听。

## 数据流

1. 插件启动后注册视图和命令。
2. Tree View 请求根节点时，配置服务读取项目级与全局级 JSON。
3. 树数据服务将 `group`、`folder`、`file` 转为节点；真实目录 children 从磁盘实时读取。
4. 用户打开文件时，记录频率并调用 VS Code API 打开文档。
5. 用户添加、移除或排序配置时，配置服务更新 JSON 并触发刷新。
6. 文件系统变化由监听服务触发局部刷新。

## 错误处理

- 配置文件不存在：自动使用空配置或提供初始化命令。
- 配置 JSON 解析失败：提示错误并保留原文件，不覆盖用户内容。
- 路径不存在：显示失效节点和“路径不存在”状态，不触发创建文件流程。
- 文件操作冲突：同名冲突时拒绝并提示，不覆盖目标。
- 删除操作：真实删除必须进入废纸篓并要求确认；移除配置不二次确认且不删除磁盘文件。

## 测试与验证

每个里程碑至少做以下验证：

- 插件可编译。
- VS Code Extension Host 可启动。
- 手动验证本阶段命令和视图行为。
- 对配置读写、排序、路径转换等纯逻辑补充单元测试（Unit Tests）。

最终验收需要覆盖原始提示词中的 22 项能力。

## 文档更新判断

需要新增或更新文档：

- 插件 README：说明安装、配置结构、命令、排序模式和常见问题。
- 示例配置：提供 `folder` / `file` / `group` 示例。
- `controlled-explorer-config` skill：指导 AI 维护受控文件 JSON。
- devflow 计划和任务：进入 Plan 阶段后继续落盘。

## 当前开放问题

1. `controlled-explorer-config` skill 最终同步到哪些目录，需要在实施计划中确认。
2. VSIX 打包产物是否纳入仓库，需要结合 `.gitignore` 和用户偏好确认。
3. 外部拖拽 MIME 类型在不同 VS Code 版本可能存在差异，需要实现时实测。

## 对齐结论

采用“完整范围 + 3 个里程碑”的方案。下一步进入计划（Plan）阶段，编写可执行的实施计划与任务拆分。
