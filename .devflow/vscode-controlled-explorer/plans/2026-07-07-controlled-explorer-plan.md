# 受控第二文件管理器（Controlled Explorer）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零实现 `vscode-controlled-explorer` VS Code 插件（VS Code Extension），覆盖原始提示词中的 22 项能力。

**Architecture:** 新插件放在 `vscode-extensions/vscode-controlled-explorer/`。扩展入口（Extension Entry）只负责注册命令和组装服务；配置服务（Config Service）、树数据服务（Tree Data Provider）、文件操作服务（File Operation Service）、拖拽控制器（Drag And Drop Controller）、频率统计服务（Frequency Service）和监听服务（Watcher Service）分文件实现。

**Tech Stack:** TypeScript、VS Code Extension API、Node.js `fs/path`、VS Code `workspace.fs`、Node `assert` 单元测试（Unit Tests）、`@vscode/vsce` 打包。

---

## 文件结构

- Create: `vscode-extensions/vscode-controlled-explorer/package.json`：插件清单、命令、视图、菜单、脚本。
- Create: `vscode-extensions/vscode-controlled-explorer/tsconfig.json`：TypeScript 编译配置。
- Create: `vscode-extensions/vscode-controlled-explorer/.gitignore`：忽略 `out/`、`node_modules/` 和 VSIX 产物。
- Create: `vscode-extensions/vscode-controlled-explorer/.vscodeignore`：打包忽略源码、测试和配置。
- Create: `vscode-extensions/vscode-controlled-explorer/README.md`：使用说明、配置示例、命令说明。
- Create: `vscode-extensions/vscode-controlled-explorer/examples/controlled-explorer.json`：示例配置。
- Create: `vscode-extensions/vscode-controlled-explorer/src/types.ts`：配置、节点、排序和服务类型。
- Create: `vscode-extensions/vscode-controlled-explorer/src/pathUtils.ts`：路径解析、相对路径、终端转义等纯逻辑。
- Create: `vscode-extensions/vscode-controlled-explorer/src/configService.ts`：项目级和全局级 JSON 读写、排序、添加、移除。
- Create: `vscode-extensions/vscode-controlled-explorer/src/frequencyService.ts`：打开频率持久化和排序分值。
- Create: `vscode-extensions/vscode-controlled-explorer/src/fileOperations.ts`：新建、重命名、删除到废纸篓、显示、复制、终端集成。
- Create: `vscode-extensions/vscode-controlled-explorer/src/treeDataProvider.ts`：Tree View（树视图）节点构建、目录读取、失效路径显示。
- Create: `vscode-extensions/vscode-controlled-explorer/src/dragAndDropController.ts`：外部拖拽添加和树内拖拽移动。
- Create: `vscode-extensions/vscode-controlled-explorer/src/watcherService.ts`：配置文件和已展开目录监听。
- Create: `vscode-extensions/vscode-controlled-explorer/src/extension.ts`：激活插件、注册命令、创建 Tree View。
- Create: `vscode-extensions/vscode-controlled-explorer/src/*.test.ts`：覆盖纯逻辑、配置排序、频率排序和路径处理。
- Create: `.agents/skills/controlled-explorer-config/SKILL.md`：AI 维护受控文件配置的 skill。

## 任务拆分

### Task 1: 初始化插件骨架（Extension Foundation）

**Files:**
- Create: `vscode-extensions/vscode-controlled-explorer/package.json`
- Create: `vscode-extensions/vscode-controlled-explorer/tsconfig.json`
- Create: `vscode-extensions/vscode-controlled-explorer/.gitignore`
- Create: `vscode-extensions/vscode-controlled-explorer/.vscodeignore`

- [ ] **Step 1:** 创建插件清单，注册 Activity Bar（活动栏）容器、Tree View（树视图）、命令、菜单和拖拽能力。
- [ ] **Step 2:** 创建 TypeScript 配置，沿用仓库现有 VS Code 插件（VS Code Extension）风格。
- [ ] **Step 3:** 运行 `npm install` 生成本插件依赖和 `package-lock.json`。
- [ ] **Step 4:** 验证 `npm run compile` 能启动编译流程。

### Task 2: 实现配置模型与纯逻辑（Config Model）

**Files:**
- Create: `src/types.ts`
- Create: `src/pathUtils.ts`
- Create: `src/configService.ts`
- Create: `src/pathUtils.test.ts`
- Create: `src/configService.test.ts`

