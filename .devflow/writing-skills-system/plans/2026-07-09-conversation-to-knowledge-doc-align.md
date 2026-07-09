# 对话转知识文档技能对齐设计

## 目标

创建第一版对话转知识文档技能（conversation-to-knowledge-doc skill），用于把当前对话和用户明确引用的文件整理为可沉淀的知识文档。

本技能优先服务“对话总结成知识文档”场景，不在第一版覆盖长资料分段处理、全项目自动扫描、已有材料写文章等更重场景。

## 已确认范围

- 第一版做独立技能（independent skill），目录名为 `conversation-to-knowledge-doc`。
- 真相源（source of truth）为 `skills/all-skills/conversation-to-knowledge-doc/`。
- 同步副本（sync copy）为 `.codex/skills/conversation-to-knowledge-doc/`。
- 默认信息来源为当前对话和用户明确引用的文件（explicit referenced files）。
- 生成文档统一输出到 `zzz-docs/`。
- 文件名采用“主题 + 类型 + 日期”，例如 `写作技能体系-复盘型知识文档-2026-07-09.md`。

## 文件结构

```text
conversation-to-knowledge-doc/
├── SKILL.md
└── references/
    ├── review-knowledge-doc.md
    ├── tutorial-article.md
    ├── project-knowledge-note.md
    └── adaptive-structure.md
```

## 职责分工

- `SKILL.md`：负责触发条件、信息来源边界、交互流程、写入前大纲确认、文件命名和输出路径。
- `references/review-knowledge-doc.md`：复盘型知识文档（review knowledge doc）规则。
- `references/tutorial-article.md`：教程型文章（tutorial-style article）规则。
- `references/project-knowledge-note.md`：项目沉淀文档（project knowledge note）规则。
- `references/adaptive-structure.md`：自适应结构（adaptive structure）选择规则。

## 输出模式

技能触发后先询问用户选择输出模式（output mode），除非用户在触发语中已经明确指定。

支持四种模式：

1. 复盘型知识文档（review knowledge doc）
2. 教程型文章（tutorial-style article）
3. 项目沉淀文档（project knowledge note）
4. 自适应结构（adaptive structure）

## 固定流程

1. 判断触发条件是否匹配“对话总结成知识文档”。
2. 如果用户未指定输出模式，先询问输出模式。
3. 只读取当前对话和用户明确引用的文件。
4. 根据输出模式读取对应参考文件（reference file）。
5. 先生成大纲（outline），等待用户确认。
6. 用户确认后写入 `zzz-docs/`。
7. 写入后报告相对路径和关键内容摘要。

## 内容质量要求

所有输出模式都必须包含：

- 例子说明（examples）：抽象概念或关键决策必须配具体例子。
- 取舍分析（trade-off analysis）：说明为什么这么做、为什么不那么做。
- 适度知识延伸（knowledge extension）：每篇文档 1-3 个与当前主题强相关的自然关联点。

知识延伸不能套固定模板。延伸方向必须由当前主题决定，并说明关联原因和取舍。

## 不做事项

- 不默认扫描全仓库。
- 不默认读取 `.devflow/`、`zzz-docs/` 或历史文档，除非用户明确引用。
- 不在第一版实现长聊天分段处理（long chat chunk processing）。
- 不在第一版创建总写作技能（writing-docs skill）。

## 后续计划需要细化

- `SKILL.md` 的触发描述（description）如何写，避免描述流程导致 Agent 跳过正文。
- 四个参考文件（reference files）的具体结构与质量检查项。
- 真相源和同步副本的一致性验证方式。
- 是否需要补充 `agents/openai.yaml` 等展示元数据。

## 自检

- 无未完成标记。
- 结构与用户已确认的方案一致。
- 范围聚焦第一版独立技能，没有混入总写作技能。
- 信息来源、输出位置、命名规则和大纲确认门禁均已明确。
