# 桌宠记忆系统研究笔记

## 说明

本文档用于沉淀当前已完成的开源记忆系统（Open-source Memory Systems）探索结果。

- 当前已落盘的是已经明确返回的 subagent 结果。
- 当前未落盘完整结论的项目，表示本轮尚未成功收回结果，不代表项目未被克隆或未被初步阅读。

## 已完成项目

### `mem0`

- 定位：生产级个性化 AI 的记忆层（memory layer），强调开箱即用的长期记忆（long-term memory）、多信号召回和 SDK/API 产品化能力，更像独立记忆基础设施。
- 核心架构：写入抽取 + 向量存储（vector store）+ 实体链接（entity linking）+ 混合召回（hybrid retrieval）。
- 记忆对象：基础对象是 `MemoryItem`，围绕事实、偏好、关系、时间和作用域（`user_id` / `agent_id` / `run_id`）组织。
- 写入流程：解析消息 -> 读取同 scope 最近消息 -> 检索相关旧记忆 -> 大模型（LLM）做 ADD-only 抽取 -> 向量写入 -> SQLite 历史落盘 -> 实体抽取。
- 召回流程：语义检索 + BM25 关键词检索（BM25 keyword search）+ 实体增强分数融合，必要时再重排。
- 存储方式：默认是向量库 + SQLite；支持 Qdrant、FAISS、Redis、Pinecone、PGVector、Milvus 等适配器。
- 时间机制：显式使用 UTC 时间戳，写入和更新都保留时间字段；提示词会把相对时间改写为绝对时间。
- 关系 / 图谱机制：开源版已经不再以传统图数据库（graph database）为主，而是以实体集合和 `linked_memory_ids` 做轻量关系链接。
- 反思 / 总结机制：存在程序记忆（procedural memory）总结，但主写入链路仍偏单次抽取，而不是强反思系统。
- 隐私与控制：有作用域隔离、删除、导出能力，但默认遥测（telemetry）和积极抽取策略仍需谨慎治理。
- 适配桌宠价值：适合作为桌宠的长期事实记忆底座，尤其适合偏好、关系事实、重要日期和重复实体召回。
- 不能直接照搬的风险：
  - ADD-only 会累积过期和冲突事实。
  - 实体链接不足以承担复杂关系记忆（Relationship Memory）。
  - 默认抽取较积极，可能误存隐私或临时情绪表达。

关键证据：

- `zzz-memory-demo/mem0/README.md`
- `zzz-memory-demo/mem0/mem0/memory/main.py`
- `zzz-memory-demo/mem0/mem0/vector_stores/base.py`
- `zzz-memory-demo/mem0/mem0/utils/scoring.py`

### `langmem`

- 定位：LangGraph 生态里的记忆工具库，更像嵌入 LangGraph 应用的记忆编排组件，而不是独立记忆产品。
- 核心架构：模型抽取器 + 结构化 schema + LangGraph 基础存储（BaseStore）。
- 记忆对象：可以是简单文本记忆，也可以是三元组（Triple）、用户画像（UserProfile）、情节记忆（Episode）等结构化对象。
- 写入流程：
  - 热路径工具（hot path tools）：agent 主动 create/update/delete。
  - 后台管理器（background manager）：搜索相关旧记忆 -> 抽取新记忆 -> upsert/delete。
- 召回流程：依赖 Store 的 `search()` / `asearch()`；高级搜索器会先让 LLM 生成多个搜索 query 再排序聚合。
- 存储方式：不绑定数据库，开发期常见是 `InMemoryStore`，生产建议使用持久化 Store。
- 时间机制：长期时间依赖 Store 元数据；短期上下文有运行摘要（RunningSummary）避免重复总结；TTL（time to live）由 Store 决定。
- 关系 / 图谱机制：没有完整图数据库实现，但非常适合用结构化 schema 构造轻量知识图谱（Knowledge Graph）。
- 反思 / 总结机制：明显强于 `mem0`，提供短期总结、后台反思执行器（ReflectionExecutor）和提示词优化（prompt optimization）。
- 隐私与控制：主要由应用层负责，框架自身不提供完整的隐私同意、脱敏、审计和可视化编辑体系。
- 适配桌宠价值：更适合作为行为学习、人格调优和反思层，而不是单独承担全部记忆系统。
- 不能直接照搬的风险：
  - 不是完整产品，应用层要补治理。
  - 热路径主动管理记忆可能误写、误删、拉高延迟。
  - 结构化 schema 一旦设计僵化，会影响长期演进。

