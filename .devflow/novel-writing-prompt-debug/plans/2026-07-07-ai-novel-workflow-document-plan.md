# AI 小说写作工作流文档（AI Novel Writing Workflow Document）实施计划（Implementation Plan）

> **给 Agent 工作者（agentic workers）：** 必需子技能（REQUIRED SUB-SKILL）：使用 superpowers-subagent-driven-development（推荐）或 executing-plans 按任务执行本计划。步骤使用 checkbox（`- [ ]`）语法追踪。

**目标（Goal）：** 产出一份个人可执行 SOP（Standard Operating Procedure）与未来 skill 化接口兼容的 AI 小说写作工作流文档。

**架构（Architecture）：** 工作流文档输出到 `zzz-prompt-debug/写小说/AI小说写作工作流.md`。正文采用“阶段流程 + 目录化资料库 + 单章流水线 + 审稿门禁 + skill 化附录”的结构，优先面向用户实操，同时保留后续 `novel-writing-workflow` skill 的设计接口。

**技术栈（Tech Stack）：** Markdown 文档、目录化资料库（Folder-based Knowledge Base）、devflow 长任务模型（Long-running Mission Model）、小说写作方法论（Novel Writing Methods）。

---

## 文件结构

- Create: `zzz-prompt-debug/写小说/AI小说写作工作流.md`
  - 职责：保存最终工作流文档，面向用户执行。
- Modify: `.devflow/novel-writing-prompt-debug/state.md`
  - 职责：记录工作流文档完成状态。
- Modify: `.devflow/novel-writing-prompt-debug/checkpoints.md`
  - 职责：记录工作流文档完成 checkpoint。
- Modify: `.devflow/novel-writing-prompt-debug/development-overview.md`
  - 职责：在阶段收束时补充本 mission 的整体演进摘要。

## 输出原则

必须满足：

- 使用简体中文。
- 专业术语使用中文 + 英文双语，例如：目录化资料库（Folder-based Knowledge Base）。
- 以目录结构为核心，所有大资料域都采用“文件夹 + `index.md` + 分片文档”。
- 文档既能让用户照着执行，也能作为未来 skill 的设计基础。
- 不直接创建小说项目模板文件，除非用户后续明确要求。

不做：

- 不写小说正文。
- 不创建 skill。
- 不安装外部工具。
- 不写 UI 或应用。

## Task 1: 建立工作流文档骨架

**Files:**
- Create: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 创建标题和目录**

写入以下结构：

```markdown
# AI 小说写作工作流（AI Novel Writing Workflow）

## 1. 使用目标（Goal）

## 2. 核心原则（Core Principles）

## 3. 小说项目目录结构（Novel Project Workspace）

## 4. `index.md` 索引规则（Index Rules）

## 5. 阶段一：对齐（Align）

## 6. 阶段二：计划（Plan）

## 7. 阶段三：真相源建设（Truth Source）

## 8. 阶段四：章节执行（Apply）

## 9. 阶段五：审稿与修订（Review / Revise）

## 10. 阶段六：验证与结算（Verify / State Settlement）

## 11. 阶段七：交接恢复（Handoff / Resume）

## 12. 风格学习与规律提取（Style Learning / Pattern Extraction）

## 13. 未来 skill 化附录（Skillization Appendix）

## 14. 快速执行清单（Quick Checklist）
```

- [ ] **Step 2: 验证骨架完整**

Run: `rg -n "^## " zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 输出 14 个二级标题（Level-2 Headings）。

## Task 2: 写使用目标与核心原则

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写使用目标（Goal）**

覆盖：

- 适合从 0 开始写长篇小说。
- 适合已有章节后继续写。
- 适合学习某类小说风格并提取规律。
- 适合后续转成 skill。

- [ ] **Step 2: 写核心原则（Core Principles）**

必须包含：

1. 先管理项目，再生成正文。
2. 真相源（Truth Source）优先于聊天历史。
3. 每章都必须有章节意图（Chapter Intent）。
4. 上下文包（Context Package）只读取本章需要的材料。
5. 没有审稿（Audit）不声明章节完成。
6. 状态结算（State Settlement）先于下一章。

- [ ] **Step 3: 验证核心原则**

Run: `rg -n "真相源|章节意图|上下文包|审稿|状态结算" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 每个关键词都有明确解释。

## Task 3: 写目录化小说项目工作区

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写完整目录树**

使用对齐文档中的目录结构，并保留以下顶层目录：

- `origin/`
- `intent/`
- `bible/`
- `worldbuilding/`
- `characters/`
- `relationships/`
- `outline/`
- `hooks/`
- `chapters/`
- `style/`
- `research/`
- `handoffs/`

- [ ] **Step 2: 写每个目录的职责说明**

每个目录至少说明：

- 存什么
- 什么时候读
- 什么时候更新
- 是否属于恢复热路径（Resume Hot Path）

- [ ] **Step 3: 验证目录完整**

