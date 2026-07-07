# AI 小说写作调研报告（AI Novel Writing Research Report）实施计划（Implementation Plan）

> **给 Agent 工作者（agentic workers）：** 必需子技能（REQUIRED SUB-SKILL）：使用 superpowers-subagent-driven-development（推荐）或 executing-plans 按任务执行本计划。步骤使用 checkbox（`- [ ]`）语法追踪。

**目标（Goal）：** 产出一份可支撑后续 AI 小说写作工作流设计的调研报告（Research Report），说明现有工具、写作方法和可吸收模块。

**架构（Architecture）：** 调研报告独立输出到 `zzz-prompt-debug/写小说/AI小说写作调研报告.md`。报告按“问题定义 → 方法论 → 工具案例 → 模块提炼 → 对本工作流的建议”组织，不承载具体 SOP 细节，避免和工作流文档重复。

**技术栈（Tech Stack）：** Markdown 文档、联网检索（Web Research）、本地只读仓库分析（Repository Read-only Analysis）、devflow 记录。

---

## 文件结构

- Create: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`
  - 职责：保存最终调研报告，面向用户阅读。
- Modify: `.devflow/novel-writing-prompt-debug/learnings.md`
  - 职责：补充调研过程中的稳定结论，不复制完整报告。
- Modify: `.devflow/novel-writing-prompt-debug/state.md`
  - 职责：更新当前阶段、已完成事项和下一步。
- Modify: `.devflow/novel-writing-prompt-debug/checkpoints.md`
  - 职责：记录报告完成后的阶段节点。

## 调研边界

必须覆盖：

- `inkos` 仓库（Repository）：`https://github.com/Narcooo/inkos`
- 小说写作方法（Novel Writing Methods）：雪花法（Snowflake Method）、节拍表（Beat Sheet）、人物档案（Character Bible）、世界观构建（Worldbuilding）、伏笔账本（Hook Ledger）
- AI 写作工具（AI Writing Tools）：InkOS、Novelcrafter、Sudowrite、Novel OS
- 本地 public agent skills：`skills/public-agent-skills/README.md`、`kol-writer`、`content-tone-adjuster`、`learning-assistant`、`deep-research`

不做：

- 不写具体小说正文。
- 不评测模型效果。
- 不创建 skill。
- 不安装或运行 InkOS。

## Task 1: 建立报告骨架

**Files:**
- Create: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 创建报告标题和目录**

写入以下结构：

```markdown
# AI 小说写作调研报告（AI Novel Writing Research Report）

## 1. 结论摘要（Executive Summary）

## 2. 问题定义（Problem Definition）

## 3. 小说写作方法论（Novel Writing Methods）

## 4. AI 小说写作工具案例（AI Novel Writing Tools）

## 5. 本地 skills 可借鉴能力（Reusable Local Skills）

## 6. 可吸收模块（Reusable Modules）

## 7. 对工作流设计的建议（Workflow Design Recommendations）

## 8. 来源索引（Sources）
```

- [ ] **Step 2: 验证骨架完整**

Run: `rg -n "^## " zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 输出 8 个二级标题（Level-2 Headings）。

## Task 2: 补充问题定义与结论摘要

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 写问题定义（Problem Definition）**

覆盖以下观点：

- 用户缺少写作知识（Writing Knowledge），不是只缺提示词。
- AI 写长篇小说的核心风险是上下文漂移（Context Drift）、人设崩塌（Character Drift）、设定冲突（Worldbuilding Conflict）、伏笔遗失（Hook Loss）、章节水化（Low-density Chapters）。
- 长篇小说应作为长期任务（Long-running Task）管理。

- [ ] **Step 2: 写结论摘要（Executive Summary）**

摘要必须包含 5 条结论：

1. 长篇小说不应依赖单次 prompt。
2. 应建立目录化资料库（Folder-based Knowledge Base）。
3. 每章应走“章节意图 → 上下文包 → 初稿 → 审稿 → 修订 → 状态结算”。
4. 调研工具共同指向故事资料库（Story Codex / Story Bible）。
5. 后续 skill 应是小说项目管理 skill（Novel Project Management Skill），不是单纯正文生成 skill。

- [ ] **Step 3: 验证摘要可读性**

Run: `sed -n '1,80p' zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 前 80 行内能看到清晰结论摘要和问题定义。

## Task 3: 调研小说写作方法论

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 检索并记录雪花法（Snowflake Method）**

记录内容：

- 核心思想：从一句话故事核心逐层扩展。
- 可吸收点：适合 Align 与 Plan 阶段。
- 对本工作流的映射：`bible/premise.md`、`outline/whole-book.md`、`characters/`。

- [ ] **Step 2: 检索并记录节拍表（Beat Sheet）**

记录内容：

- 核心思想：用结构节点管理故事节奏和转折。
- 可吸收点：适合章节计划（Chapter Plan）与卷纲（Volume Map）。
- 对本工作流的映射：`outline/volume-01.md`、`outline/chapter-plan.md`。

- [ ] **Step 3: 记录人物、世界观、伏笔方法**

至少覆盖：

- 人物档案（Character Bible）
- 人物关系（Relationship Map）
- 世界观构建（Worldbuilding）
- 伏笔账本（Hook Ledger）

- [ ] **Step 4: 验证方法论章节**