关键证据：

- `zzz-memory-demo/langmem/README.md`
- `zzz-memory-demo/langmem/src/langmem/knowledge/extraction.py`
- `zzz-memory-demo/langmem/src/langmem/knowledge/tools.py`
- `zzz-memory-demo/langmem/src/langmem/reflection.py`

### `memU`

- 定位：面向 24/7 主动智能体（Proactive Agent）的通用记忆框架，核心理念是“记忆即文件系统（Memory as File System）”。
- 核心架构：以 `MemoryService` 为组合根，使用工作流（Workflow）串联写入流程和召回流程。持久层分为资源（Resource）、记忆项（MemoryItem）、记忆分类（MemoryCategory）、分类关系（CategoryItem）。
- 记忆对象：记忆类型（MemoryType）包括 `profile`、`event`、`knowledge`、`behavior`、`skill`、`tool`；默认分类覆盖个人信息、偏好、关系、活动、目标、经历等。
- 写入流程：`memorize()` 先获取资源，再多模态预处理，调用 LLM 抽取结构化记忆，生成嵌入（Embedding），映射分类，写入记忆项和关系，最后更新分类摘要。
- 召回流程：支持基于 RAG 的路径和基于 LLM 排序的路径；先判断是否需要检索，再召回分类、记忆项、资源，并可做充分性检查（Sufficiency Check）。
- 存储方式：支持内存、SQLite、Postgres；SQLite 将向量序列化为 JSON 文本，Postgres 使用 `pgvector`。
- 时间机制：基础记录有 `created_at`、`updated_at`，记忆项有 `happened_at`；显著性排序（Salience Ranking）结合相似度、强化次数和最近强化时间。
- 关系 / 图谱机制：主要是“记忆项-分类”关系和 `[ref:xxx]` 摘要反链，不是完整人物关系图谱。
- 反思 / 总结机制：分类摘要会在写入后由 LLM 增量更新，形成主题级长期摘要。
- 隐私与控制：有用户作用域模型（User Scope Model），但更偏 API 隔离，不是终端用户导向的细粒度隐私 UI。
- 适配桌宠价值：很适合作为服务化记忆引擎参考，尤其是多模态摄入、自动抽取、分类摘要和召回编排。
- 不能直接照搬的风险：
  - 分类摘要容易压掉情感冗余。
  - 关系图谱能力不足。
  - 用户可见编辑、删除、审计和同意机制不够强。

关键证据：

- `zzz-memory-demo/memU/README.md`
- `zzz-memory-demo/memU/docs/architecture.md`
- `zzz-memory-demo/memU/src/memu/app/memorize.py`
- `zzz-memory-demo/memU/src/memu/app/retrieve.py`
- `zzz-memory-demo/memU/src/memu/database/models.py`

### `MemoryBank / SiliconFriend`

