# AI 小说写作工作流对齐文档（AI Novel Writing Workflow Align）

## 1. 背景

本 mission 来源于 `zzz-prompt-debug/写小说/prompt-1.md`。用户希望理解如何用 AI 写好小说，并进一步探索是否需要写作技能（Writing Skill）、风格提取技能（Style Extraction Skill）或可长期执行的小说创作工作流。

经过首轮对齐，第一阶段产物确定为：

1. AI 小说写作工作流文档（AI Novel Writing Workflow Document）
2. AI 小说写作调研报告（Research Report）
3. 未来 skill 化附录（Skillization Appendix）

工作流文档应同时满足两个目标：

- 作为个人可执行 SOP（Standard Operating Procedure），让用户可以照着一步步写小说。
- 为后续 `novel-writing-workflow` 类 skill 保留结构化接口。

## 2. 已确认方向

### 2.1 小说写作是长期任务

长篇小说不是单次提示词（Single Prompt）能稳定完成的任务。它更像 devflow mission，需要：

- 原始输入（Origin）
- 当前状态（State）
- 作者意图（Author Intent）
- 当前焦点（Current Focus）
- 真相源（Truth Source）
- 阶段计划（Plan）
- 章节执行（Apply）
- 审稿与修订（Review / Revise）
- 验证与状态结算（Verify / State Settlement）
- 交接恢复（Handoff / Resume）

### 2.2 优先目录化资料库

用户明确提出：小说可能非常大，最好使用文件夹结构，每个文件夹下维护 `index.md`，细节拆到多个分文档。

因此，后续工作流不采用单个大 Markdown 文件承载全部设定，而采用目录化资料库（Folder-based Knowledge Base）。

### 2.3 第一阶段不直接写 skill

当前阶段不直接创建 skill。原因：

- 工作流边界尚未完全定型。
- skill 是执行包装，应该建立在明确的阶段流程、工作区结构和门禁规则上。
- 先写 SOP 与调研报告，有利于后续自然转成 skill。

## 3. 调研摘要

### 3.1 InkOS 的启发

`inkos` 是故事创作智能体系统（Story Creation AI Agent），覆盖长篇小说、短篇、剧本、同人、仿写续写和互动世界。

对本 mission 最有价值的设计点：

- 长篇章节不是直接生成，而是经过规划（Plan）、编排（Compose）、写作（Write）、审稿（Audit）、修订（Revise）、状态结算（State Settlement）。
- 使用真相文件（Truth Files）保存结构化状态，并提供人类可读投影（Readable Projection）。
- 使用上下文治理（Context Governance）区分受保护事实（Protected Facts）和可压缩历史（Compressible History）。
- 使用作者意图（Author Intent）和当前焦点（Current Focus）分别管理长期方向与近期 1-3 章焦点。
- 将伏笔、章节摘要、人物关系、风格指南作为可持续更新的资产，而不是临时 prompt。

参考：`https://github.com/Narcooo/inkos`

### 3.2 小说写作方法的启发

可吸收的通用方法：

- 雪花法（Snowflake Method）：适合从一句话核心逐步扩展到故事摘要、人物线、章节计划。
- 节拍表（Beat Sheet）：适合管理结构转折、冲突升级、高潮与回落。
- 人物档案（Character Bible）：用于维护人物动机、语气、关系、禁忌和变化轨迹。
- 世界观构建（Worldbuilding）：用于维护规则、地理、势力、历史、能力系统和限制条件。
- 伏笔账本（Hook Ledger）：用于管理埋设、推进、兑现、延期，避免“开坑不收”。

参考：

- `https://www.advancedfictionwriting.com/articles/snowflake-method/`
- `https://savethecat.com/beat-sheets`

### 3.3 AI 写作工具的共同点

Novelcrafter、Sudowrite、Novel OS、InkOS 等工具的共同方向是：

- 有故事资料库或 Codex（Story Codex）
- 有人物、设定、风格和章节计划
- 支持长篇上下文恢复
- 支持按章节迭代，而不是一次生成整本书
- 越成熟的系统越重视资料分层、局部检索和状态同步

## 4. 建议工作区结构

每本小说对应一个目录：

```text
novels/<book-slug>/
├── index.md
├── origin/
│   ├── index.md
│   └── 2026-07-07-initial-idea.md
├── intent/
│   ├── index.md
│   ├── author-intent.md
│   └── current-focus.md
├── bible/
│   ├── index.md
│   ├── premise.md
│   ├── themes.md
│   └── constraints.md
├── worldbuilding/
│   ├── index.md
│   ├── cosmology.md
│   ├── power-system.md
│   ├── geography.md
│   ├── factions.md
│   └── timeline.md
├── characters/
│   ├── index.md
│   ├── protagonist.md
│   ├── antagonist.md
│   └── supporting/
├── relationships/
│   ├── index.md
│   ├── relationship-map.md
│   └── conflicts.md
├── outline/
│   ├── index.md
│   ├── whole-book.md
│   ├── volume-01.md
│   └── chapter-plan.md
├── hooks/
│   ├── index.md
│   ├── active-hooks.md
│   ├── resolved-hooks.md
│   └── debt.md
├── chapters/
│   ├── index.md
│   └── chapter-001/
│       ├── index.md
│       ├── intent.md
│       ├── context.md
│       ├── draft.md
│       ├── audit.md
│       ├── revision.md
│       └── settlement.md
├── style/
│   ├── index.md
│   ├── style-guide.md
│   ├── reference-analysis.md
│   └── forbidden-patterns.md
├── research/
│   ├── index.md
│   └── sources/
└── handoffs/
    ├── index.md
    └── 2026-07-07-session.md
```

