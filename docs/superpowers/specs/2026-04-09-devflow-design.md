# DevFlow 设计文档

> 日期：2026-04-09
> 状态：已确认设计，待进入实现
> 语言：简体中文

## 1. 背景

现有长期任务工作流存在明显割裂：

- `context-budget-explore` 负责过程记录与上下文控制
- `spark-workflow` 负责阶段推进与子技能调度
- `session-handoff` 负责暂停与续接

这导致记录层和执行层并不在同一条主线上，具体表现为：

- `plan` 不是稳定产物，容易被跳过
- `brainstorming` 不是稳定入口门禁
- bug 修复过程和阶段记录脱节
- 任务虽有部分沉淀，但缺少统一的“事实源”和恢复入口

本设计希望引入一个新的主入口技能 `devflow`，把记录、阶段机、质量门禁、交接统一到一条开发主线上。

## 2. 目标与非目标

### 2.1 目标

`devflow` 需要实现以下目标：

- 作为长期开发任务和中大型开发任务的统一主入口
- 统一管理讨论、计划、正式产物、实施、调试、验证、归档、续接
- 把记录系统变成主流程的一部分，而不是外围附属能力
- 明确区分 `plan` 与 `spec`
- 支持轻量路径与重型路径，并允许用户覆盖路径判断
- 默认把任务过程沉淀到仓库中的 `.devflow/<mission-slug>/`

### 2.2 非目标

第一版 `devflow` 不解决以下问题：

- 不自动迁移旧 `.explore/` 工作区
- 不替换旧 `context-budget-explore`
- 不重写所有 OpenSpec 或 Superpowers 子技能
- 不引入复杂的评估、统计或自动化迁移机制

## 3. 核心定位

`devflow` 的定位是：

- 一个新的长期开发主入口 skill
- 既可被显式调用，也应适用于中大型开发任务的默认主入口
- 一旦进入 `devflow`，任务完成时默认需要留下记录沉淀

设计原则如下：

- OpenSpec 管阶段推进
- Superpowers 管质量门禁
- DevFlow 管入口判断、记录真相源、阶段调度、回写与续接

换句话说：

> OpenSpec 决定“现在处于哪个阶段、下一步需要什么产物”，Superpowers 决定“这个阶段怎么思考才不失真”，DevFlow 决定“整个任务如何被记录、调度、恢复和收尾”。

## 4. 架构方案选择

本设计在三个方案中选择以下方案作为正式方向：

### 4.1 方案一：薄主入口 + 多子技能

- `devflow` 负责分类、记录、阶段切换、入口确认、回写状态
- 具体的 Explore / Propose / Apply / Debug / Review / Verify / Handoff 继续由已有子技能承担

该方案优点：

- 最大化复用已有能力
- 主入口职责清晰
- 后续迭代成本低
- 避免把主技能做成超大单文件

### 4.2 被否决方案

方案二：厚主入口 + 子技能退化为参考  
否决原因：过于肥大，后续维护困难。

方案三：双入口并存  
否决原因：无法真正解决记录层与执行层分裂的问题。

## 5. 总流程设计

`devflow` 的主线流程定义为：

```text
Classify -> Align -> Plan -> Propose/Tasks -> Apply -> Review/Verify -> Close
```

它不是线性死流程，而是带门禁和回退能力的阶段机。

### 5.1 轻量路径

适用于目标明确、影响面有限的小型改动：

```text
Mini Align -> Light Plan -> Light Tasks -> Apply -> Verify
```

特点：

- 不强制生成三件套 spec
- 允许只生成轻量 `plan` 和轻量 `tasks`
- 仍然要求最小对齐、最小计划和验证

### 5.2 重型路径

适用于中大型开发、长期任务、方案复杂的任务：

```text
Align -> Plan -> proposal/design/tasks -> Apply -> Review/Verify
```

特点：

- 必须经过完整对齐
- 必须沉淀 `plan`
- 正式产物固定为 `proposal.md + design.md + tasks.md`

### 5.3 Bug 路径

适用于测试失败、异常行为、根因未明的修复任务：

```text
Classify -> Debugging -> bug-log -> Verify -> state update
```

特点：

- 先进入系统化调试
- 调试过程写入 `bug-log.md`
- 修复后必须验证

### 5.4 Resume 路径

适用于跨对话续接、暂停后恢复、上下文恢复：

```text
Read state -> Read latest handoff -> Reconfirm route -> Continue
```

## 6. 路径判断与用户覆盖

`devflow` 采用“系统先判断 + 用户可覆盖”的方式决定路径：

- 用户明确指定轻量或重型路径时，按用户指定执行
- 用户未指定时，由 `devflow` 根据任务复杂度做初判
- 初判后必须向用户说明路径选择及理由
- 用户可以接受、切换或重新指定路径

判断说明需要包含：

- 当前判断为轻量、重型、bug 或 resume 中的哪一类
- 形成该判断的主要理由
- 是否建议用户切换

实施过程中若发现初判错误，可以：

- 从轻量升级为重型
- 从重型降级为轻量