- 定位：论文 `MemoryBank` 的陪伴机器人实现，更偏长期陪伴研究原型（Research Prototype）。
- 核心架构：JSON 记忆银行（Memory Bank）保存历史；摘要脚本生成每日事件摘要和人格摘要；FAISS / llama_index 建立向量索引；聊天时把相关回忆拼入提示词（Prompt）。
- 记忆对象：以用户为根，字段包括 `history`、`summary`、`personality`、`overall_history`、`overall_personality`、`meta_information`。
- 写入流程：对话先追加到当天历史，再生成事件摘要和人格分析，并持续更新整体历史与整体人格。
- 召回流程：根据当前问题搜索向量索引，得到相关历史片段和日期，再拼接到系统提示词，让模型“开始回忆”。
- 存储方式：原始记忆是 JSON 文件；向量索引是 FAISS / llama_index 文件。
- 时间机制：按日期分层；遗忘曲线（Forgetting Curve）结合 `last_recall_date` 和 `memory_strength` 模拟遗忘与强化。
- 关系 / 图谱机制：没有显式图谱，更多依靠文本相似度和人格摘要做弱关联。
- 反思 / 总结机制：每日事件摘要、每日人格分析、整体历史、整体人格，是它最核心的长期陪伴能力。
- 隐私与控制：本地 JSON 可控，但高度依赖外部 API 进行摘要和聊天，治理能力弱。
- 适配桌宠价值：人格摘要和“被召回即强化”很适合陪伴感塑造。
- 不能直接照搬的风险：
  - 工程基础偏旧，稳定性和迁移性较弱。
  - JSON 覆盖写入和随机遗忘策略不够稳。
  - 权限、审计、删除和可视化治理较弱。

关键证据：

- `zzz-memory-demo/MemoryBank-SiliconFriend/README_cn.md`
- `zzz-memory-demo/MemoryBank-SiliconFriend/utils/memory_utils.py`
- `zzz-memory-demo/MemoryBank-SiliconFriend/memory_bank/summarize_memory.py`
- `zzz-memory-demo/MemoryBank-SiliconFriend/memory_bank/memory_retrieval/forget_memory.py`
- `zzz-memory-demo/MemoryBank-SiliconFriend/utils/prompt_utils.py`

### `BaiShou`

- 定位：本地优先（Local-first）的日记与 AI 伴侣应用，已经从记录工具演进为“有记忆的 AI 伴侣”。
- 核心架构：Markdown 作为单一事实来源（Single Source of Truth），SQLite 作为索引和检索层，支持多工作区（Vault）隔离。
- 记忆对象：日记、总结、Agent 会话、消息、消息块、助手人格、压缩快照、向量记忆。
- 写入流程：日记先写 Markdown，再同步 SQLite 影子索引；Agent 还能通过记忆存储工具（MemoryStoreTool）主动把重要信息写入向量记忆，并在写入前做去重与语义合并。
- 召回流程：支持日记搜索、日记读取、总结读取、向量搜索；向量搜索支持 sqlite-vector KNN + 全文搜索（FTS5）+ RRF 重排。
- 存储方式：每个 Vault 下同时保留 Markdown 文件和多个 SQLite 数据库。
- 时间机制：日记按日期组织；总结按周、月、季度、年覆盖时间范围；向量记忆还区分源内容真实时间。
- 关系 / 图谱机制：没有独立图数据库，但通过日记、总结、标签、人格和搜索形成较强的文本关系网络。
- 反思 / 总结机制：日记 -> 周记 -> 月报 -> 年鉴的层级总结非常完整；会话压缩也保留事实、情感、关系动态和共同回忆。
- 隐私与控制：本地优先、多 Vault 隔离、支持删除向量记忆和多种同步方式，治理能力明显好于纯研究项目。
- 适配桌宠价值：非常高，尤其适合作为“长期生活史 + 工具化 Agent 读取与回忆”的参考对象。
- 不能直接照搬的风险：
  - 工程体系较重。
  - RAG 去重和情感冗余理念存在冲突。
  - 外部模型调用仍需严格划清隐私边界。

关键证据：

- `zzz-memory-demo/BaiShou/README.md`
- `zzz-memory-demo/BaiShou/docs/白守-架构部分/1.文件系统解读.md`
- `zzz-memory-demo/BaiShou/docs/白守-架构部分/2.多存储空间设计.md`
- `zzz-memory-demo/BaiShou/lib/agent/tools/memory/memory_store_tool.dart`
- `zzz-memory-demo/BaiShou/lib/features/summary/domain/services/summary_generator_service.dart`

