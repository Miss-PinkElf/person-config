# 桌宠记忆系统研究 Handoff

## 基础信息

- 创建时间：2026-05-03
- mission：`desktop-pet-memory-research`
- 当前阶段：`Research Apply（研究执行）`
- handoff 编号：`001`
- 是否 superseded：否

## 当前目标

- 基于 `zzz-prompt-debug/记忆/prompt.md` 的要求，完成开源记忆系统（Open-source Memory Systems）研究，对比其设计，并给出面向桌宠记忆系统（Desktop Pet Memory System）的优化建议。

## 当前进度

- 已完成 mission 初始化、轻量对齐（Mini Align）和计划（Plan）落盘。
- 已克隆关键外部仓库到 `zzz-memory-demo/`，并删除了各快照内部 `.git` 目录。
- 已完成关键项目的 subagent 研究结果收回，并已整理进 `research-notes.md`。

## 本轮完成内容

- [x] 读取需求文档与现有记忆设计：
  - `zzz-prompt-debug/记忆/prompt.md`
  - `zzz-prompt-debug/记忆/原始PRD.md`
  - `zzz-prompt-debug/记忆/桌宠项目详细PRD.md`
  - `zzz-prompt-debug/记忆/记忆相关.md`
  - `zzz-prompt-debug/记忆/桌宠最终记忆系统详解.md`
- [x] 初始化 `.devflow/desktop-pet-memory-research/`
- [x] 写入对齐记录和执行计划
- [x] 创建 `zzz-memory-demo/README.md`
- [x] 克隆开源项目快照并移除内部 `.git`
- [x] 保存全部已收回的 subagent 研究结果到 `research-notes.md`

## 关键决策与原因

| 决策 | 备选方案 | 原因 |
| --- | --- | --- |
| 采用“聚焦深度对比”方案 | 只读 README；逐个跑通 Demo | 当前任务是研究与架构判断，不是完整跑通项目；需要足够深度，但不值得承受全量 Demo 成本 |
| 使用 `zzz-memory-demo/` 保存仓库快照 | 直接只看远程仓库页面 | 本地源码探索更稳定，也便于后续继续读关键实现文件 |
| 先保存已返回的 subagent 结果，不继续长等 | 等全部 subagent 完成后再保存 | 用户明确表示上下文过长，需要先创建可恢复入口 |

## 关键文件 / 产物

| 文件 | 作用 | 相关性 |
| --- | --- | --- |
| `.devflow/desktop-pet-memory-research/plans/2026-05-03-memory-system-research-align.md` | 轻量对齐记录 | 说明研究目标、范围和产物 |
| `.devflow/desktop-pet-memory-research/plans/2026-05-03-memory-system-research-plan.md` | 执行计划 | 定义研究步骤 |
| `.devflow/desktop-pet-memory-research/research-notes.md` | 已完成项目研究笔记 | 保存当前收回的 subagent 结果 |
| `zzz-memory-demo/README.md` | 外部项目快照目录说明 | 说明目录用途和项目范围 |
| `zzz-memory-demo/` | 外部仓库源码快照 | 后续继续分析的核心输入 |

## 风险 / 阻塞项 / 开放问题

- [ ] 当前还没有最终研究报告：
  - 目标路径：`zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
- [ ] `VCPToolBox / VCPChat` 偏能力中间层和客户端引擎，后续要控制篇幅，避免偏离“记忆系统”主线。

## 立即下一步

1. 基于 `research-notes.md` 输出最终研究报告：
   `zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
2. 在最终报告中控制 `VCPToolBox / VCPChat` 的篇幅，避免喧宾夺主。
3. 产出“推荐优化路线”和“暂不建议做的事情”两节，直接服务后续架构决策。

## 恢复指引

1. 先读取 `.devflow/desktop-pet-memory-research/state.md`
2. 再读取 `.devflow/desktop-pet-memory-research/checkpoints.md`
3. 然后读取 `.devflow/desktop-pet-memory-research/handoffs/index.md`
4. 再读取本 handoff：
   `.devflow/desktop-pet-memory-research/handoffs/2026-05-03-001-partial-subagent-results.md`
5. 最后读取 `.devflow/desktop-pet-memory-research/research-notes.md`
6. 如果需要补上下文，再读 `zzz-prompt-debug/记忆/桌宠最终记忆系统详解.md`

## 可从活跃上下文移除的内容

- 已完成的 `mem0 / langmem / memU / MemoryBank / BaiShou / LifeBook / Graphiti / Memobase / Letta / VCPToolBox / VCPChat` 分析细节已落盘。
- 仓库克隆与代理设置过程无需继续保留在聊天上下文中。
