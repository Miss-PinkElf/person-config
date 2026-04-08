---
name: devflow
description: |
  长期开发任务主入口。适用于中大型开发、长任务推进、跨对话续接、过程记录、方案讨论、计划沉淀、bug 调试、handoff 交接。显式调用时直接使用；当任务涉及多阶段推进、需要记录决策与过程、或预计会跨多轮继续时，也应主动触发本 skill。
  一旦进入本 skill，默认把任务过程沉淀到仓库根目录 `.devflow/<mission-slug>/`，并根据任务形态选择轻量路径、重型路径、bug 路径或 resume 路径。不要把记录当成附属说明，记录本身就是主流程的一部分。
author: Codex
version: 0.1.0
date: 2026-04-09
---

# DevFlow

## 核心定位

`devflow` 是长期开发任务与中大型开发任务的主入口。

它负责：

1. 判断当前任务应该走哪条路径
2. 把记录系统建立为主线，而不是收尾附属品
3. 把阶段推进委托给 OpenSpec 子技能
4. 把质量门禁委托给 Superpowers 子技能
5. 在暂停、续接、上下文压缩时协调 handoff

一句话：

**OpenSpec 管阶段推进，Superpowers 管思考质量，DevFlow 管主线记录、路径调度与恢复。**

## 适用场景

优先用于以下场景：

- 中大型功能开发
- 预计跨多轮推进的长任务
- 需要边讨论边记录过程和决策的任务
- 需要先 plan 再 spec 再实施的任务
- 需要保留 bug 调试过程的任务
- 暂停后下次继续、或跨对话续接的任务

如果只是一次性小修且不需要留下过程记录，可以不触发本 skill。

## 工作区与真相源

工作区固定为：

```text
.devflow/<mission-slug>/
```

进入 mission 后，以工作区内文件为真相源，聊天记录只用于辅助理解。

优先信任：

- `workflow.md`
- `state.md`
- `decision-log.md`
- `plans/`
- `spec/`
- `bug-log.md`
- `checkpoints.md`
- 最新 `handoff`

默认创建：

- `workflow.md`
- `state.md`
- `decision-log.md`

按阶段懒创建：

- `plans/`
- `spec/`
- `bug-log.md`
- `learnings.md`
- `checkpoints.md`
- `checkpoints-archive.md`
- `session-tasks.md`
- `handoffs/`

## 路径分类规则

采用：**系统先判断 + 用户可覆盖**

规则如下：

1. 用户显式指定轻量、重型、bug 或 resume 路径时，优先按用户指定执行
2. 用户未指定时，先判断路径，再用一两句话说明判断理由
3. 在进入 `Plan` 或 `Apply` 前，允许用户切换路径
4. 实施中发现复杂度判断错误时，可以升级或降级路径，但必须回写记录

### 轻量路径

适用于：

- 目标足够明确
- 改动影响面有限
- 不需要完整 proposal/design/tasks 三件套

流程：

```text
Mini Align -> Light Plan -> Light Tasks -> Apply -> Verify
```

### 重型路径

适用于：

- 需求存在歧义
- 影响多个模块、页面或阶段
- 需要正式 spec 管理与阶段回退

流程：

```text
Align -> Plan -> proposal/design/tasks -> Apply -> Review/Verify
```

### bug 路径

适用于：

- 测试失败
- 异常行为
- 根因未知
- 修复尝试已开始失控

流程：

```text
Classify -> Debugging -> bug-log -> Verify -> State Update
```

### resume 路径

适用于：

- 跨对话续接
- 暂停后恢复
- 上下文恢复

流程：

```text
Read state -> Read latest handoff -> Reconfirm route -> Continue
```

## 主线流程

DevFlow 主线为：

```text
Classify -> Align -> Plan -> Propose/Tasks -> Apply -> Review/Verify -> Close
```

关键约束：

- `Align` 不能跳过，轻量任务也至少要做 Mini Align
- `Plan` 不能静默省略
- `plan != spec`
- 没有任务定义不进入 `Apply`
- 正常完成不强制 handoff
- 每轮推进后至少更新 `state.md`

重型路径固定三件套：

- `proposal.md`
- `design.md`
- `tasks.md`

轻量路径至少要求：

- 轻量 `plan`
- 轻量 `tasks`

## 阶段门禁

### 对齐门禁

- 不允许跳过 Align 直接进入 Apply
- 对齐结束后必须把结论落入 `plans/` 或轻量 plan

### 计划门禁

- 重型路径必须写入 `plans/`
- 轻量路径也必须有最小 plan 记录

### 实施门禁

- 没有任务定义不进入 `Apply`
- 如果暴露设计缺陷，停止实施并回退

### 调试门禁

- bug 必须先进 `superpowers-systematic-debugging`
- 不允许直接猜改
- 修复过程必须回写 `bug-log.md`

### 完成门禁

- 宣称完成前必须进入 `superpowers-verification-before-completion`
- 没有新鲜证据，不允许宣称完成

## 回退规则

| 当前阶段 | 触发情况 | 回退到 |
| --- | --- | --- |
| Align | 用户补充大量新约束 | 继续 Align |
| Plan | 理解目标有偏差 | Align |
| Propose | 用户推翻方案 | Align |
| Apply | 暴露设计缺陷 | Propose |
| Apply | 连续 3 次修复失败 | 先 Debugging，必要时 Propose |
| Review | 审查反馈涉及设计变更 | Propose |
| Verify | 验证失败但设计仍成立 | Apply |
| Verify | 验证失败且暴露设计问题 | Propose |
| Close | 当前阶段结束但 mission 未结束 | 保留工作区并写 checkpoint 或 handoff |

## 记录规则

始终遵循：

- 每轮推进后至少更新 `state.md`
- 做出关键选择后更新 `decision-log.md`
- 对齐与方案收敛后写 `plan`
- 遇到 bug 时写 `bug-log.md`
- 阶段切换或重要里程碑时写 `checkpoint`
- `checkpoints.md` 只保留最近 3 条，超出内容搬入 `checkpoints-archive.md`
- 暂停、跨对话、上下文过长、阶段性交接时才生成 `handoff`

## 读取地图

- 路径判断与阶段说明：`references/routing-and-stages.md`
- brainstorm 与 plan 的关系：`references/brainstorming-guide.md`
- 工作区结构与模板：`references/workspace-and-templates.md`
- 记录规则：`references/recording-rules.md`
- 质量门禁：`references/quality-gates.md`
- 示例：`references/examples/`

进入具体动作时，按需读取：

- 探索：`skills/openspec-explore/SKILL.md`
- 提案：`skills/openspec-propose/SKILL.md`
- 实施：`skills/openspec-apply-change/SKILL.md`
- 归档：`skills/openspec-archive-change/SKILL.md`
- 对齐：`skills/superpowers-brainstorming/SKILL.md`
- 调试：`skills/superpowers-systematic-debugging/SKILL.md`
- 审查：`skills/superpowers-requesting-code-review/SKILL.md`
- 接收审查：`skills/superpowers-receiving-code-review/SKILL.md`
- 验证：`skills/superpowers-verification-before-completion/SKILL.md`
- 交接：`skills/session-handoff/SKILL.md`
