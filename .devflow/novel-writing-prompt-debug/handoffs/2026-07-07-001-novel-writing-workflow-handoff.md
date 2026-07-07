# 写小说提示词调试交接（Handoff）

## 基础信息

- 创建时间：2026-07-07
- mission：`novel-writing-prompt-debug`
- 当前阶段：正式撰写完成，交接收尾（Apply Complete / Handoff）
- handoff 编号：001
- 是否 superseded：否

## 当前目标

围绕 `zzz-prompt-debug/写小说/prompt-1.md`，建立 AI 小说写作方法、工具调研、目录化工作流和后续 skill 化的基础。

## 当前进度

- 已完成需求吸收、调研、对齐、计划和两份文档产物。
- 已确认 InkOS 可作为第一优先试用对象。
- 已确认自建路线应采用目录化资料库（Folder-based Knowledge Base）：文件夹 + `index.md` + 分片文档。

## 本轮完成内容

- [x] 阅读原始提示词：`zzz-prompt-debug/写小说/prompt-1.md`
- [x] 建立 devflow mission：`.devflow/novel-writing-prompt-debug/`
- [x] 调研 InkOS、小说写作方法和 AI 写作工具
- [x] 写入对齐文档：`plans/2026-07-07-novel-writing-workflow-align.md`
- [x] 写入两个计划：调研报告计划与工作流文档计划
- [x] 产出 `zzz-prompt-debug/写小说/AI小说写作调研报告.md`
- [x] 产出 `zzz-prompt-debug/写小说/AI小说写作工作流.md`
- [x] 补充 backlog、deferred、handoff 和 NEXT-SESSION-PROMPT

## 关键决策与原因

| 决策 | 备选方案 | 原因 |
| --- | --- | --- |
| 第一阶段产出调研报告 + 工作流文档 | 直接创建 skill | skill 是执行包装，先明确工作流更稳 |
| 文档兼顾个人 SOP 与未来 skill 化接口 | 只写学习笔记或只写 skill 规格 | 用户希望既能执行，又能后续沉淀能力 |
| 小说资料库采用目录化结构 | 单个大 Markdown | 长篇体量大，目录 + `index.md` 更利于恢复、检索和局部更新 |
| InkOS 作为第一优先试用对象 | 立即自建全部流程 | InkOS 已覆盖章节流水线、真相文件、审稿修订和上下文治理 |

## 关键文件 / 产物

| 文件 | 作用 | 相关性 |
| --- | --- | --- |
| `zzz-prompt-debug/写小说/AI小说写作调研报告.md` | 总结 AI 小说写作工具、方法论、本地 skills 可借鉴点 | 核心产物 |
| `zzz-prompt-debug/写小说/AI小说写作工作流.md` | 可执行 SOP 与未来 skill 化接口 | 核心产物 |
| `.devflow/novel-writing-prompt-debug/state.md` | 当前快照 | 恢复热路径 |
| `.devflow/novel-writing-prompt-debug/checkpoints.md` | 最近三条 checkpoint | 恢复热路径 |
| `.devflow/novel-writing-prompt-debug/backlog.md` | 后续轻量想法 | 需要规划时读取 |
| `.devflow/novel-writing-prompt-debug/deferred/2026-07-07-future-novel-workflow-work.md` | 明确延期项 | 需要决定下一阶段时读取 |

## 风险 / 阻塞项 / 开放问题

- [ ] 两份文档需要用户审阅，可能需要调整详略和路线侧重。
- [ ] 是否直接试用 InkOS 尚未决定。
- [ ] 是否创建空白小说项目模板尚未决定。
- [ ] 是否创建 `novel-writing-workflow` skill 明确延期。
- [ ] InkOS 是 AGPL-3.0-only；如果二次开发或对外服务，需要先确认许可证边界。

## 立即下一步

1. 读取 `state.md` 与 `checkpoints.md`，确认当前阶段。
2. 审阅两份文档：`AI小说写作调研报告.md` 和 `AI小说写作工作流.md`。
3. 决定下一步路线：直接试用 InkOS，或创建自建目录化小说项目模板。

## 恢复指引

1. 先读取 `state.md`。
2. 再读取 `checkpoints.md`。
3. 如需完整恢复，读取 `handoffs/index.md` 和本 handoff。
4. 如需理解完整过程，读取 `development-overview.md`。
5. 如需处理延期项，读取 `backlog.md` 与 `deferred/2026-07-07-future-novel-workflow-work.md`。

## 可从活跃上下文移除的内容

- 原始长对话中的逐轮细节。
- 已完成的调研过程细节。
- 已写入 `plans/`、`learnings.md`、`development-overview.md` 的中间分析。