Run: `rg -n "Snowflake|雪花法|Beat Sheet|节拍表|Character Bible|Worldbuilding|Hook Ledger" zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 每个关键词至少出现一次，并有中文解释。

## Task 4: 调研 AI 小说写作工具

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 写 InkOS 案例**

必须覆盖：

- 创作智能体系统（Story Creation AI Agent）
- 长篇章节流水线（Longform Chapter Pipeline）
- 真相文件（Truth Files）
- 上下文治理（Context Governance）
- 作者意图（Author Intent）和当前焦点（Current Focus）
- 审稿（Audit）与修订（Revise）

- [ ] **Step 2: 写 Novelcrafter 案例**

必须覆盖：

- Codex / Story Bible 类资料库
- 人物、地点、设定和章节上下文管理
- 对本工作流的启发：资料库索引和局部检索

- [ ] **Step 3: 写 Sudowrite 案例**

必须覆盖：

- Story Engine 或类似“从简介、人物、章节到正文”的流程
- 对本工作流的启发：从大纲到正文的中间层不能省略

- [ ] **Step 4: 写 Novel OS 案例**

必须覆盖：

- 小说操作系统（Novel OS）思路
- 人物档案、情节追踪、时间线或类似长期资产
- 对本工作流的启发：小说项目需要操作系统式目录管理

- [ ] **Step 5: 验证工具章节**

Run: `rg -n "InkOS|Novelcrafter|Sudowrite|Novel OS|Story Engine|Codex|Truth Files" zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 每个工具都有单独小节或明确段落。

## Task 5: 分析本地 skills 可借鉴能力

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 写 `kol-writer` 可借鉴点**

覆盖：

- 资料输入（Input）
- 大纲梳理（Outline）
- 检索回填（Research Backfill）
- 迭代优化（Iteration）

- [ ] **Step 2: 写 `content-tone-adjuster` 可借鉴点**

覆盖：

- 去 AI 腔调（Remove AI Artifacts）
- 风格调整（Tone Adjustment）
- 后续可迁移为小说风格修订（Style Revision）

- [ ] **Step 3: 写 `learning-assistant` 可借鉴点**

覆盖：

- 交互式学习（Interactive Learning）
- 概念拆解（Concept Decomposition）
- 适合“学习某类小说写法”的路线

- [ ] **Step 4: 写 `deep-research` 可借鉴点**

覆盖：

- 分主题调研（Dimension-based Research）
- 来源记录（Source Tracking）
- 适合世界观、职业、年代、题材资料调研

- [ ] **Step 5: 验证本地 skills 章节**

Run: `rg -n "kol-writer|content-tone-adjuster|learning-assistant|deep-research" zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 每个 skill 都有可吸收点。

## Task 6: 提炼可吸收模块与建议

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`

- [ ] **Step 1: 写可吸收模块（Reusable Modules）**

至少列出：

- 目录化资料库（Folder-based Knowledge Base）
- 作者意图（Author Intent）
- 当前焦点（Current Focus）
- 故事圣经（Story Bible）
- 人物档案（Character Bible）
- 世界观资料库（Worldbuilding Repository）
- 伏笔账本（Hook Ledger）
- 章节流水线（Chapter Pipeline）
- 审稿清单（Audit Checklist）
- 交接恢复（Handoff / Resume）

- [ ] **Step 2: 写工作流设计建议（Workflow Design Recommendations）**

必须明确：

- 第一阶段应先做 SOP 和调研报告。
- 后续 skill 化应围绕“项目管理与上下文治理”。
- 生成正文只是 Apply 阶段的一部分。

- [ ] **Step 3: 验证建议章节**

Run: `rg -n "目录化资料库|作者意图|当前焦点|伏笔账本|章节流水线|审稿清单|交接恢复" zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 每个模块都有解释，不只是列表。

## Task 7: 来源索引与最终自检

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作调研报告.md`
- Modify: `.devflow/novel-writing-prompt-debug/learnings.md`
- Modify: `.devflow/novel-writing-prompt-debug/state.md`
- Modify: `.devflow/novel-writing-prompt-debug/checkpoints.md`

- [ ] **Step 1: 补充来源索引（Sources）**

至少包含：

```markdown
- InkOS: https://github.com/Narcooo/inkos
- Snowflake Method: https://www.advancedfictionwriting.com/articles/snowflake-method/
- Save the Cat Beat Sheets: https://savethecat.com/beat-sheets
- Novelcrafter: https://www.novelcrafter.com/
- Sudowrite Story Engine: https://www.sudowrite.com/story-engine
```

- [ ] **Step 2: 自检报告结构**

Run: `rg -n "^## " zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 8 个二级标题仍然存在。

- [ ] **Step 3: 自检是否遗漏来源链接**

Run: `rg -n "https?://" zzz-prompt-debug/写小说/AI小说写作调研报告.md`

Expected: 至少包含 InkOS、Snowflake Method、Save the Cat、Novelcrafter、Sudowrite。

- [ ] **Step 4: 更新 devflow 记录**

更新：

- `.devflow/novel-writing-prompt-debug/learnings.md`：追加调研报告稳定结论。
- `.devflow/novel-writing-prompt-debug/state.md`：标记调研报告完成。
- `.devflow/novel-writing-prompt-debug/checkpoints.md`：追加报告完成 checkpoint。

- [ ] **Step 5: 检查 git 状态**

Run: `git status --short zzz-prompt-debug/写小说 .devflow/novel-writing-prompt-debug`

Expected: 只出现调研报告和 devflow 相关变更；不提交，除非用户明确允许。
