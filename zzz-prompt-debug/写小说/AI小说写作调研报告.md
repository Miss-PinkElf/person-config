# AI 小说写作调研报告（AI Novel Writing Research Report）

## 1. 结论摘要（Executive Summary）

第一结论：可以先直接试用 InkOS。它已经把长篇小说（Long-form Novel）拆成创作简报（Creative Brief）、世界观（Worldbuilding）、角色（Characters）、章节意图（Chapter Intent）、写作（Writing）、审稿（Audit）、修订（Revise）和状态结算（State Settlement）等环节，覆盖了本次需求中最核心的“长任务写小说”问题。

第二结论：即使使用 InkOS，也仍然需要理解一套通用 AI 小说写作工作流（AI Novel Writing Workflow）。原因是工具只能提供执行面，用户仍要判断题材、风格、人物、设定、伏笔、章节目标和修订标准。没有这些判断，任何工具都会退化成“生成一堆看似像小说的文本”。

第三结论：长篇小说不应依赖单次提示词（Single Prompt）。稳定写长篇的关键是目录化资料库（Folder-based Knowledge Base）、真相源（Truth Source）、章节流水线（Chapter Pipeline）和交接恢复（Handoff / Resume）。

第四结论：成熟 AI 写作产品的共同方向都是“故事圣经 / 资料库”（Story Bible / Codex）。Novelcrafter 强调 Codex（故事百科），Sudowrite 强调 Story Bible（故事圣经），InkOS 强调 Truth Files（真相文件），Novel OS 强调 Standards / Novel / Manuscripts 三层上下文。

第五结论：后续如果创建 skill，应该是小说项目管理技能（Novel Project Management Skill），而不是单纯正文生成技能（Novel Text Generator Skill）。正文生成只是 Apply 阶段的一步。

## 2. 问题定义（Problem Definition）

用户当前缺少的不是“一个万能提示词”，而是写作知识（Writing Knowledge）和项目组织方法（Project Organization Method）。小说写作至少包含：

- 大纲（Outline）：故事从哪里开始，经过哪些转折，到哪里结束。
- 人物设计（Character Design）：人物想要什么，害怕什么，会怎么说话，为什么行动。
- 人物关系（Relationship Map）：谁和谁冲突、依赖、误解、背叛、共同成长。
- 世界观（Worldbuilding）：世界如何运行，有哪些规则、代价、限制和历史。
- 设定体系（Setting System）：例如能力体系、宗教体系、魔法体系、科技体系、组织体系。
- 风格学习（Style Learning）：学习某类作品的句式、节奏、意象、对话方式和章节钩子。
- 规律提取（Pattern Extraction）：从样本文本提取可复用结构，而不是复制原文表达。

AI 写长篇小说的核心风险：

- 上下文漂移（Context Drift）：越写越忘前文，或者把旧设定改掉。
- 人设崩塌（Character Drift）：角色行为不再符合经历、利益和性格底色。
- 设定冲突（Worldbuilding Conflict）：世界规则前后矛盾。
- 伏笔遗失（Hook Loss）：前面埋下的线索后面不推进、不兑现。
- 章节水化（Low-density Chapters）：有字数，但没有信息变化、关系变化或权力变化。
- 文风漂移（Style Drift）：越写越像通用 AI 文，失去目标风格。

因此，AI 小说写作应作为长期任务（Long-running Task）管理。每本小说都应有自己的工作区、真相源、章节记录、审稿记录和恢复路径。

## 3. 小说写作方法论（Novel Writing Methods）

### 3.1 雪花法（Snowflake Method）

雪花法（Snowflake Method）的核心是从极小的故事核心逐层扩展。先写一句话故事，再扩展成段落、人物摘要、故事线和章节计划。它对 AI 写作特别有用，因为 AI 很容易直接跳到正文，而雪花法强制先把核心命题和结构层次写清楚。

可吸收点：

- 用一句话核心写 `bible/premise.md`。
- 用一段故事摘要写 `outline/whole-book.md`。
- 用人物摘要写 `characters/` 下的关键人物档案。
- 用章节列表写 `outline/chapter-plan.md`。

对工作流的映射：

```text
一句话故事核心 → bible/premise.md
故事段落摘要 → outline/whole-book.md
人物摘要 → characters/*.md
章节列表 → outline/chapter-plan.md
```

### 3.2 节拍表（Beat Sheet）