Run: `rg -n "origin/|intent/|bible/|worldbuilding/|characters/|relationships/|outline/|hooks/|chapters/|style/|research/|handoffs/" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 12 个顶层目录都出现。

## Task 4: 写 `index.md` 索引规则

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 定义 `index.md` 标准模板**

模板包含：

```markdown
# [目录名称] 索引（[English Name] Index）

## 用途

## 文件列表

## 恢复热路径（Resume Hot Path）

## 深度追溯路径（Deep Trace Path）

## 读取规则（Read Rules）

## 更新规则（Update Rules）

## 最近变更（Recent Changes）
```

- [ ] **Step 2: 写读取规则（Read Rules）**

必须说明：

- 默认只读项目总 `index.md`、`intent/current-focus.md` 和相关目录 `index.md`。
- 写章节时按章节意图选择上下文，不全量读取。
- 人物、世界观、伏笔只在本章相关时读取具体分文档。

- [ ] **Step 3: 写更新规则（Update Rules）**

必须说明：

- 新增分文档后更新所在目录 `index.md`。
- 章节完成后更新 `chapters/index.md`、`hooks/index.md`、相关人物/世界观索引。
- 长期变化写入分文档，摘要写入 `index.md`。

## Task 5: 写 Align 与 Plan 阶段

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写对齐（Align）阶段**

包含：

- 目标：确认这本小说要写什么。
- 输入：原始想法、参考作品、禁区、读者偏好。
- 输出：`origin/`、`intent/author-intent.md`、`bible/premise.md`、`bible/constraints.md`。
- 门禁：没有作者意图不进入计划。

- [ ] **Step 2: 写计划（Plan）阶段**

包含：

- 目标：形成可执行大纲。
- 输出：`outline/whole-book.md`、`outline/volume-01.md`、`outline/chapter-plan.md`、`intent/current-focus.md`。
- 方法：可使用雪花法（Snowflake Method）和节拍表（Beat Sheet）。
- 门禁：没有大纲与当前焦点不进入真相源建设或章节执行。

- [ ] **Step 3: 验证阶段门禁**

Run: `rg -n "没有作者意图|没有大纲|当前焦点|Snowflake|Beat Sheet|雪花法|节拍表" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: Align 与 Plan 阶段都有明确门禁。

## Task 6: 写真相源建设阶段

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写故事圣经（Story Bible）**

覆盖：

- `bible/premise.md`
- `bible/themes.md`
- `bible/constraints.md`

- [ ] **Step 2: 写世界观（Worldbuilding）**

覆盖：

- 能力体系（Power System）
- 地理（Geography）
- 势力（Factions）
- 历史时间线（Timeline）
- 规则限制（Rules / Limits）

- [ ] **Step 3: 写人物与关系**

覆盖：

- 人物档案（Character Bible）
- 人物弧光（Character Arc）
- 人物语气（Character Voice）
- 人物关系（Relationship Map）
- 冲突（Conflicts）

- [ ] **Step 4: 写伏笔账本（Hook Ledger）**

覆盖：

- open：新开伏笔
- advance：推进伏笔
- resolve：兑现伏笔
- defer：延期伏笔
- debt：拖欠伏笔

- [ ] **Step 5: 验证真相源术语**

Run: `rg -n "Story Bible|Worldbuilding|Character Bible|Relationship Map|Hook Ledger|open|advance|resolve|defer|debt" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 每个真相源模块都有说明。

## Task 7: 写章节执行流水线

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写单章目录结构**

包含：

```text
chapters/chapter-001/
├── index.md
├── intent.md
├── context.md
├── draft.md
├── audit.md
├── revision.md
└── settlement.md
```

- [ ] **Step 2: 写章节意图（Chapter Intent）规则**

必须说明：

- 本章目标（Chapter Goal）
- 本章读者期待（Reader Expectation）
- 本章该兑现/暂不掀的内容
- 本章人物选择
- 章尾必须发生的改变
- 本章伏笔账

- [ ] **Step 3: 写上下文包（Context Package）规则**

必须说明：

- 只选本章需要的资料。
- 必须包含当前焦点（Current Focus）。
- 必须包含相关人物、设定、伏笔、上一章摘要。
- 禁止把所有资料全塞进上下文。

- [ ] **Step 4: 写初稿（Draft）规则**

必须说明：

- 初稿只负责落地章节意图。
- 不能新增未登记的核心设定。
- 不能跳过 hook 账。

- [ ] **Step 5: 验证章节流水线**

Run: `rg -n "Chapter Intent|Context Package|Draft|本章目标|读者期待|章尾必须发生的改变" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 单章流水线可按步骤执行。

## Task 8: 写审稿、修订、验证与结算

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写审稿清单（Audit Checklist）**

至少包含：

- 人物一致性（Character Consistency）
- 世界观一致性（Worldbuilding Consistency）
- 章节目标达成（Chapter Goal Completion）
- 伏笔账对应（Hook Ledger Alignment）
- 文风漂移（Style Drift）
- 节奏与密度（Pacing / Density）

