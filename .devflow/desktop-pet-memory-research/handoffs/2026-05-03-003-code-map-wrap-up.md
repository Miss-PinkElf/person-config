# 桌宠记忆系统研究 Handoff

## 基础信息

- 创建时间：2026-05-03
- mission：`desktop-pet-memory-research`
- 当前阶段：`Handoff（交接暂停）`
- handoff 编号：`003`
- 是否 superseded：否

## 当前目标

- 基于已经完成的开源记忆系统（Open-source Memory Systems）研究，帮助 `agent-desktop-pet` 的桌宠记忆系统设计（Desktop Pet Memory System Design）落地。
- 本轮已完成用户新增要求：生成“可借鉴什么、对应源码在哪里”的实现导向清单。

## 当前进度

- 开源项目研究阶段已经完成，研究笔记已落盘到 `research-notes.md`。
- 已生成面向另一个项目实现使用的代码位置清单：
  `zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md`
- 文档中所有关键源码引用均使用绝对路径，并已验证缺失路径为 `0`。

## 本轮完成内容

- [x] 回答开源项目对当前设计的帮助：验证设计分层、提供实现参考、控制实现复杂度。
- [x] 明确 `zzz-prompt-debug/记忆/桌宠最终记忆系统详解.md` 是目标设计文档（Target Design Document），不是当前实现状态。
- [x] 写入计划：`.devflow/desktop-pet-memory-research/plans/2026-05-03-open-source-memory-reference-code-map-plan.md`
- [x] 生成清单：`zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md`
- [x] 更新 `state.md`、`workflow.md`、`decision-log.md`、`checkpoints.md`。
- [x] 维护 `checkpoints-archive.md`，确保 `checkpoints.md` 只保留最近 3 条。
- [x] 维护 `handoffs/index.md` 并生成本 handoff。
- [x] 更新下一次对话提示词。

## 关键决策与原因

| 决策 | 备选方案 | 原因 |
| --- | --- | --- |
| 单独生成“可借鉴代码位置清单” | 把代码位置混入最终研究报告 | 用户明确需要在另一个项目中使用，单独清单更适合实现阶段查阅 |
| 文档使用绝对路径 | 继续使用相对路径 | 用户明确要求“最好具体到代码文件的位置，使用绝对路径” |
| 按设计层组织清单 | 按开源项目逐个介绍 | 另一个项目实现时更需要知道每个设计层该参考哪些源码 |
| 不提交 `.gitignore` 和输入文档 | 一并提交所有未提交文件 | `.gitignore` 和部分未跟踪输入文档不是本轮产物，避免混入无关改动 |

## 关键文件 / 产物

| 文件 | 作用 | 相关性 |
| --- | --- | --- |
| `zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md` | 面向实现使用的源码借鉴地图 | 本轮核心产物 |
| `.devflow/desktop-pet-memory-research/plans/2026-05-03-open-source-memory-reference-code-map-plan.md` | 本轮文档产出的轻量计划 | 实施门禁记录 |
| `.devflow/desktop-pet-memory-research/research-notes.md` | 已完成项目研究笔记总表 | 清单依据 |
| `zzz-prompt-debug/记忆/桌宠最终记忆系统详解.md` | 桌宠记忆系统目标设计文档 | 设计层映射依据 |
| `.devflow/desktop-pet-memory-research/NEXT-SESSION-PROMPT-desktop-pet-memory-research.md` | 下一轮恢复提示词 | 续接入口 |

## 风险 / 阻塞项 / 开放问题

- [ ] 最终研究报告尚未生成：`zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
- [ ] 若切换到 `agent-desktop-pet` 项目实现，需要重新读取该项目真实代码，不能把当前目标设计文档误当成已实现状态。
- [ ] 清单中的绝对路径依赖当前 `person-config` 工作区位置；如果移动仓库，需要重新生成路径。

## 立即下一步

1. 提交本轮相关文档改动。
2. 如继续研究交付，生成最终研究报告：`zzz-prompt-debug/记忆/开源记忆系统对比与桌宠优化建议.md`
3. 如转入 `agent-desktop-pet` 实现，先读取 `开源记忆系统可借鉴代码位置清单.md` 和目标设计文档，再按信号层（Signal Layer）到兴趣画像（Interest Profile）顺序落地。

## 恢复指引

1. 先读取 `.devflow/desktop-pet-memory-research/state.md`
2. 再读取 `.devflow/desktop-pet-memory-research/checkpoints.md`
3. 需要完整交接时读取 `.devflow/desktop-pet-memory-research/handoffs/2026-05-03-003-code-map-wrap-up.md`
4. 继续研究报告时读取 `.devflow/desktop-pet-memory-research/research-notes.md`
5. 转入实现时读取 `zzz-prompt-debug/记忆/开源记忆系统可借鉴代码位置清单.md`

## 可从活跃上下文移除的内容

- 逐个开源项目的 subagent 原始返回内容，已经汇总到 `research-notes.md`。
- 本轮关于文档结构的讨论，已经固化到代码位置清单与本 handoff。
- 绝对路径验证过程，结果是文档中 `43` 个绝对路径缺失数为 `0`。
