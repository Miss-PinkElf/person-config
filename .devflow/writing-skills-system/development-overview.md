# 写作技能体系总记录（Development Overview）

## 定位

本文件用于理解完整开发过程，不是默认恢复热路径。日常恢复优先读取 `state.md` 与 `checkpoints.md`。

## 背景

用户希望把常用的“总结对话 / 知识 / 文档”提示词沉淀为一系列写作类技能（writing-related skills），并参考 `skills/public-agent-skills/README.md` 中已有公开技能（public agent skills）的组织方式。

原始提示词强调：

- 前因后果和决策逻辑
- 例子说明（examples）
- 知识延伸（knowledge extension）与举一反三
- 输出到 `zzz-docs/`

## 已完成阶段

### Align

- 确认第一版不做总写作技能（writing-docs skill），而是先做独立技能（independent skill）。
- 第一版聚焦对话总结成知识文档（conversation-to-knowledge-doc）。
- 默认信息来源限定为当前对话和用户明确引用的文件（explicit referenced files）。
- 支持四种输出模式（output modes）：复盘型知识文档、教程型文章、项目沉淀文档、自适应结构。
- 技能触发后默认先询问输出模式，除非用户已明确指定。
- 写入 `zzz-docs/` 前必须先展示大纲（outline）并等待确认。

### Plan / Spec

- 对齐设计写入 `plans/2026-07-09-conversation-to-knowledge-doc-align.md`。
- 实施计划写入 `plans/2026-07-09-conversation-to-knowledge-doc-plan.md`。
- OpenSpec artifact 写入 `spec/proposal.md`、`spec/design.md`、`spec/tasks.md`。

### Apply / Verify

- 创建真相源（source of truth）：`skills/all-skills/conversation-to-knowledge-doc/`
- 创建同步副本（sync copy）：`.codex/skills/conversation-to-knowledge-doc/`
- 主技能文件（`SKILL.md`）负责触发、流程、边界、路由和写入规则。
- 四个参考文件（reference files）分别负责四种输出模式细节。
- `agents/openai.yaml` 已生成，用于 Codex UI 元数据（metadata）。

## 关键决策

- 仓库技能集合（`skills/all-skills/...`）作为真相源，`.codex/skills/...` 作为同步副本。
- 采用主技能 + 模式参考文件（main skill + mode references），避免单文件过长。
- 先做第一版结构和规则，不做长聊天分段处理、全仓库自动扫描和总写作技能。
- 第一版验证范围为格式、同步一致性和未完成标记检查，真实使用场景 forward-testing 延期。

## 当前开放问题

- 是否需要对 `conversation-to-knowledge-doc` 做真实 forward-testing。
- 是否需要继续设计第二个写作类技能，例如已有材料写文章、长聊天知识提取、语气调整或总写作入口。
- 是否需要未来把 `.codex/skills` 与 `skills/all-skills` 的同步流程脚本化。

## 推荐读取策略

- 默认恢复：读取 `state.md`、`checkpoints.md`。
- 理解完整过程：读取本文件、`decision-log.md`、`plans/`、`spec/`。
- 追溯延期项：读取 `backlog.md` 和 `deferred/`。
- 跨会话续接：读取 `handoffs/index.md` 和最新 handoff。
