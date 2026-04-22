# DevFlow Skill 缺陷分析与改进建议

## 背景

在 `extreme-attribution-upgrade` 这个重型 mission 的实际使用过程中，暴露了 devflow skill 的多个执行层面问题。本文档基于真实踩坑经验，总结缺陷并给出改进建议。

---

## 缺陷一：硬门禁只是文字声明，缺乏执行锚点

### 现象

SKILL.md 第 30-49 行写了 6 条"不可跳过的铁律"，但这些规则在实际对话中被轻易跳过。例如本 mission 从 Plan 直接跳到 Apply，跳过了 Propose 阶段，AI 没有任何阻拦或提醒。

### 根因

门禁规则是写给 AI 看的"建议"，不是可执行的"检查步骤"。AI 在处理用户的具体编码请求时，会被"快速完成任务"的惯性覆盖。

### 改进建议

在 Apply 阶段入口增加可执行的检查步骤：

```markdown
## Apply 入口检查（必须在写任何代码前执行）

1. 检查 `spec/` 目录是否存在 proposal.md、design.md、tasks.md
2. 检查 `plans/` 目录下是否存在与当前任务对应的 plan 文件
3. 如果缺失，必须先创建再继续
4. 将检查结果输出给用户确认
```

---

## 缺陷二：缺乏"小任务也要 plan"的明确判断标准

### 现象

版本下拉框 optionRender 改动只涉及 2 个文件，AI 判断"改动太小不需要 plan"直接跳过了 plan 落盘。

### 根因

轻量路径要求"至少有最小 plan 记录"，但没有定义什么算"最小"。AI 有了"太小可以跳过"的判断空间。

### 改进建议

定义轻量 plan 的最小模板（3-5 行即可），消除跳过的借口：

```markdown
## 轻量 Plan 最小模板

# [任务名称]
- 改动文件：xxx/index.tsx, xxx/index.less
- 方案：一句话描述
- 状态：待实施 / 已完成
```

并明确规则：**只要 mission 已存在，任何相关改动都必须先写 plan 再动手，不分大小。**

---

## 缺陷三：已有 mission 不自动关联

### 现象

对话恢复了 `extreme-attribution-upgrade` 的上下文（读取了 handoff/state/NEXT-SESSION-PROMPT），但后续的代码改动请求没有自动纳入 devflow 流程。用户说"好的"让 AI 改代码，AI 就直接改了，完全没触发 devflow。

### 根因

devflow 的触发依赖用户主动说出关键词（"devflow""先梳理""先写 plan"等）。如果用户直接说"改这个"，skill 不会被触发。

### 改进建议

在 description 中增加自动关联规则：

```markdown
description: |
  ...（现有描述）
  
  额外触发条件：
  - 当工作目录下已存在 `.devflow/<mission>/` 且当前对话已读取该 mission 的 
    handoff/state/NEXT-SESSION-PROMPT 文件时，后续所有与该 mission 相关的
    改动自动纳入 devflow 流程
  - 当对话上下文中包含对某个 mission 工作区文件的读取记录时，视为该 mission 
    已激活，后续相关改动必须走 devflow 流程
```

---

## 缺陷四：重型路径的 Propose 阶段容易被跳过

### 现象

本 mission 在 2026-04-14 判定为重型路径后，从 Plan 直接跳到 Apply。整个过程没有创建 `spec/` 目录和三件套（proposal/design/tasks），直到 2026-04-21 才补齐。

### 根因

1. Plan 阶段产出了详细的 `extreme-attribution-upgrade-plan.md`，内容已经包含了任务拆解，AI（和用户）都认为"够用了"
2. devflow 没有明确说"plan 和 spec 的区别是什么"，只说了 `plan != spec`
3. 没有在阶段切换时强制检查 spec 三件套是否存在

### 改进建议

1. 明确 plan 和 spec 的区别：

```markdown
## plan 与 spec 的区别

- plan：方向性文档，回答"做什么、怎么分阶段、什么顺序"
- spec 三件套：
  - proposal.md：回答"为什么这样做、备选方案对比、风险约束"
  - design.md：回答"技术上怎么实现、组件结构、数据模型、接口设计"
  - tasks.md：回答"具体有哪些任务、状态追踪、依赖关系"

plan 是讨论的产物，spec 是实施的依据。plan 可以模糊，spec 必须明确。
```

2. 在 Plan → Apply 的阶段切换处增加检查：

```markdown
从 Plan 进入 Apply 前，必须确认：
- [ ] spec/proposal.md 存在且包含方案概述和备选对比
- [ ] spec/design.md 存在且包含组件结构和数据模型
- [ ] spec/tasks.md 存在且包含可追踪的任务清单
```

---

## 缺陷五：checkpoint 机制未被主动执行

### 现象

本 mission 经历了 12 次 handoff，但直到补齐时才创建了 `checkpoints.md`。过程中多次发生阶段切换和里程碑达成，但没有任何 checkpoint 记录。

### 根因

1. handoff 和 checkpoint 的职责边界模糊——AI 把 handoff 当成了 checkpoint 的替代品
2. devflow 规则说"重要阶段切换都要写 checkpoint"，但没说"什么算重要"

### 改进建议

明确 checkpoint 的触发时机：

```markdown
## 必须写 checkpoint 的时机

1. 一个阶段（阶段一/二/三/四/五）完成时
2. 发现并修复了重要 bug 时
3. 做出了影响后续实施方向的决策时
4. 暂停工作前（与 handoff 配合）

checkpoint 是里程碑快照，handoff 是跨对话交接。
checkpoint 回答"做到哪了"，handoff 回答"下次怎么接"。
```

---

## 缺陷六：description 触发词覆盖不全

### 现象

description 中的触发词集中在"先梳理""先讨论""先写 plan""保存进度""继续上次"等显式意图表达上。但实际场景中，用户经常直接说"改一下这个""加个功能"，不会主动提及 devflow。

### 改进建议

增加基于上下文的隐式触发：

```markdown
隐式触发条件：
- 当前对话已读取了 .devflow/ 目录下的任何文件
- 用户的请求涉及一个已有 mission 正在追踪的功能模块
- 上一轮对话的 NEXT-SESSION-PROMPT 已被读取
```

---

## 总结：问题优先级

| 优先级 | 缺陷 | 影响 |
|--------|------|------|
| P0 | 已有 mission 不自动关联 | 导致后续改动完全脱离 devflow 管控 |
| P0 | 门禁无执行锚点 | 门禁形同虚设 |
| P1 | 小任务跳过 plan | 流程断裂，无法追溯 |
| P1 | Propose 阶段容易跳过 | spec 三件套缺失，需事后补齐 |
| P2 | checkpoint 未主动执行 | 里程碑记录缺失 |
| P2 | 触发词覆盖不全 | 隐式场景无法触发 |