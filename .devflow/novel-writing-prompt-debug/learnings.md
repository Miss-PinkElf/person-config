# 学习记录（Learnings）

## 2026-07-07：AI 小说写作与长任务工作流初步调研

### 调研范围

- `inkos` 仓库（Repository）：`https://github.com/Narcooo/inkos`
- 小说写作方法：雪花法（Snowflake Method）、节拍表（Beat Sheet）、世界观构建（Worldbuilding）、人物设定（Character Design）
- AI 小说写作工具：InkOS、Novelcrafter、Sudowrite、Novel OS、StoryCraftr 等公开资料

### 关键发现

1. 长篇小说写作更像长期任务管理（Long-running Task Management），不是单次提示词（Single Prompt）。
   - 需要保留作者意图（Author Intent）、当前焦点（Current Focus）、世界观（Worldbuilding）、人物档案（Character Bible）、伏笔账本（Hook Ledger）、章节摘要（Chapter Summaries）等真相源。

2. `inkos` 的核心设计与 devflow 高度相似。
   - `inkos` 将长篇章节生产拆成规划（Plan）、编排（Compose）、写作（Write）、审计（Audit）、修订（Revise）、状态同步（State Settlement）。
   - 它强调结构化状态（Structured State）、人类可读投影（Readable Projection）、时序记忆（Temporal Memory）、上下文治理（Context Governance）和确认式动作系统（Confirmable Action System）。

3. 通用写作方法提供了上层创作结构。
   - 雪花法（Snowflake Method）适合从一句话核心逐步扩展到人物线、故事线和章节计划。
   - 节拍表（Beat Sheet）适合管理情绪转折（Emotional Turn）、结构转折（Structural Turn）、冲突（Conflict）和回报（Payoff）。
   - 世界观构建（Worldbuilding）和人物设定（Character Design）需要作为可维护资料库，而不是一次性 prompt 附件。

4. 成熟 AI 写作工具普遍强调“故事圣经 / 资料库”。
   - Novelcrafter 的 Codex、InkOS 的 truth files、Novel OS 的 character bibles / plot trackers / timelines 都指向同一个结论：长篇写作必须有可检索、可更新、可审计的知识库。

### 对后续方案的影响

- 第一阶段建议优先产出 AI 小说写作工作流文档（AI Novel Writing Workflow Document）与调研报告（Research Report），而不是直接创建 skill。
- 后续若创建 skill，应该是“长篇小说项目管理 skill（Longform Novel Project Skill）”，而不是“生成小说文本 skill（Novel Text Generator Skill）”。

## 2026-07-07：InkOS 是否可直接使用的判断

### 核心结论

InkOS 可以作为第一优先试用对象（First Trial Candidate）。它已经覆盖长篇小说（Long-form Novel）、短篇小说（Short Fiction）、同人/续写（Fan Fiction / Continuation）、风格模仿（Style Imitation）、开放世界互动（Open-world Play）、审稿修订（Audit / Revise）和项目级上下文治理（Context Governance）。

### 使用边界

- 个人本地使用（Personal Local Use）：可以直接通过 npm 安装试用。
- 作为写作工具研究（Workflow Research）：适合先跑通一个小项目，观察目录结构、章节流水线、真相文件和审稿结果。
- 二次开发或部署服务（Modification / Network Service）：需要认真评估 AGPL-3.0-only 许可证义务，尤其是修改后对外提供网络服务时的源码提供要求。

### 对本 mission 的影响

- 调研报告（Research Report）应把 InkOS 放在第一案例，而不是普通并列工具。
- 工作流文档（Workflow Document）应加入“直接使用 InkOS 的试用路线”和“自建目录化工作流路线”的对比。
- 后续进入 Apply 时，优先先写 InkOS 评估章节，再写通用工作流。
