# 下一次对话提示词：vscode-controlled-explorer

请使用 `devflow` 恢复 `.devflow/vscode-controlled-explorer/` mission，并继续受控第二文件管理器（Controlled Explorer）VS Code 插件（VS Code Extension）的后续验证与修复。

## 恢复读取顺序

1. 先读 `.devflow/vscode-controlled-explorer/state.md`
2. 再读 `.devflow/vscode-controlled-explorer/checkpoints.md`
3. 如需交接细节，读 `.devflow/vscode-controlled-explorer/handoffs/index.md` 和最新 handoff
4. 如需理解完整过程，读 `.devflow/vscode-controlled-explorer/development-overview.md`
5. 如需处理延期项，读 `.devflow/vscode-controlled-explorer/backlog.md` 和 `.devflow/vscode-controlled-explorer/deferred/`

## 当前进度概述

- 首版已从零实现，目录为 `vscode-extensions/vscode-controlled-explorer/`。
- 已生成 VSIX：`vscode-extensions/vscode-controlled-explorer/vscode-controlled-explorer-0.1.0.vsix`。
- 最新验证命令 `npm test && npm run compile && npm run package` 已通过，退出码 0。
- devflow 文档、OpenSpec artifact、handoff 和延期项已落盘。

## 未完成任务

- 在真实 VS Code Extension Host 中逐项手动验证 22 项能力。
- 根据手动验证反馈修复问题。
- 决定是否补充 `repository`、`LICENSE` 和发布相关元数据。

## 未讨论完的议题

- 是否支持远程 SSH / WSL / Codespaces。
- 是否扩展频率统计到原生 Explorer 或全局文件打开行为。
- 是否支持添加入口时选择指定虚拟分组（Group）。
- 是否同步 `controlled-explorer-config` skill 到 `.claude/skills` 或 `.codefuse/skills`。

## 建议优先处理

1. 安装 VSIX 并打开一个测试工作区。
2. 创建 `.vscode/controlled-explorer.json`，验证 `group` / `folder` / `file` 展示。
3. 验证原生 Explorer 右键添加、外部拖拽添加、inline 移除、默认排序、频率排序。
4. 验证新建、重命名、删除到废纸篓、复制路径、终端集成。
5. 把任何异常写入 `bug-log.md`，按 devflow bug 路径修复。

## 注意事项

- 仓库内存在其他 mission 或其他 agent 的未提交变更，尤其是 `devflow-cli-worker` 相关文件；不要在本 mission 中误改或误提交。
- 本 mission 相关文件集中在 `.devflow/vscode-controlled-explorer/`、`vscode-extensions/vscode-controlled-explorer/` 和 `.agents/skills/controlled-explorer-config/`。