节拍表（Beat Sheet）强调故事结构中的关键节点，例如开场、主题呈现、触发事件、中点、危机、高潮和结局。它适合帮助 AI 理解“当前章节在整本书里的功能”，避免每章都只是平铺直叙。

可吸收点：

- 在 `outline/volume-01.md` 中标记每卷的结构转折。
- 在 `outline/chapter-plan.md` 中标记每章的功能：铺垫、升级、兑现、转折、低谷、高潮。
- 在 `chapters/chapter-XXX/intent.md` 中明确本章节拍。

### 3.3 人物档案（Character Bible）

人物档案（Character Bible）不是“姓名 + 外貌 + 性格标签”。真正有用的人物档案需要记录：

- 欲望（Desire）：人物想得到什么。
- 恐惧（Fear）：人物害怕失去什么。
- 误信念（Misbelief）：人物对世界或自我的错误理解。
- 行动逻辑（Action Logic）：人物遇到压力时会如何选择。
- 语气（Voice）：人物说话的句式、词汇、节奏和禁忌。
- 弧光（Character Arc）：人物如何变化，哪些底线不能随便变化。

对工作流的映射：

```text
characters/
├── index.md
├── protagonist.md
├── antagonist.md
└── supporting/
```

### 3.4 世界观构建（Worldbuilding）

世界观构建（Worldbuilding）要解决的是“这个世界如何运行”。对 AI 来说，世界观文件越清楚，越不容易写出违背规则的桥段。

建议拆成：

- 能力体系（Power System）：能力来源、成长方式、代价、限制、克制关系。
- 地理（Geography）：地点、交通、距离、资源分布。
- 势力（Factions）：组织目标、利益关系、冲突线。
- 历史时间线（Timeline）：过去发生过什么，哪些历史会影响当下。
- 禁区规则（Constraints）：哪些设定不能改，哪些桥段不写。

### 3.5 伏笔账本（Hook Ledger）

伏笔账本（Hook Ledger）用于追踪线索的生命周期：

- open：新开伏笔。
- advance：推进伏笔。
- resolve：兑现伏笔。
- defer：延期伏笔。
- debt：拖欠伏笔，需要尽快处理。

这个机制对长篇特别重要。没有伏笔账本，AI 会不断开新线索，但忘记回收旧线索。

## 4. AI 小说写作工具案例（AI Novel Writing Tools）

### 4.1 InkOS

InkOS 是本次最值得优先试用的项目。它定位为故事创作智能体系统（Story Creation AI Agent），覆盖长篇小说、短篇小说、剧本、同人续写、风格模仿、开放世界互动和封面生成等场景。

它对本次需求最有价值的点：

- 长篇章节流水线（Longform Chapter Pipeline）：规划、写作、审稿、修订、状态结算分开。
- 真相文件（Truth Files）：把故事状态保存为结构化文件，避免只依赖聊天历史。
- 上下文治理（Context Governance）：区分当前任务需要读什么，避免把所有资料硬塞给模型。
- 作者意图（Author Intent）：保存整本书的长期方向。
- 当前焦点（Current Focus）：保存未来 1-3 章要聚焦的内容。
- 章节意图（Chapter Intent）：先确认下一章要完成什么，再生成正文。
- 审稿与修订（Audit / Revise）：章节完成不靠 AI 口头声明，而靠文件和工具结果。

直接使用判断：

- 个人本地使用（Personal Local Use）：可以优先尝试。
- 写作工作流研究（Workflow Research）：非常适合用来观察成熟系统如何组织小说项目。
- 二次开发或对外部署（Modification / Network Service）：需要认真评估 AGPL-3.0-only 许可证义务。

最小试用路线：

```bash
npm i -g @actalk/inkos
inkos init my-novel
cd my-novel
inkos
```

建议先用 InkOS 写一个小型测试项目，不要一开始就上长篇。测试目标是观察：

- 项目目录如何组织。
- 第一章生成前需要哪些输入。
- 审稿结果是否能发现人设、设定、节奏问题。
- 修订是否真的落盘。
- 多章之后是否能保持上下文一致。

### 4.2 Novelcrafter

Novelcrafter 的核心启发是 Codex（故事百科 / Story Bible）。它把人物、地点、传说、设定等组织成可持续维护的资料库，并让写作、规划、审阅等工具共享这些资料。

可吸收点：