### `LifeBook`

- 定位：不是应用框架，而是一套基于 Markdown / Obsidian / Gemini CLI / Dataview 的人生书（Life Book）记忆管理规范。
- 核心架构：日记、周记、月度总结、季度总结、年度总结组成滚动压缩（Rolling Compression）结构。
- 记忆对象：每日日记、周期总结、人物节点、阶段节点、标签事件、附件图片。
- 写入流程：用户只写日记，AI 或脚本负责生成周 / 月 / 季 / 年总结；节点通过双链维护。
- 召回流程：不是向量召回，而是 Dataview 根据当前时间和回溯窗口生成“智能数据包”，直接交给大模型。
- 存储方式：纯 Markdown 文件和附件目录，推荐 Git / Gitea / S3 同步。
- 时间机制：时间感极强，近期保留细节，远期保留摘要，符合人的记忆折叠方式。
- 关系 / 图谱机制：使用 Obsidian 双链构建人物节点和阶段节点，属于轻量显式关系网络。
- 反思 / 总结机制：模板强制记录人物关系、关键事件、认知变化、状态评估和阶段回顾。
- 隐私与控制：纯文件、低门槛、强可迁移，但一旦复制给外部模型，隐私仍需人工控制。
- 适配桌宠价值：非常高，尤其适合做长期人格与共同经历档案层。
- 不能直接照搬的风险：
  - 缺少实时 API。
  - 无权限系统和结构化数据库。
  - 人工维护成本较高。

关键证据：

- `zzz-memory-demo/LifeBook/README.md`
- `zzz-memory-demo/LifeBook/1.人生书/0.使用手册/0.用户使用手册.md`
- `zzz-memory-demo/LifeBook/1.人生书/0.使用手册/1.AI使用手册.md`
- `zzz-memory-demo/LifeBook/1.人生书/3.数据汇总/0.数据汇总-指定月数.md`
- `zzz-memory-demo/LifeBook/1.人生书/1.Node/角色节点示例/霞雨樱(2025-12-24创建).md`

## 当前阶段性判断

- `BaiShou` 和 `LifeBook` 对桌宠长期陪伴场景最贴近，因为它们同时强调时间感、生活史、关系沉淀和本地数据主权。
- `mem0` 更适合作为事实型长期记忆底座。
- `langmem` 更适合作为行为学习、反思和人格调优层。
- `memU` 很适合作为服务层编排和多模态写入 / 召回参考。
- `MemoryBank / SiliconFriend` 适合作为“遗忘与强化”和“人格摘要”的启发来源，但不适合作为现成工程底座。

### `Graphiti`

- 定位：时序上下文图（Temporal Context Graph）引擎，不是简单聊天记录存储，而是把输入片段（Episode）抽取为实体（Entity）、事实关系（Fact / Relationship）、来源链路和社区摘要。
- 核心架构：`Graphiti` 类组合图数据库驱动（GraphDriver）、大语言模型客户端（LLMClient）、向量嵌入器（EmbedderClient）和重排器（CrossEncoderClient）；支持 Neo4j、FalkorDB、Kuzu、Neptune。
- 记忆对象：
  - 片段节点（EpisodicNode）
  - 实体节点（EntityNode）
  - 实体边（EntityEdge）
  - 社区节点（CommunityNode）
  - Saga 节点（SagaNode）