但升级或降级都必须写入记录，说明调整原因。

## 7. 工作区设计

`devflow` 的工作区固定为：

```text
.devflow/<mission-slug>/
├── workflow.md
├── state.md
├── decision-log.md
├── plans/
├── spec/
├── bug-log.md
├── learnings.md
├── checkpoints.md
├── checkpoints-archive.md
├── session-tasks.md
└── handoffs/
```

### 7.1 默认创建的核心文件

以下文件在 mission 初始化时默认创建：

- `workflow.md`
- `state.md`
- `decision-log.md`

### 7.2 按阶段懒创建的文件

以下文件或目录在对应阶段进入时再创建：

- `plans/`
- `spec/`
- `bug-log.md`
- `learnings.md`
- `checkpoints.md`
- `checkpoints-archive.md`
- `session-tasks.md`
- `handoffs/`

这样可以兼顾两点：

- 保持长期任务的稳定骨架
- 避免小任务一开始生成大量空文件

## 8. 记录模型与文件职责

该设计的核心原则为：

> record is the spine, artifacts are stage outputs

也就是：记录是主线，计划、正式产物、bug 日志、handoff 都是主线上不同阶段的产物。

### 8.1 `workflow.md`

记录 mission 级别的稳定信息：

- 任务目标
- 范围
- 成功标准
- 当前采用路径
- 主要里程碑

### 8.2 `state.md`

记录当前轮次的最新事实：

- 当前阶段
- 已确认事实
- 当前阻塞
- 下一步动作
- 最近一次路径判断结论

### 8.3 `decision-log.md`

只记录关键决策，不记录流水账：

- 决策项
- 备选方案
- 取舍原因
- 对后续的影响

### 8.4 `plans/`

记录讨论过程和方案收敛过程：

- 背景
- 目标
- 方案比较
- 放弃方案
- 最终选择
- 产出指向

### 8.5 `spec/`

记录正式产物：

- 重型路径固定为：
  - `proposal.md`
  - `design.md`
  - `tasks.md`
- 轻量路径不强制三件套，以轻量 `plan + tasks` 为主

### 8.6 `bug-log.md`

记录调试全过程：

- 现象
- 复现方式
- 根因分析
- 修复动作
- 验证结果

### 8.7 `checkpoints.md`

保存最近的阶段快照，作为快速恢复入口：

- 默认滚动保留最近 3 条
- 用于阶段切换、里程碑完成、准备暂停、上下文压缩前的记录

### 8.8 `checkpoints-archive.md`

保存从 `checkpoints.md` 中滚出的历史快照：

- 不主动加载
- 只在追溯长期历史时读取

### 8.9 `handoffs/`

保存交接文档，用于：

- 暂停
- 跨对话继续
- 上下文过长
- 阶段性交接

### 8.10 `learnings.md`

沉淀可复用的经验、注意事项与复盘结论。

## 9. Plan 与 Spec 的关系

`devflow` 必须明确区分 `plan` 与 `spec`：

- `plan` 记录讨论过程、候选方案、取舍与决策原因
- `spec` 记录正式结论和可执行产物

这意味着：

- 不允许用 spec 替代 plan 的过程记录
- 重型任务中，spec 应引用对应的 plan 来源
- 轻量任务即使不生成三件套，也至少需要轻量 plan

## 10. 子技能调度设计

`devflow` 本身不重写已有核心子技能，而是直接调度它们。

### 10.1 Explore 类

纯讨论、需求梳理、方案比较时：

- 调用 `openspec-explore`
- 同步更新 `plans/` 与必要的 `decision-log.md`

### 10.2 Propose 类

重型任务进入正式产物阶段时：

- 调用 `openspec-propose`
- 产出 `proposal.md`、`design.md`、`tasks.md`

### 10.3 Apply 类

实施时：

- 调用 `openspec-apply-change`
- 按任务推进并持续回写状态

### 10.4 Archive 类

正式收尾与归档时：

- 调用 `openspec-archive-change`

### 10.5 Brainstorming 与对齐

对齐阶段：

- 使用 `superpowers-brainstorming`
- 补充 DevFlow 自身的 plan 与路径记录要求

### 10.6 Debugging

遇到 bug、失败或异常时：

- 调用 `superpowers-systematic-debugging`
- 强制先找根因再修复

### 10.7 Review

实现完成后：

- 调用 `superpowers-requesting-code-review`
- 然后调用 `superpowers-receiving-code-review`

### 10.8 Verify

完成声明前：

- 调用 `superpowers-verification-before-completion`

### 10.9 Handoff

暂停或跨对话续接时：

- 调用 `session-handoff`

## 11. 阶段门禁

### 11.1 Align 不能跳过

- 重型路径必须完整对齐
- 轻量路径也必须至少做一次 Mini Align

### 11.2 Plan 不能静默省略

- 重型路径必须写入 `plans/`
- 轻量路径也至少需要轻量 plan

### 11.3 没有任务定义不进入 Apply

- 重型路径依赖 `spec/tasks.md`
- 轻量路径依赖轻量任务列表

### 11.4 Bug 不允许直接猜改