- [ ] **Step 2: 写修订（Revise）规则**

必须区分：

- 润色（Polish）：只改表达。
- 定点修复（Spot Fix）：只改指定问题。
- 改写（Rewrite）：重写问题段落。
- 重构（Rework）：调整场景结构。

- [ ] **Step 3: 写状态结算（State Settlement）**

说明章节完成后要更新：

- `chapters/index.md`
- `chapters/chapter-XXX/settlement.md`
- `hooks/active-hooks.md`
- `hooks/resolved-hooks.md`
- 相关人物、关系、世界观分文档
- `intent/current-focus.md`

- [ ] **Step 4: 验证门禁**

Run: `rg -n "Audit Checklist|Character Consistency|Hook Ledger Alignment|Polish|Spot Fix|Rewrite|Rework|State Settlement" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 审稿、修订、结算都有明确规则。

## Task 9: 写交接恢复与风格学习

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写交接恢复（Handoff / Resume）**

必须说明：

- 中断前写 `handoffs/<date>-session.md`。
- 恢复时先读 `index.md`、`intent/current-focus.md`、`chapters/index.md`、`hooks/index.md`。
- 需要深度追溯时再读具体分文档。

- [ ] **Step 2: 写风格学习（Style Learning）**

必须说明：

- 输入风格样例（Style Samples）。
- 输出 `style/reference-analysis.md`。
- 提取句式、段落节奏、意象、对话风格、禁用模式。
- 风格学习只形成规则，不直接抄袭原文。

- [ ] **Step 3: 写规律提取（Pattern Extraction）**

必须说明：

- 可从参考小说中提取结构公式、人物关系模式、章节钩子类型。
- 产物进入 `style/`、`outline/` 或 `bible/`，不得混进正文草稿。

- [ ] **Step 4: 验证恢复与风格章节**

Run: `rg -n "Handoff|Resume|Style Learning|Pattern Extraction|reference-analysis|风格样例|规律提取" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 能看到独立的恢复与风格学习流程。

## Task 10: 写 skill 化附录与快速清单

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`

- [ ] **Step 1: 写未来 skill 化附录（Skillization Appendix）**

必须包含：

- 建议 skill 名称：`novel-writing-workflow`
- 触发条件（Triggers）
- 输入（Inputs）
- 输出（Outputs）
- 工作区结构（Workspace）
- 阶段门禁（Gates）
- 子流程（Subflows）

- [ ] **Step 2: 写快速执行清单（Quick Checklist）**

用清单形式给用户：

```markdown
- [ ] 写下原始想法
- [ ] 确认作者意图
- [ ] 建立项目目录
- [ ] 写故事核心
- [ ] 写主要人物
- [ ] 写世界观硬规则
- [ ] 写总纲和第一卷纲
- [ ] 写第一章章节意图
- [ ] 组装第一章上下文包
- [ ] 写初稿
- [ ] 审稿
- [ ] 修订
- [ ] 状态结算
```

- [ ] **Step 3: 验证附录与清单**

Run: `rg -n "novel-writing-workflow|Triggers|Inputs|Outputs|Workspace|Gates|Quick Checklist|快速执行清单" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: skill 化接口和用户执行清单都存在。

## Task 11: 最终自检与 devflow 更新

**Files:**
- Modify: `zzz-prompt-debug/写小说/AI小说写作工作流.md`
- Modify: `.devflow/novel-writing-prompt-debug/state.md`
- Modify: `.devflow/novel-writing-prompt-debug/checkpoints.md`
- Create or Modify: `.devflow/novel-writing-prompt-debug/development-overview.md`

- [ ] **Step 1: 自检标题结构**

Run: `rg -n "^## " zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 14 个二级标题仍然存在。

- [ ] **Step 2: 自检目录化设计**

Run: `rg -n "Folder-based Knowledge Base|index.md|Resume Hot Path|Deep Trace Path|目录化资料库|恢复热路径|深度追溯路径" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 目录化设计是文档主线，不是附带说明。

- [ ] **Step 3: 自检专业术语双语**

Run: `rg -n "（[A-Za-z /-]+）" zzz-prompt-debug/写小说/AI小说写作工作流.md`

Expected: 关键专业术语首次出现时有中文 + English 双语表达。

- [ ] **Step 4: 更新 devflow 记录**

更新：

- `.devflow/novel-writing-prompt-debug/state.md`：标记工作流文档完成。
- `.devflow/novel-writing-prompt-debug/checkpoints.md`：追加工作流文档完成 checkpoint。
- `.devflow/novel-writing-prompt-debug/development-overview.md`：记录本 mission 从提示词读取、调研、对齐到计划的演进。

- [ ] **Step 5: 检查 git 状态**

Run: `git status --short zzz-prompt-debug/写小说 .devflow/novel-writing-prompt-debug`

Expected: 只出现工作流文档、调研报告和 devflow 相关变更；不提交，除非用户明确允许。