- 写入流程：`add_episode` 会读取最近上下文，再用 LLM 抽取实体、去重、抽取关系边、失效旧事实、更新实体摘要和社区。
- 召回流程：混合检索（Hybrid Search），融合全文检索、向量相似度、图遍历、RRF、MMR 和交叉编码器重排。
- 时间机制：非常强。Episode 有 `valid_at`，EntityEdge 有 `valid_at`、`invalid_at`、`expired_at`、`reference_time`，新事实可以让旧事实失效，但不会直接删除历史。
- 关系 / 图谱机制：这是它的核心强项。Episode 通过 `MENTIONS` 连实体，实体之间通过 `RELATES_TO` 表达事实关系，Saga 和 Community 负责线程与聚合。
- 反思 / 总结机制：支持实体摘要、社区摘要和 Saga 增量总结。
- 隐私与控制：有 `store_raw_episode_content` 开关和 `group_id` 分区，但完整用户权限、审计和删除策略仍要靠外层系统。
- 适配桌宠价值：非常适合补“关系记忆（Relationship Memory）”和“时间感记忆图谱（Memory Graph）”，尤其适合处理“以前喜欢 A，现在改成 B”这类事实演化。
- 不能直接照搬的风险：
  - 栈很重，部署和延迟成本高。
  - 自动实体 / 关系抽取容易误关联。
  - 如果桌宠只需要稳定陪伴和轻量偏好记忆，完整图数据库方案可能过度设计。

关键证据：

- `zzz-memory-demo/graphiti/README.md`
- `zzz-memory-demo/graphiti/graphiti_core/graphiti.py`
- `zzz-memory-demo/graphiti/graphiti_core/nodes.py`
- `zzz-memory-demo/graphiti/graphiti_core/edges.py`
- `zzz-memory-demo/graphiti/graphiti_core/search/search.py`

### `Memobase`

- 定位：用户档案型长期记忆系统（User Profile-based Long-term Memory），围绕用户档案（Profile）和事件时间线（Event Timeline）组织长期记忆。
- 核心架构：FastAPI 服务，后端使用 PostgreSQL、Redis 和 pgvector；API 层管理 User、Blob、Profile、Event、Context、Buffer。
- 记忆对象：
  - 用户（User）
  - 数据块（Blob）
  - 缓冲区（BufferZone）
  - 用户档案（UserProfile）
  - 用户事件（UserEvent）
  - 事件要点（UserEventGist）
- 写入流程：写入从 `/blobs/insert/{user_id}` 进入，先保存 Blob 和 Buffer；达到阈值后进入聊天处理流程：
  - 入口摘要（entry summary）
  - 抽取档案事实
  - 合并 / 验证档案
  - 生成事件标签
  - 写入 UserEvent 和 UserProfile
- 召回流程：主要通过 Context API 并行读取 Profile 和 Event Gist，并按 token 配额、主题偏好、时间范围和相似度阈值裁剪成系统提示词上下文。
- 存储方式：PostgreSQL 关系数据 + JSONB 内容 + pgvector 事件向量 + Redis 缓存和后台队列。
- 时间机制：偏事件流（Event Stream），主要依赖 `created_at/updated_at` 和最近事件检索，不像 Graphiti 那样维护“事实有效期窗口”。
- 关系 / 图谱机制：没有显式知识图谱，关系主要隐含在 `topic/sub_topic`、`profile_delta`、`event_tags` 和 `event_gist` 中。
- 反思 / 总结机制：非常产品化，会做入口摘要、档案抽取、合并、重新总结和组织（organize）。
- 隐私与控制：治理能力较完整，有鉴权、项目级 profile config、手动增删改 profile、删除用户级联清理；默认还可在 flush 后删除原始 chat blob。
- 适配桌宠价值：非常适合作为桌宠的主记忆层基础，尤其适合稳定、可控、可解释的“用户画像 + 近期事件”体系。
- 不能直接照搬的风险：
  - 关系表达不足，容易退化成扁平标签库。
  - 自动 profile 抽取可能过度推断心理状态。
  - 如果要承载复杂共同经历和承诺网络，仍需要补关系层。

关键证据：