- Codex 不只是笔记，而是 AI 生成和审阅时的引用源。
- 资料库可以跨系列共享，适合同一世界观下的多部作品。
- 自定义 prompting system 说明工具需要允许作者保留控制权。

对本工作流的启发：

- `characters/`、`worldbuilding/`、`relationships/` 不应只是静态文档，应通过 `index.md` 标明读取规则。
- 如果未来做 skill，要让 Agent 根据章节意图读取局部资料，而不是全量读取 Codex。

### 4.3 Sudowrite

Sudowrite 当前更常用的概念是 Story Bible（故事圣经），它把 Braindump、Genre、Style、Synopsis、Characters、Worldbuilding、Outline 等内容放在项目中，帮助 AI 在生成时引用。

可吸收点：

- 从想法（Braindump）到简介（Synopsis）、人物（Characters）、世界观（Worldbuilding）、大纲（Outline）、场景（Scenes）、正文（Prose）是逐层推进的。
- Story Bible 是来源依据（Source of Truth），不是一次性 prompt。
- 风格（Style）需要和人物、情节、场景一起影响生成。

风险提示：

- 工具能生成结构，但“为什么这个故事重要”仍要由作者判断。
- 商业化写作还需要人工编辑、版权判断和风格把关。

### 4.4 Novel OS

这里的 Novel OS 主要指两类公开项目思路：一类是多智能体小说系统（Multi-agent Novel System），另一类是面向 Claude Code / Cursor 等工具的结构化写作工作流。

共同启发：

- AI 需要多层上下文（Layered Context），例如全局写作标准（Standards）、单本小说资料（Novel）、具体稿件（Manuscripts）。
- 长篇一致性依赖人物数据库、情节追踪、时间线、风格检查和伏笔追踪。
- 项目目录本身就是上下文工程（Context Engineering）的一部分。

对本工作流的启发：

- 可以把“作者个人写作标准”与“单本小说资料”分开。
- `style/` 目录可以保存跨项目的风格规则，也可以保存单书专属风格规则。
- `chapters/` 目录必须有章节级状态，而不是只保存正文。

## 5. 本地 skills 可借鉴能力（Reusable Local Skills）

### 5.1 `kol-writer`

`kol-writer` 的流程是“询问基本信息 → 初始化工作区 → 观点速记 → 大纲梳理 → 检索回填 → 迭代优化 → 终稿归档”。它虽然面向自媒体文章，但对小说工作流有三个启发：

- 先保存原始输入，再做结构化整理。
- 先做大纲，再做检索回填。
- 迭代优化必须落盘，不只停留在聊天里。

可迁移到小说：

- `origin/` 保存原始想法。
- `outline/` 保存故事结构。
- `research/` 保存外部资料。
- `chapters/` 保存每章迭代记录。

### 5.2 `content-tone-adjuster`

`content-tone-adjuster` 提供去 AI 腔调（Remove AI Artifacts）、平实务实化（Grounded Writing）、极简直白风（Talk Normal）等规则。小说写作可以借鉴它的“风格修订是独立流程”这个思路。

可迁移到小说：

- 在 `style/forbidden-patterns.md` 中记录不想出现的 AI 套路。
- 在 `style/style-guide.md` 中记录目标文风。
- 在修订（Revise）阶段区分“剧情修复”和“文风修复”。

### 5.3 `learning-assistant`

`learning-assistant` 的核心是把学习目标拆成概念节点，并通过交互引导推进。用户提到“学习某个小说的风格、题材、规律”，这正适合借鉴学习助手的结构。

可迁移到小说：

- 把“学习悬疑小说写法”拆成概念：线索、误导、嫌疑人、时间线、反转、揭示。
- 把“学习某作者风格”拆成概念：句式、段落、意象、节奏、对话、视角。
- 学习产物不直接写正文，而是进入 `style/`、`outline/` 或 `bible/`。

### 5.4 `deep-research`

`deep-research` 的价值在于按维度拆分调研，并保留来源与可信度。小说写作中的世界观、职业、年代、历史、科技、地理都可能需要这种方式。

可迁移到小说：

- `research/sources/` 保存来源材料。
- `research/index.md` 记录调研主题和可信度。
- 调研结果先进入 `worldbuilding/` 或 `bible/`，不直接污染正文。

## 6. 可吸收模块（Reusable Modules）

### 6.1 目录化资料库（Folder-based Knowledge Base）

