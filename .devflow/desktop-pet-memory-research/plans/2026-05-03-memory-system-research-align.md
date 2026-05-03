# 桌宠记忆系统研究对齐记录

## 背景

本轮任务来自 `zzz-prompt-debug/记忆/prompt.md`。目标是围绕桌宠项目（Desktop Pet Project）的长期陪伴记忆需求，阅读本地 PRD（Product Requirements Document，产品需求文档）和现有记忆系统设计，并参考多个开源记忆系统（Open-source Memory Systems），形成可用于后续优化现有记忆内核（Memory Kernel）的研究结论。

## 已确认输入

- `zzz-prompt-debug/记忆/原始PRD.md`
- `zzz-prompt-debug/记忆/桌宠项目详细PRD.md`
- `zzz-prompt-debug/记忆/记忆相关.md`
- `zzz-prompt-debug/记忆/桌宠最终记忆系统详解.md`

## 需求理解

本轮不是直接改业务代码，而是完成研究、分析和对比。核心问题是：

1. 现有桌宠记忆系统（Memory System）已经有信号记录（SignalRecord）、记忆事件（MemoryEvent）、记忆画像（MemoryProfile）、关系线索（RelationshipNote）、主动关心（Heart）和智能外层（Agent）。
2. 当前短板集中在兴趣 / 偏好记忆（Interest / Preference Memory）、记忆图谱（Memory Graph）、回忆 / 类比（Recall / Analogy）和反思记忆（Reflective Memory）。
3. 需要通过开源项目研究判断哪些设计值得借鉴，哪些不应照搬，以及现有架构下一步应该如何最小增量演进。

## 采用方案

采用“聚焦深度对比”方案：

- 克隆并探索关键开源项目到 `zzz-memory-demo/`。
- 不保留各仓库 `.git` 目录。
- 优先分析与桌宠陪伴场景相关度最高的项目：
  - `mem0（通用长期记忆层）`
  - `memU（文件系统式长期记忆）`
  - `Graphiti（时间感知知识图谱）`
  - `Memobase（用户画像 + 事件时间线）`
  - `Letta（分层内存 / 上下文管理）`
  - `MemoryBank / SiliconFriend（长期陪伴记忆）`
- 辅助参考：
  - `BaiShou（个人 AI 记忆管理）`
  - `LifeBook（个人 AI 记忆 / 关系向）`
  - `VCPToolBox（Agent 知识库）`
  - `VCPChat（Agent 对话系统）`
  - `LangMem（框架化记忆组件）`
  - `Generative Agents（生成式智能体思想来源）`

## 最终产物

最终产出一份中文研究报告，建议路径：

`zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`

报告至少包含：

1. 项目逐项分析：定位、架构、记忆对象、写入流程、召回流程、适配桌宠价值。
2. 横向对比：检索型记忆（Retrieval Memory）、上下文管理型记忆（Context Management Memory）、时间图谱型记忆（Temporal Graph Memory）、画像 / 事件流记忆（Profile / Timeline Memory）、陪伴型记忆（Companion Memory）。
3. 对现有系统的优化建议：哪些应该补、哪些暂缓、哪些不适合照搬。
4. 推荐实施路线：以现有记忆内核（Memory Kernel）为基础，按兴趣画像（InterestProfile）、记忆图谱（MemoryGraph）、回忆服务（RecallService）、主动关心消费回忆（Heart consumes Recall）、反思记忆（ReflectiveMemory）逐步推进。

## 边界

- 不修改现有业务代码。
- 不跑全量项目 Demo，除非项目结构无法仅通过源码和文档理解。
- 不做全局 ESLint 校验。
- 不处理不相关 TypeScript（TypeScript）报错。
- 本轮允许新增研究目录 `zzz-memory-demo/` 和研究报告文档。

## 自检

- 无 `TBD`、`TODO` 或占位内容。
- 研究范围聚焦在桌宠长期陪伴记忆，不扩展到通用 Agent 平台重构。
- 方案符合先对齐（Align）、再计划（Plan）、再执行（Apply）的门禁。