- 必须先进入系统化调试
- 必须记录到 `bug-log.md`

### 11.5 没有验证证据不允许宣称完成

- 必须执行验证
- 必须以新鲜证据支撑完成结论

### 11.6 暂停前必须整理状态

- 至少更新 `state.md`
- 必要时写 `checkpoint` 或 `handoff`

## 12. 回退规则

| 当前阶段 | 触发情况 | 回退到 |
| --- | --- | --- |
| Align | 用户补充大量新约束 | 继续 Align |
| Plan | 发现目标理解有偏差 | Align |
| Propose | 用户推翻方案 | Align |
| Apply | 暴露设计缺陷 | Propose |
| Apply | 连续 3 次修复失败 | 先 Debugging，必要时 Propose |
| Review | 反馈涉及设计变更 | Propose |
| Verify | 验证失败但设计仍成立 | Apply |
| Verify | 验证失败且暴露设计问题 | Propose |
| Close | 当前阶段结束但 mission 未结束 | 保持工作区并写 checkpoint/handoff |

## 13. Checkpoint 与 Handoff 的分工

两者都保留，但职责不同：

- `checkpoint`
  - 面向当前 mission 的阶段快照
  - 用于快速恢复最近进展
- `handoff`
  - 面向下一个会话或下一个 agent 的正式交接
  - 用于跨对话、暂停、上下文控制

因此：

- 正常完成任务时，不默认生成 handoff
- 暂停、跨对话、上下文过长、阶段性交接时，才生成 handoff
- `checkpoints.md` 始终是本 mission 的快照滚动窗口

## 14. 目录结构设计

第一版 `devflow` 目录建议如下：

```text
.codex/skills/devflow/
├── SKILL.md
├── references/
│   ├── brainstorming-guide.md
│   ├── routing-and-stages.md
│   ├── workspace-and-templates.md
│   ├── recording-rules.md
│   ├── quality-gates.md
│   └── examples/
│       ├── light-task.md
│       ├── heavy-task.md
│       ├── bug-task.md
│       └── resume-task.md
├── assets/
│   └── templates/
│       ├── workflow-template.md
│       ├── state-template.md
│       ├── decision-log-template.md
│       ├── plan-template.md
│       ├── light-tasks-template.md
│       ├── bug-log-template.md
│       ├── checkpoint-template.md
│       └── handoff-template.md
└── skills/
    ├── openspec-explore/
    ├── openspec-propose/
    ├── openspec-apply-change/
    ├── openspec-archive-change/
    ├── superpowers-brainstorming/
    ├── superpowers-systematic-debugging/
    ├── superpowers-test-driven-development/
    ├── superpowers-requesting-code-review/
    ├── superpowers-receiving-code-review/
    ├── superpowers-verification-before-completion/
    ├── superpowers-dispatching-parallel-agents/
    ├── superpowers-subagent-driven-development/
    └── session-handoff/
```

其中：

- `SKILL.md` 负责主入口规则和阅读地图
- `references/` 放详细规则，避免主文件过胖
- `assets/templates/` 放记录与产物模板
- `skills/` 复用现有子技能

## 15. 第一版实现范围

第一版必须实现：

- 新的 `devflow` 主入口 skill
- `.devflow/<mission-slug>/` 工作区规则
- 核心文件默认创建、阶段文件懒创建
- 轻量 / 重型 / bug / resume 四类路径
- `checkpoint` 与 `handoff` 分工
- `plan != spec` 的硬规则
- 结束后默认沉淀记录
- 对现有 OpenSpec / Superpowers / session-handoff 的调度

第一版暂不实现：

- 自动迁移旧 `.explore/`
- 旧 skill 的兼容壳与自动转发
- 复杂统计与指标系统
- description 优化评测闭环

## 16. 风险与注意事项

### 16.1 风险一：主入口过重

如果把太多细节堆进 `SKILL.md`，`devflow` 会重新变成巨型 skill。

控制方式：

- 主文件只保留规则与阅读地图
- 细则放入 `references/`

### 16.2 风险二：轻量路径被重型化

如果轻量任务也强行要求完整三件套，使用成本会过高。

控制方式：

- 轻量路径只要求最小计划与最小任务定义

### 16.3 风险三：记录规则失效

如果记录只是“建议”，很快会再次退化成可选项。

控制方式：

- 把回写 `state`、写 `plan`、写 `bug-log`、写 `checkpoint/handoff` 设为阶段规则，而非软提示

## 17. 结论

`devflow` 第一版采用“薄主入口 + 多子技能”的方案，以 `.devflow/<mission-slug>/` 作为统一工作区，把记录系统变为开发主线，并通过轻量/重型/bug/resume 路由把 OpenSpec、Superpowers、session-handoff 串成一个统一的长期任务工作流。

该设计已经明确：

- 统一主入口
- 统一记录骨架
- 统一阶段机与回退规则
- 明确 plan/spec 边界
- 明确 checkpoint/handoff 分工
- 明确第一版实现范围

在此基础上，可以进入 `devflow` skill 的实际创建阶段。
