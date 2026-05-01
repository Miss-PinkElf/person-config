# Design

## 总体思路

本次设计采用“主文档收口、references 承担细则”的结构，不通过扩展更多子 skill 或评测（Evaluation）资产来解决问题，而是在现有 `devflow` 技能（DevFlow skill）内部重新整理职责边界。

核心思路如下：

1. `SKILL.md` 只承载主入口定位、触发规则、路径主线与摘要级门禁
2. references 负责承载阶段前置检查、记录规则、模板与最小示例
3. 所有新增约束都尽量写成“进入下一阶段前要检查什么”，而不是“应该注意什么”
4. 对已有 mission 的续作、恢复、小改动场景，统一通过自动关联（Mission Auto-Attach）与隐式触发（Implicit Trigger）做顶层收口

## 结构与边界

### 1. `SKILL.md`

职责：

- 定义什么时候触发 `devflow`
- 定义当前任务属于哪条路径
- 定义主线阶段与不可跳过的门禁
- 对关键约束给出摘要说明

本轮在该文件中重点补以下内容：

1. description 从“显式触发词主导”升级为“显式触发 + 上下文触发”
2. 增加已有 mission 自动关联（Mission Auto-Attach）摘要
3. 增加阶段切换前要执行检查的摘要
4. 对计划（Plan）与规格（Spec）的职责差异给出高层解释

约束：

- 不把长模板和详细检查清单堆回 `SKILL.md`
- 不把子 skill 的职责写回主 skill

### 2. `references/routing-and-stages.md`

职责：

- 说明路径分类（Route Classification）
- 说明阶段流转（Stage Flow）
- 说明阶段前置检查（Preflight Checks）
- 说明路径升级 / 降级后的回写要求

本轮重点补以下内容：

1. `Plan -> Propose / Tasks -> Apply` 的显式检查链
2. 重型路径（Heavy Route）进入 Apply 前必须具备 `proposal.md`、`design.md`、`tasks.md`
3. 轻量路径（Light Route）进入 Apply 前至少具备最小 plan 与最小 tasks
4. mission 自动关联后如何沿用当前 mission，而不是回退成普通即时任务

### 3. `references/recording-rules.md`

职责：

- 说明 `state.md`、`decision-log.md`、`checkpoint`、`handoff` 的用途
- 说明每轮推进后最少要更新什么
- 说明恢复时应优先读取什么

本轮重点补以下内容：

1. checkpoint 触发矩阵（Trigger Matrix）
2. checkpoint 与 handoff 的职责边界
3. 恢复时强调 checkpoint 优先于 handoff 的读取顺序

### 4. `references/workspace-and-templates.md`

职责：

- 说明工作区（Workspace）结构
- 提供最小模板（Minimum Templates）
- 说明 Mission Init 在已有 mission 上如何执行

本轮重点补以下内容：

1. 轻量计划最小模板（Light Plan Minimum Template）
2. mission 已存在时只刷新骨架、不重建历史的说明
3. 必要的最小检查示例

## 数据流与接口

本次不是运行时代码改造，没有新的程序接口（API）或数据结构（Data Model）。这里的数据流主要指工作流（workflow）上下文如何在文档之间传递：

1. `SKILL.md` 决定是否触发 `devflow`
2. `routing-and-stages.md` 决定当前是否具备进入下一阶段的条件
3. `recording-rules.md` 决定过程记录如何落盘
4. `workspace-and-templates.md` 决定最小模板如何写
5. `.devflow/<mission>/` 保存本轮真实推进状态

因此，本轮设计的关键不是新增文件数量，而是让四份正式 skill 文档的职责不冲突、表述不打架。

## 复用点

1. 继续复用现有 `devflow` 的主线结构，不重新设计阶段模型
2. 继续复用已有 references 文件，而不是新开平行说明文档
3. 继续复用当前 mission 工作区作为真相源（Source of Truth）
4. 继续复用当前 mission 下的 `spec/` 作为重型路径的 artifact 位置

## 风险与权衡

### 风险 1：主文档过轻

如果 `SKILL.md` 只写原则，不写摘要门禁，用户或 agent 在只看主文档时仍可能漏掉新规则。

权衡：

- 保留“摘要级门禁”，但把长检查链放到 references

### 风险 2：references 过重

如果把太多背景解释都塞进 references，会重新造成理解成本上升。

权衡：

- references 只承载“怎么做”的细则，不重复大段背景

### 风险 3：只改顶层不改子 skill

本轮不修改 `superpowers-brainstorming`、`superpowers-writing-plans` 等子 skill，意味着约束力主要依赖 `devflow` 主 skill 的入口控制与阶段门禁。

权衡：

- 先修正顶层调度逻辑，观察真实使用效果
- 若后续仍发现子 skill 内部存在稳定偏差，再开下一轮定向优化