- `zzz-memory-demo/memobase/src/server/api/api.py`
- `zzz-memory-demo/memobase/src/server/api/memobase_server/models/database.py`
- `zzz-memory-demo/memobase/src/server/api/memobase_server/controllers/modal/chat/__init__.py`
- `zzz-memory-demo/memobase/src/server/api/memobase_server/controllers/context.py`
- `zzz-memory-demo/memobase/docs/site/api-reference/prompt/get_context.mdx`

### `Letta`

- 定位：通用 Agent 后端运行时与长期记忆框架，更接近记忆运行时（Memory Runtime），不是桌宠前端产品。
- 核心架构：核心记忆（Core Memory）、归档记忆（Archival Memory）、召回记忆（Recall Memory）和上下文压缩（Context Compaction）四层组织；服务层由 `PassageManager`、`AgentManager`、`MessageManager` 等组成。
- 记忆对象：
  - 记忆块（Block）
  - 归档片段（Passage）
  - 消息（Message）
  - 归档库（Archive）
- 写入流程：
  - `core_memory_append` / `core_memory_replace` 修改核心记忆块
  - `archival_memory_insert` 写长期归档并生成向量
- 召回流程：
  - 对话搜索（Conversation Search）
  - 归档搜索（Archival Memory Search）
- 存储方式：ORM + 向量后端，可走 PostgreSQL 或外部向量服务。
- 时间机制：依赖消息时间、`Passage.created_at`、时间范围过滤和 Agent 时区转换。
- 关系 / 图谱机制：更偏数据库实体关系，不是面向生活关系的记忆图谱（Memory Graph）。
- 反思 / 总结机制：更偏工程化压缩和后台维护，而不是陪伴式日 / 周反思。
- 隐私与控制：有只读记忆块（Read-only Block）、工具审批（Tool Approval）、组织级隔离，但桌宠场景仍需补敏感信息分级与用户确认。
- 适配桌宠价值：适合借鉴“核心 / 归档 / 召回”三层记忆抽象。
- 不能直接照搬的风险：
  - 架构偏重。
  - 写入方式过于工具化。
  - 缺少原生情绪、亲密度和生活节律模型。

关键证据：

- `zzz-memory-demo/letta/letta/schemas/memory.py`
- `zzz-memory-demo/letta/letta/schemas/block.py`
- `zzz-memory-demo/letta/letta/schemas/passage.py`
- `zzz-memory-demo/letta/letta/functions/function_sets/base.py`
- `zzz-memory-demo/letta/letta/services/passage_manager.py`

### `VCPToolBox`

- 定位：VCP 生态的工具后端与长期记忆引擎，核心是“日记 + 标签 + 向量检索 + RAG 注入 + 反思整理”。
- 核心架构：
  - `KnowledgeBaseManager.js` 负责文件监听、切块、向量化、SQLite schema
  - `TagMemoEngine.js` 负责标签增强、共现矩阵、图式扩散
  - `RAGDiaryPlugin.js` 负责时间解析、召回、重排和上下文注入
  - `AIMemo` / `AgentDream` 负责反思与阶段整理
- 记忆对象：
  - 日记文件
  - 文本块（Chunk）
  - 标签（Tag）
  - 文件-标签关系
  - 上下文向量
  - 折叠记忆（Folding Store）
- 写入流程：写日记 -> 生成 / 修复标签 -> 文件落盘 -> 监听变化 -> 切块、嵌入、写 SQLite -> 更新向量索引与标签索引。
- 召回流程：中文时间解析 -> 标签 / 语义 / 全文候选召回 -> TagMemo 增强 -> 时间衰减重排 -> RAG 注入。
- 存储方式：文件系统日记 + SQLite 元数据 + `.usearch` 向量索引 + 插件状态文件。
- 时间机制：非常贴近日记记忆，支持中文自然语言时间和时间衰减召回。
- 关系 / 图谱机制：主要是标签图谱（Tag Graph），不是完整人物关系图谱。
- 反思 / 总结机制：是强项，包含 AI 记忆整理、梦境回顾和元思考链。
- 隐私与控制：可读日记是优势，但外部 API、自动标签、自动总结都带来隐私和误解风险。
- 适配桌宠价值：非常适合借鉴“日记式写入”“标签式主题关系”“中文时间召回”“梦境式反思”。
- 不能直接照搬的风险：
  - 插件链路和算法复杂度高。
  - 可解释性较差。
  - 索引一致性与隐私边界都要重做。

