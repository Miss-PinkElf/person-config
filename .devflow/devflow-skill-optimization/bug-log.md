# Bug Log

## 2026-05-01 - `devflow-handoff.md` 收尾耗时过长

### 问题现象

使用 `devflow-handoff.md` 做对话收尾时，单次收尾可能耗时约 20 分钟。

### 问题原因

- 外层 `devflow-handoff.md` 写了“使用 `devflow` skill 的 handoff 子流程”，容易触发内置 `session-handoff` 子技能（session-handoff sub-skill）的完整交接流程。
- 内置 `session-handoff` 创建 handoff 时默认读取 `workflow.md`、最新 checkpoint、`spec/` artifact、模板和 index；恢复时还会读取旧 handoff、resume checklist、staleness checklist、`workflow.md` 和 `spec/`。
- 外层提示词同时要求逐项判断十多个文档，导致 agent 为了谨慎而读取和核对大量文件。
- 结果是快速收尾（fast close）被放大成深度交接（deep handoff）和全量审计（full audit）。

### 解决方案

- 曾尝试将 `devflow-handoff.md` 拆成快速收尾（Fast Close）与深度交接（Deep Handoff），但用户确认暂时不优化该提示词。
- 已撤回 `devflow-handoff.md` 与内置 `session-handoff` 子技能中的分模式改动，保持原本流程。
- 后续如继续处理耗时问题，应先重新讨论，不直接引入多模式设计。

### 状态

- 已撤回分模式方案，保留问题记录