每本小说应该是一个目录，而不是一个巨大的 Markdown 文件。每个领域用文件夹承载，每个文件夹下有 `index.md` 作为索引和读取规则。

### 6.2 作者意图（Author Intent）

作者意图记录这本书长期不变或较少变化的方向，例如题材、读者、核心情绪、价值观、禁区和目标体验。

### 6.3 当前焦点（Current Focus）

当前焦点记录未来 1-3 章要优先推进的内容。它比作者意图更短期，适合每次恢复写作时读取。

### 6.4 故事圣经（Story Bible）

故事圣经记录故事核心命题、主题、硬约束和不可变设定。它不是全部设定的堆放处，而是最高层的判断依据。

### 6.5 人物档案（Character Bible）

人物档案记录人物欲望、恐惧、误信念、语气、行动逻辑和变化轨迹。写人物相关章节前必须读取。

### 6.6 世界观资料库（Worldbuilding Repository）

世界观资料库记录能力体系、地理、势力、历史、制度和限制。任何新增设定都要先进入资料库，再进入正文。

### 6.7 伏笔账本（Hook Ledger）

伏笔账本记录 open、advance、resolve、defer、debt，保证章节之间有承接，不让 AI 只开新坑。

### 6.8 章节流水线（Chapter Pipeline）

每章按以下顺序执行：

```text
章节意图（Chapter Intent）
→ 上下文包（Context Package）
→ 初稿（Draft）
→ 审稿（Audit）
→ 修订（Revise）
→ 状态结算（State Settlement）
```

### 6.9 审稿清单（Audit Checklist）

审稿清单至少检查人物一致性、世界观一致性、章节目标、伏笔账、文风漂移、节奏密度和信息变化。

### 6.10 交接恢复（Handoff / Resume）

长篇写作一定会中断。交接恢复文件要告诉下一次写作：当前写到哪里、下一章要做什么、哪些伏笔拖欠、哪些设定刚改过。

## 7. 对工作流设计的建议（Workflow Design Recommendations）

第一，先试 InkOS。它已经有成熟的长篇写作流水线，值得作为工具基准（Baseline Tool）。如果 InkOS 满足需求，可以围绕 InkOS 建立个人 SOP，而不是重复造轮子。

第二，同时保留自建目录化工作流。原因是工具会变，许可证、模型、成本、使用体验也会变；自己的资料库结构和写作方法不应完全绑定某个工具。

第三，工作流文档应分成两条路线：

- 直接使用 InkOS 路线（Use InkOS Directly）：适合快速开始、验证工具、跑通章节流水线。
- 自建资料库路线（Build Your Own Knowledge Base）：适合高度可控、跨工具、未来 skill 化。

第四，后续 skill 化应围绕“项目管理与上下文治理”。skill 的任务不是替用户写完小说，而是确保每次写作都读取正确材料、执行正确阶段、更新正确文件。

第五，生成正文只是 Apply 阶段的一部分。真正决定质量的是前置对齐、章节意图、上下文包、审稿修订和状态结算。

## 8. 来源索引（Sources）

- InkOS GitHub: https://github.com/Narcooo/inkos
- InkOS npm: https://www.npmjs.com/package/@actalk/inkos
- InkOS License: https://github.com/Narcooo/inkos/blob/master/LICENSE
- Snowflake Method: https://www.advancedfictionwriting.com/articles/snowflake-method/
- Save the Cat Beat Sheets: https://savethecat.com/beat-sheets
- Novelcrafter: https://www.novelcrafter.com/
- Sudowrite: https://sudowrite.com/
- Sudowrite Story Bible Documentation: https://docs.sudowrite.com/using-sudowrite/1ow1qkGqof9rtcyGnrWUBS/what-is-story-bible/jmWepHcQdJetNrE991fjJC
- Novel OS: https://github.com/mrigankad/Novel-OS
- Book OS / Novel-OS workflow: https://github.com/forsonny/book-os
- 本地 `kol-writer`：`skills/public-agent-skills/skills/kol-writer/SKILL.md`
- 本地 `content-tone-adjuster`：`skills/public-agent-skills/skills/content-tone-adjuster/SKILL.md`
- 本地 `learning-assistant`：`skills/public-agent-skills/skills/learning-assistant/SKILL.md`
- 本地 `deep-research`：`skills/public-agent-skills/skills/deep-research/SKILL.md`