关键证据：

- `zzz-memory-demo/VCPToolBox/docs/MEMORY_SYSTEM.md`
- `zzz-memory-demo/VCPToolBox/KnowledgeBaseManager.js`
- `zzz-memory-demo/VCPToolBox/TagMemoEngine.js`
- `zzz-memory-demo/VCPToolBox/Plugin/RAGDiaryPlugin/RAGDiaryPlugin.js`
- `zzz-memory-demo/VCPToolBox/Plugin/AgentDream/AgentDream.js`

### `VCPChat`

- 定位：Electron 前端与桌面陪伴入口，本身不是核心记忆引擎，而是把后端记忆能力包装为可视化、可编辑、可观察的桌面体验。
- 核心架构：
  - Memo 管理中心
  - Memo 工作台
  - 神经云图（Neural Graph）
  - RAG 观察器
  - VCP 客户端
- 记忆对象：日记文件、Memo 配置、聊天历史、RAG 观察器事件、图谱节点与联想结果。
- 写入流程：主要通过 UI 和 VCP 工具间接写入，不直接管理底层向量索引。
- 召回流程：前端触发搜索、图谱联想、RAG 观察器展示和本地历史检索。
- 存储方式：前端本地配置 + 聊天历史；记忆正文和索引仍主要在后端。
- 时间机制：有基础时间线与话题活跃状态，但不是时间解析核心。
- 关系 / 图谱机制：偏可视化层，真实关系计算来自后端。
- 反思 / 总结机制：不是底层反思引擎，但提供人工整理入口。
- 隐私与控制：UI 可见、可编辑、可删除是优势；风险在于前端删除不等于底层索引、缓存、摘要都已同步清理。
- 适配桌宠价值：适合借鉴“记忆管理 UI”“回忆网络可视化”“轻量提示层”和“用户控制入口”。
- 不能直接照搬的风险：
  - UI 偏工具型。
  - RAG 观察器过于技术化。
  - 前端不能替代底层隐私策略。

关键证据：

- `zzz-memory-demo/VCPChat/README.md`
- `zzz-memory-demo/VCPChat/Memomodules/memo.js`
- `zzz-memory-demo/VCPChat/Memomodules/memo-workbench.js`
- `zzz-memory-demo/VCPChat/Memomodules/memo-graph.js`
- `zzz-memory-demo/VCPChat/modules/ipc/ragHandlers.js`

## 当前尚未收回完整结果的项目

- 无

## 最新阶段性判断

- `BaiShou` 和 `LifeBook` 最贴近桌宠长期陪伴，因为它们把时间感、生活史、关系沉淀和本地数据主权放在中心位置。
- `mem0` 适合作为事实型长期记忆底座。
- `langmem` 适合作为行为学习、反思和人格调优层。
- `memU` 适合作为服务层编排和多模态写入 / 召回参考。
- `MemoryBank / SiliconFriend` 适合作为“遗忘与强化”“人格摘要”的灵感来源，但不适合作为工程底座。
- `Graphiti` 适合补“关系记忆（Relationship Memory）+ 时间感图谱”，但不适合早期整体照搬。
- `Memobase` 适合作为“用户画像（User Profile）+ 事件时间线（Event Timeline）”主记忆层参考。
- `Letta` 适合借鉴“核心记忆 / 归档记忆 / 召回记忆”三层抽象。
- `VCPToolBox` 适合借鉴“日记式写入、标签主题关系、中文时间召回、梦境式反思”。
- `VCPChat` 适合借鉴“用户如何看见、管理和删除记忆”的前端控制面。
