# Proposal

## 背景

用户希望把现有“总结对话 / 知识 / 文档”的提示词沉淀为写作类技能（writing-related skills）。经过对齐，第一版聚焦对话转知识文档技能（conversation-to-knowledge-doc skill），用于将当前对话和用户明确引用的文件整理为可沉淀的 Markdown 文档。

## 目标

- 创建 `conversation-to-knowledge-doc` 独立技能（independent skill）。
- 使用主技能 + 模式参考文件（main skill + mode references）结构。
- 支持四种输出模式（output modes）：复盘型知识文档、教程型文章、项目沉淀文档、自适应结构。
- 默认输出到 `zzz-docs/`，写入前必须先给大纲（outline）并等待用户确认。
- 同时维护真相源（source of truth）与同步副本（sync copy）。

## 范围

- 真相源路径：`skills/all-skills/conversation-to-knowledge-doc/`
- 同步副本路径：`.codex/skills/conversation-to-knowledge-doc/`
- 创建 `SKILL.md`、`agents/openai.yaml` 和四个 `references/*.md` 文件。
- 验证技能格式、未完成标记和两份目录一致性。

## 非目标

- 不创建总写作技能（writing-docs skill）。
- 不实现长聊天分段处理（long chat chunk processing）。
- 不默认扫描全仓库、`.devflow/`、`zzz-docs/` 或历史文档。
- 不提交代码；提交需要用户明确允许。

## 边界场景

- 如果用户触发技能时已明确输出模式，不重复询问模式。
- 如果用户没有指定输出模式，必须先询问模式。
- 如果用户要求直接写文件，但未确认大纲，技能仍应先给大纲，除非用户明确说“不要问，直接写”。
- 如果用户引用文件，技能只读取明确引用的文件，不主动扩展读取范围。

## 开放问题

- 暂不做真实 forward-testing；本轮使用结构验证、格式验证和一致性验证作为第一版验收证据。
