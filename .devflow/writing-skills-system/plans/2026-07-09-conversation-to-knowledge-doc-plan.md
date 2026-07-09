# 对话转知识文档技能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 `conversation-to-knowledge-doc` 技能（skill），把当前对话和用户明确引用的文件整理为带例子、取舍分析和适度知识延伸的知识文档。

**Architecture:** 使用主技能文件（`SKILL.md`）负责触发、流程和路由，四个模式参考文件（mode reference files）负责不同输出结构。`skills/all-skills/conversation-to-knowledge-doc/` 是真相源（source of truth），`.codex/skills/conversation-to-knowledge-doc/` 是同步副本（sync copy）。

**Tech Stack:** Markdown、YAML frontmatter、Codex Skill 目录结构、系统技能创建器（skill-creator）脚本。

---

## 文件结构

- 创建：`skills/all-skills/conversation-to-knowledge-doc/SKILL.md`
- 创建：`skills/all-skills/conversation-to-knowledge-doc/agents/openai.yaml`
- 创建：`skills/all-skills/conversation-to-knowledge-doc/references/review-knowledge-doc.md`
- 创建：`skills/all-skills/conversation-to-knowledge-doc/references/tutorial-article.md`
- 创建：`skills/all-skills/conversation-to-knowledge-doc/references/project-knowledge-note.md`
- 创建：`skills/all-skills/conversation-to-knowledge-doc/references/adaptive-structure.md`
- 创建同步副本：`.codex/skills/conversation-to-knowledge-doc/`
- 创建：`.devflow/writing-skills-system/spec/proposal.md`
- 创建：`.devflow/writing-skills-system/spec/design.md`
- 创建：`.devflow/writing-skills-system/spec/tasks.md`
- 修改：`.devflow/writing-skills-system/state.md`
- 修改：`.devflow/writing-skills-system/checkpoints.md`
- 修改：`.devflow/writing-skills-system/decision-log.md`

## Task 1：初始化真相源技能目录

**Files:**
- Create: `skills/all-skills/conversation-to-knowledge-doc/SKILL.md`
- Create: `skills/all-skills/conversation-to-knowledge-doc/agents/openai.yaml`
- Create: `skills/all-skills/conversation-to-knowledge-doc/references/`

- [ ] **Step 1：确认目标目录不存在**

Run:

```bash
test ! -e skills/all-skills/conversation-to-knowledge-doc
```

Expected: exit code `0`。

- [ ] **Step 2：使用技能创建器初始化目录**

Run:

```bash
python3 /Users/mobius/.codex/skills/.system/skill-creator/scripts/init_skill.py conversation-to-knowledge-doc --path skills/all-skills --resources references --interface display_name="对话转知识文档" --interface short_description="把对话整理为可沉淀的知识文档" --interface default_prompt="Use $conversation-to-knowledge-doc to turn this conversation into a knowledge document."
```

Expected: 创建 `skills/all-skills/conversation-to-knowledge-doc/`，包含 `SKILL.md`、`agents/openai.yaml`、`references/`。

## Task 2：编写主技能文件

**Files:**
- Modify: `skills/all-skills/conversation-to-knowledge-doc/SKILL.md`

- [ ] **Step 1：替换 `SKILL.md` 为正式内容**

写入内容必须包含：

```markdown
---
name: conversation-to-knowledge-doc
description: Use when the user asks Codex to review the current conversation, summarize a discussion, extract useful knowledge points, or turn a conversation plus explicitly referenced files into a structured Markdown document under zzz-docs.
---

# 对话转知识文档

## 核心原则

只整理当前对话和用户明确引用的文件（explicit referenced files）。不要默认扫描全仓库、历史文档、`.devflow/` 或 `zzz-docs/`。

## 固定流程

1. 如果用户没有明确指定输出模式（output mode），先询问用户选择模式。
2. 支持四种模式：复盘型知识文档、教程型文章、项目沉淀文档、自适应结构。
3. 根据模式读取对应 `references/` 文件。
4. 先给出大纲（outline），等待用户确认。
5. 用户确认后写入 `zzz-docs/`。
6. 文件名使用 `主题-类型-日期.md`。
7. 写入后报告相对路径和关键内容摘要。

## 输出模式路由

- 复盘型知识文档（review knowledge doc）：读取 `references/review-knowledge-doc.md`。
- 教程型文章（tutorial-style article）：读取 `references/tutorial-article.md`。
- 项目沉淀文档（project knowledge note）：读取 `references/project-knowledge-note.md`。
- 自适应结构（adaptive structure）：读取 `references/adaptive-structure.md`。

## 通用质量要求

- 必须包含例子说明（examples）。
- 必须包含取舍分析（trade-off analysis）。
- 必须包含适度知识延伸（knowledge extension），每篇 1-3 个强相关关联点。
- 知识延伸方向由当前主题决定，不能套固定模板。
- 所有仓库内路径使用相对路径。
```