- [ ] **Step 1:** 定义 `group` / `folder` / `file` 配置节点、排序模式（Sort Mode）和运行时树节点类型。
- [ ] **Step 2:** 实现路径解析、工作区相对路径、终端 shell 转义。
- [ ] **Step 3:** 实现项目级 `.vscode/controlled-explorer.json` 和全局级 JSON 配置的读写。
- [ ] **Step 4:** 实现默认排序：`group` -> `folder` -> `file`，同类型按名称排序。
- [ ] **Step 5:** 实现添加根入口、移除根入口和配置初始化。
- [ ] **Step 6:** 用 Node `assert` 测试路径转换、排序和配置更新。

### Task 3: 实现 Tree View（树视图）核心

**Files:**
- Create: `src/treeDataProvider.ts`
- Create: `src/extension.ts`
- Modify: `src/types.ts`

- [ ] **Step 1:** 实现 `ControlledExplorerProvider`，根节点来自项目级和全局级配置。
- [ ] **Step 2:** 对真实目录按需读取 children，不把真实目录 children 写入 JSON。
- [ ] **Step 3:** 点击 file 节点打开文件，打开后记录频率。
- [ ] **Step 4:** 失效路径显示“路径不存在”，不触发 VS Code 默认创建流程。
- [ ] **Step 5:** 注册刷新、打开项目配置、打开全局配置命令。

### Task 4: 实现文件管理命令（File Management Commands）

**Files:**
- Create: `src/fileOperations.ts`
- Modify: `src/extension.ts`
- Modify: `src/treeDataProvider.ts`

- [ ] **Step 1:** 实现在 Finder 中显示。
- [ ] **Step 2:** 实现新建文件和新建文件夹。
- [ ] **Step 3:** 实现重命名。
- [ ] **Step 4:** 实现删除到废纸篓，带确认。
- [ ] **Step 5:** 实现复制绝对路径和相对路径。
- [ ] **Step 6:** 实现发送路径到终端和在终端中打开。

### Task 5: 实现拖拽、菜单和监听（Drag, Menu, Watchers）

**Files:**
- Create: `src/dragAndDropController.ts`
- Create: `src/watcherService.ts`
- Modify: `src/extension.ts`
- Modify: `src/configService.ts`

- [ ] **Step 1:** 实现外部文件/文件夹拖拽到受控视图并写入项目级 JSON。
- [ ] **Step 2:** 实现树内拖拽移动真实文件/文件夹，同名冲突拒绝。
- [ ] **Step 3:** 实现原生 Explorer 右键“添加到受控文件”。
- [ ] **Step 4:** 实现配置根入口 inline `x` 移除按钮，只改 JSON，不删磁盘文件。
- [ ] **Step 5:** 实现配置文件监听和已展开目录按需监听。

### Task 6: 实现频率排序和文档打包（Frequency, Docs, Packaging）

**Files:**
- Create: `src/frequencyService.ts`
- Create: `src/frequencyService.test.ts`
- Create: `README.md`
- Create: `examples/controlled-explorer.json`
- Create: `.agents/skills/controlled-explorer-config/SKILL.md`
- Modify: `src/configService.ts`
- Modify: `src/treeDataProvider.ts`

- [ ] **Step 1:** 实现受控树内文件打开频率统计，存入 `globalState`。
- [ ] **Step 2:** 实现排序模式切换：默认排序（Default Sort）和频率排序（Frequency Sort）。
- [ ] **Step 3:** 默认排序写回 JSON，频率排序只影响展示。
- [ ] **Step 4:** 写 README、示例配置和 `controlled-explorer-config` skill。
- [ ] **Step 5:** 运行 `npm test`、`npm run compile`、`npm run package`。

## 验证命令

在 `vscode-extensions/vscode-controlled-explorer/` 下执行：

```bash
npm test
npm run compile
npm run package
```

期望：

- `npm test`：所有 Node 单元测试（Unit Tests）通过。
- `npm run compile`：TypeScript 编译无错误。
- `npm run package`：生成 `vscode-controlled-explorer-0.1.0.vsix`。

## 覆盖核对

- 22 项能力全部由 Task 1-6 覆盖。
- 文档更新由 Task 6 覆盖。
- 验证由每个任务的测试和最终三条命令覆盖。