## 5. `index.md` 的职责

每个目录下的 `index.md` 不承载全部细节，只负责：

- 说明本目录用途
- 列出关键文件
- 标记当前热路径（Hot Path）
- 标记哪些文件是深度追溯路径（Deep Trace Path）
- 给 AI 说明何时读取哪个文件
- 记录最近变更摘要

示例：

```markdown
# 人物索引（Character Index）

## 用途

维护所有人物档案、人物弧光和人物语气。

## 热路径

- `protagonist.md`
- `antagonist.md`
- `supporting/index.md`

## 深度追溯

- `supporting/*.md`
- `voice-samples/*.md`

## 读取规则

- 写主角章节时必须读取 `protagonist.md`。
- 写对手冲突时必须读取 `antagonist.md`。
- 配角只在本章出现或影响决策时读取。
```

## 6. 阶段流程

### 6.1 对齐（Align）

目标：确认这本小说到底要写什么。

产物：

- `origin/index.md`
- `origin/<date>-initial-idea.md`
- `intent/author-intent.md`
- `bible/premise.md`
- `bible/constraints.md`

关键问题：

- 题材是什么？
- 读者是谁？
- 核心爽点或核心情绪是什么？
- 不想写什么？
- 长篇、短篇、连载，还是实验性文本？

### 6.2 计划（Plan）

目标：形成可执行的大纲与写作路径。

产物：

- `outline/whole-book.md`
- `outline/volume-01.md`
- `outline/chapter-plan.md`
- `intent/current-focus.md`

### 6.3 真相源建设（Truth Source）

目标：建立后续章节写作必须遵守的事实与规则。

产物：

- `bible/`
- `worldbuilding/`
- `characters/`
- `relationships/`
- `style/`
- `hooks/`

### 6.4 章节执行（Apply）

单章流程：

```text
章节意图（Chapter Intent）
→ 上下文包（Context Package）
→ 初稿（Draft）
→ 审稿（Audit）
→ 修订（Revise）
→ 状态结算（State Settlement）
```

章节目录：

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

### 6.5 审稿与验证（Review / Verify）

检查项：

- 人物一致性（Character Consistency）
- 世界观一致性（Worldbuilding Consistency）
- 伏笔推进与兑现（Hook Advance / Resolve）
- 章节目标达成（Chapter Goal Completion）
- 文风漂移（Style Drift）
- 信息密度与节奏（Density / Pacing）

### 6.6 交接恢复（Handoff / Resume）

目标：长时间中断后能恢复，不依赖聊天历史。

产物：

- `handoffs/index.md`
- `handoffs/<date>-session.md`
- 各目录 `index.md` 的热路径说明

## 7. 未来 skill 化接口

后续可设计 `novel-writing-workflow` skill。

### 7.1 触发条件（Triggers）

- “帮我写小说”
- “我要长期写一本小说”
- “帮我设计世界观/人物/大纲”
- “继续上一章”
- “检查这章有没有崩人设”
- “提取这个小说的风格”

### 7.2 输入（Inputs）

- 原始想法（Initial Idea）
- 参考作品（Reference Works）
- 风格样例（Style Samples）
- 已有章节（Existing Chapters）
- 用户禁区（Constraints）

### 7.3 输出（Outputs）

- 小说项目目录
- 写作工作流文档
- 调研报告
- 人物/世界观/大纲/伏笔资料库
- 分章草稿、审稿、修订和结算文件

### 7.4 门禁（Gates）

- 没有作者意图（Author Intent）不进入大纲。
- 没有人物基本档案（Character Bible）不写正文。
- 没有章节意图（Chapter Intent）不生成章节。
- 没有审稿（Audit）不声明章节完成。
- 没有状态结算（State Settlement）不进入下一章。

## 8. 非目标

第一阶段不做：

- 不直接实现 skill。
- 不直接生成完整小说。
- 不创建复杂应用或 UI。
- 不把 `inkos` 复制进本仓库。
- 不强制绑定某个 AI 写作工具。

## 9. 待确认问题

1. 第一份工作流文档是否只写通用小说，还是优先偏网络小说（Web Novel）？
2. 调研报告是否需要继续深入对比 `inkos`、Novelcrafter、Sudowrite、Novel OS？
3. 是否需要为目录结构配套模板文件（Template Files）？
4. 未来 skill 名称是否暂定为 `novel-writing-workflow`？

## 10. 对齐结论

当前建议进入下一阶段：计划（Plan）。

计划阶段应产出两个落盘计划：

1. 调研报告计划（Research Report Plan）
2. AI 小说写作工作流文档计划（Workflow Document Plan）

计划完成后，再决定是否进入正式撰写（Apply）。