## Task 3：编写四个模式参考文件

**Files:**
- Create: `skills/all-skills/conversation-to-knowledge-doc/references/review-knowledge-doc.md`
- Create: `skills/all-skills/conversation-to-knowledge-doc/references/tutorial-article.md`
- Create: `skills/all-skills/conversation-to-knowledge-doc/references/project-knowledge-note.md`
- Create: `skills/all-skills/conversation-to-knowledge-doc/references/adaptive-structure.md`

- [ ] **Step 1：写入复盘型知识文档规则**

`review-knowledge-doc.md` 必须覆盖：背景、前因后果、关键决策、例子、取舍、知识延伸、后续行动。

- [ ] **Step 2：写入教程型文章规则**

`tutorial-article.md` 必须覆盖：目标读者、概念铺垫、递进讲解、例子、常见误区、知识延伸、总结。

- [ ] **Step 3：写入项目沉淀文档规则**

`project-knowledge-note.md` 必须覆盖：背景、约束、方案、决策记录、影响文件或模块、风险、后续事项。

- [ ] **Step 4：写入自适应结构规则**

`adaptive-structure.md` 必须覆盖：如何选择结构、如何说明选择理由、如何在大纲阶段暴露结构选择。

## Task 4：生成同步副本

**Files:**
- Create: `.codex/skills/conversation-to-knowledge-doc/`

- [ ] **Step 1：确认同步副本目录不存在**

Run:

```bash
test ! -e .codex/skills/conversation-to-knowledge-doc
```

Expected: exit code `0`。

- [ ] **Step 2：从真相源复制到同步副本位置**

Run:

```bash
cp -R skills/all-skills/conversation-to-knowledge-doc .codex/skills/
```

Expected: `.codex/skills/conversation-to-knowledge-doc/SKILL.md` 存在。

## Task 5：验证技能结构与同步一致性

**Files:**
- Read: `skills/all-skills/conversation-to-knowledge-doc/`
- Read: `.codex/skills/conversation-to-knowledge-doc/`

- [ ] **Step 1：验证真相源技能格式**

Run:

```bash
python3 /Users/mobius/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/all-skills/conversation-to-knowledge-doc
```

Expected: exit code `0`。

- [ ] **Step 2：验证同步副本技能格式**

Run:

```bash
python3 /Users/mobius/.codex/skills/.system/skill-creator/scripts/quick_validate.py .codex/skills/conversation-to-knowledge-doc
```

Expected: exit code `0`。

- [ ] **Step 3：验证两份内容一致**

Run:

```bash
diff -qr skills/all-skills/conversation-to-knowledge-doc .codex/skills/conversation-to-knowledge-doc
```

Expected: exit code `0`，无差异输出。

- [ ] **Step 4：检查未完成标记**

Run:

```bash
pattern='T[B]D|TO[D]O|FIX[M]E|待[定]|待[补]充'
rg -n "$pattern" skills/all-skills/conversation-to-knowledge-doc .codex/skills/conversation-to-knowledge-doc
```

Expected: exit code `1`，无匹配输出。

## Task 6：更新 devflow 记录

**Files:**
- Modify: `.devflow/writing-skills-system/state.md`
- Modify: `.devflow/writing-skills-system/checkpoints.md`
- Modify: `.devflow/writing-skills-system/decision-log.md`

- [ ] **Step 1：更新状态**

记录实施产物、验证命令和下一步。

- [ ] **Step 2：写入 checkpoint**

记录当前阶段完成情况、验证证据和是否需要提交。

## 自检

- 对齐设计中的所有范围要求都有对应任务。
- 计划未要求全局 ESLint 或无关 TypeScript 修复。
- 计划使用 `skills/all-skills/conversation-to-knowledge-doc/` 作为真相源。
- 计划包含同步副本验证。
- 计划没有要求自动提交代码。
