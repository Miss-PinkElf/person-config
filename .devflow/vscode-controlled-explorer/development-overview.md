# 受控第二文件管理器（Controlled Explorer）总记录（Development Overview）

## 定位

本文件用于理解完整开发过程，不是默认恢复热路径。日常恢复优先读取 `state.md` 与 `checkpoints.md`。

## 背景

用户提供 `zzz-prompt-debug/受控文件夹/prompt.md`，要求使用 devflow 基于该提示词从零实现受控第二文件管理器（Controlled Explorer）VS Code 插件（VS Code Extension）。

## 已完成阶段

### Align

- 确认当前不是恢复既有代码，而是从零新写插件。
- 用户选择完整 B 方案：首版覆盖提示词中“已实现能力总览”的 22 项能力。
- 确认采用“完整范围 + 3 个里程碑”的实施组织方式。
- 产物：`plans/2026-07-07-controlled-explorer-align.md`。

### Plan / Spec

- 写入实施计划（Implementation Plan）：`plans/2026-07-07-controlled-explorer-plan.md`。
- 写入 OpenSpec artifact：`spec/proposal.md`、`spec/design.md`、`spec/tasks.md`。

### Apply

- 新建插件目录：`vscode-extensions/vscode-controlled-explorer/`。
- 实现配置模型、路径工具、配置服务、树数据服务、文件操作服务、拖拽控制器、频率服务、监听服务和扩展入口。
- 新增 README、示例配置、Activity Bar 图标和 `controlled-explorer-config` skill。

### Verify

- 运行 `npm test && npm run compile && npm run package`，退出码 0。
- 生成本地安装包：`vscode-extensions/vscode-controlled-explorer/vscode-controlled-explorer-0.1.0.vsix`。

## 关键决策

- 使用 VS Code 官方扩展 API，不修改 VS Code 源码。
- 配置 JSON 只记录入口和虚拟分组，真实目录 children 从磁盘实时读取。
- 默认排序可写回 JSON；频率排序只影响展示，数据存入 `globalState`。
- 树展示排序必须与 JSON 原始索引分离，避免移除配置时删错条目。

## 当前开放问题

- 尚未在真实 VS Code Extension Host 中逐项手动验证 22 项能力。
- 外部拖拽 MIME 类型在不同 VS Code 版本和平台可能需要进一步兼容。
- `repository` 和 `LICENSE` 未补充，当前仅影响发布准备，不影响本地打包。

## 推荐读取策略

- 快速恢复：读 `state.md`、`checkpoints.md`。
- 执行下一步：读 `NEXT-SESSION-PROMPT-vscode-controlled-explorer.md`。
- 深度追溯：读本文件、`decision-log.md`、`plans/` 和 `spec/`。
