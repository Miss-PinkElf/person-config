# DevFlow Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建第一版 `devflow` 主入口 skill，把长期任务记录、阶段机、质量门禁和交接统一到 `.codex/skills/devflow/` 与 `.devflow/<mission-slug>/` 规则下。

**Architecture:** 采用“薄主入口 + 多子技能”方案。`devflow/SKILL.md` 只承担入口判断、阶段路由、记录规则和阅读地图；具体的 Explore / Propose / Apply / Archive / Debug / Review / Verify / Handoff 继续复用现有 OpenSpec、Superpowers 与 session-handoff 子技能。实现时优先复用当前仓库内 `context-budget-explore` 已经沉淀过的子目录，再在 `devflow` 中改写主规则和新增记录模板。

**Tech Stack:** Markdown skills, repository-local templates, PowerShell file operations, git

---

## 文件结构锁定

本计划实现后应产生或修改以下文件结构。

### 新建目录

- Create: `.codex/skills/devflow/`
- Create: `.codex/skills/devflow/references/`
- Create: `.codex/skills/devflow/references/examples/`
- Create: `.codex/skills/devflow/assets/templates/`
- Create: `.codex/skills/devflow/skills/`

### 新建主文件与参考文件

- Create: `.codex/skills/devflow/SKILL.md`
- Create: `.codex/skills/devflow/references/brainstorming-guide.md`
- Create: `.codex/skills/devflow/references/routing-and-stages.md`
- Create: `.codex/skills/devflow/references/workspace-and-templates.md`
- Create: `.codex/skills/devflow/references/recording-rules.md`
- Create: `.codex/skills/devflow/references/quality-gates.md`
- Create: `.codex/skills/devflow/references/examples/light-task.md`
- Create: `.codex/skills/devflow/references/examples/heavy-task.md`
- Create: `.codex/skills/devflow/references/examples/bug-task.md`
- Create: `.codex/skills/devflow/references/examples/resume-task.md`

### 新建模板文件

- Create: `.codex/skills/devflow/assets/templates/workflow-template.md`
- Create: `.codex/skills/devflow/assets/templates/state-template.md`
- Create: `.codex/skills/devflow/assets/templates/decision-log-template.md`
- Create: `.codex/skills/devflow/assets/templates/plan-template.md`
- Create: `.codex/skills/devflow/assets/templates/light-tasks-template.md`
- Create: `.codex/skills/devflow/assets/templates/bug-log-template.md`
- Create: `.codex/skills/devflow/assets/templates/checkpoint-template.md`
- Create: `.codex/skills/devflow/assets/templates/handoff-template.md`

### 复制或同步的子技能目录

- Create: `.codex/skills/devflow/skills/openspec-explore/`
- Create: `.codex/skills/devflow/skills/openspec-propose/`
- Create: `.codex/skills/devflow/skills/openspec-apply-change/`
- Create: `.codex/skills/devflow/skills/openspec-archive-change/`
- Create: `.codex/skills/devflow/skills/superpowers-brainstorming/`
- Create: `.codex/skills/devflow/skills/superpowers-systematic-debugging/`
- Create: `.codex/skills/devflow/skills/superpowers-test-driven-development/`
- Create: `.codex/skills/devflow/skills/superpowers-requesting-code-review/`
- Create: `.codex/skills/devflow/skills/superpowers-receiving-code-review/`
- Create: `.codex/skills/devflow/skills/superpowers-verification-before-completion/`
- Create: `.codex/skills/devflow/skills/superpowers-dispatching-parallel-agents/`
- Create: `.codex/skills/devflow/skills/superpowers-subagent-driven-development/`
- Create: `.codex/skills/devflow/skills/session-handoff/`

### 已有文档

- Reference: `docs/superpowers/specs/2026-04-09-devflow-design.md`

---

## Chunk 1: 搭建目录骨架并复用现有子技能

### Task 1: 创建 `devflow` 根目录与基础子目录

**Files:**
- Create: `.codex/skills/devflow/`
- Create: `.codex/skills/devflow/references/`
- Create: `.codex/skills/devflow/references/examples/`
- Create: `.codex/skills/devflow/assets/templates/`
- Create: `.codex/skills/devflow/skills/`

- [ ] **Step 1: 创建目录骨架**

Run:

```powershell
New-Item -ItemType Directory -Force '.codex\skills\devflow' | Out-Null
New-Item -ItemType Directory -Force '.codex\skills\devflow\references' | Out-Null
New-Item -ItemType Directory -Force '.codex\skills\devflow\references\examples' | Out-Null
New-Item -ItemType Directory -Force '.codex\skills\devflow\assets\templates' | Out-Null
New-Item -ItemType Directory -Force '.codex\skills\devflow\skills' | Out-Null
```

Expected: 所有目录创建成功，无错误输出。

- [ ] **Step 2: 检查目录是否已存在**

Run:

```powershell
Get-ChildItem '.codex\skills\devflow' -Force
```

Expected: 输出 `assets`、`references`、`skills` 三个目录。

### Task 2: 从当前仓库复用 OpenSpec 与 Superpowers 子技能

**Files:**
- Create: `.codex/skills/devflow/skills/openspec-explore/`
- Create: `.codex/skills/devflow/skills/openspec-propose/`
- Create: `.codex/skills/devflow/skills/openspec-apply-change/`
- Create: `.codex/skills/devflow/skills/openspec-archive-change/`
- Create: `.codex/skills/devflow/skills/superpowers-brainstorming/`
- Create: `.codex/skills/devflow/skills/superpowers-systematic-debugging/`
- Create: `.codex/skills/devflow/skills/superpowers-test-driven-development/`
- Create: `.codex/skills/devflow/skills/superpowers-requesting-code-review/`
- Create: `.codex/skills/devflow/skills/superpowers-receiving-code-review/`
- Create: `.codex/skills/devflow/skills/superpowers-verification-before-completion/`
- Create: `.codex/skills/devflow/skills/superpowers-dispatching-parallel-agents/`
- Create: `.codex/skills/devflow/skills/superpowers-subagent-driven-development/`

- [ ] **Step 1: 复制 OpenSpec 子技能目录**

Run:

```powershell
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\openspec-explore' '.codex\skills\devflow\skills\openspec-explore'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\openspec-propose' '.codex\skills\devflow\skills\openspec-propose'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\openspec-apply-change' '.codex\skills\devflow\skills\openspec-apply-change'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\openspec-archive-change' '.codex\skills\devflow\skills\openspec-archive-change'
```

Expected: 四个 `openspec-*` 子目录都出现在 `.codex\skills\devflow\skills\` 下。

- [ ] **Step 2: 复制 Superpowers 子技能目录**

Run:

```powershell
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-brainstorming' '.codex\skills\devflow\skills\superpowers-brainstorming'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-systematic-debugging' '.codex\skills\devflow\skills\superpowers-systematic-debugging'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-test-driven-development' '.codex\skills\devflow\skills\superpowers-test-driven-development'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-requesting-code-review' '.codex\skills\devflow\skills\superpowers-requesting-code-review'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-receiving-code-review' '.codex\skills\devflow\skills\superpowers-receiving-code-review'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-verification-before-completion' '.codex\skills\devflow\skills\superpowers-verification-before-completion'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-dispatching-parallel-agents' '.codex\skills\devflow\skills\superpowers-dispatching-parallel-agents'
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\spark-workflow\skills\superpowers-subagent-driven-development' '.codex\skills\devflow\skills\superpowers-subagent-driven-development'
```

Expected: 八个 `superpowers-*` 子目录全部复制成功。

- [ ] **Step 3: 校验复制结果**

Run:

```powershell
Get-ChildItem '.codex\skills\devflow\skills' | Select-Object -ExpandProperty Name
```

Expected:

```text
openspec-apply-change
openspec-archive-change
openspec-explore
openspec-propose
superpowers-brainstorming
superpowers-dispatching-parallel-agents
superpowers-receiving-code-review
superpowers-requesting-code-review
superpowers-subagent-driven-development
superpowers-systematic-debugging
superpowers-test-driven-development
superpowers-verification-before-completion
```

### Task 3: 复制 `session-handoff` 子技能目录

**Files:**
- Create: `.codex/skills/devflow/skills/session-handoff/`

- [ ] **Step 1: 复制 `session-handoff`**

Run:

```powershell
Copy-Item -Recurse -Force '.codex\skills\context-budget-explore\skills\session-handoff' '.codex\skills\devflow\skills\session-handoff'
```

Expected: `.codex\skills\devflow\skills\session-handoff\SKILL.md` 存在。

- [ ] **Step 2: 检查 handoff 目录内容**

Run:

```powershell
Get-ChildItem '.codex\skills\devflow\skills\session-handoff' -Recurse | Select-Object -ExpandProperty FullName
```

Expected: 至少包含 `SKILL.md`、`assets\templates\handoff-template.md`、`references\resume-checklist.md`。

- [ ] **Step 3: 提交目录骨架与子技能复制**

Run:

```powershell
git add -- '.codex/skills/devflow'
git commit -m "feat: scaffold devflow skill workspace"
```

Expected: 生成一个只包含 `devflow` 目录骨架和复制子技能的提交。

## Chunk 2: 编写主入口规则与参考文档

### Task 4: 编写 `devflow/SKILL.md`

**Files:**
- Create: `.codex/skills/devflow/SKILL.md`
- Reference: `docs/superpowers/specs/2026-04-09-devflow-design.md`
- Reference: `.codex/skills/context-budget-explore/SKILL.md`
- Reference: `.codex/skills/context-budget-explore/skills/spark-workflow/SKILL.md`

- [ ] **Step 1: 写出 frontmatter**

```yaml
---
name: devflow
description: |
  长期开发任务主入口。适用于中大型开发、长任务推进、跨对话续接、过程记录、方案讨论、计划沉淀、bug 调试、handoff 交接。显式调用时直接使用；当任务涉及多阶段推进、需要记录决策与过程、或预计会跨多轮继续时，也应主动触发本 skill。
  一旦进入本 skill，默认把任务过程沉淀到仓库根目录 `.devflow/<mission-slug>/`，并根据任务形态选择轻量路径、重型路径、bug 路径或 resume 路径。不要把记录当成附属说明，记录本身就是主流程的一部分。
author: Codex
version: 0.1.0
date: 2026-04-09
---
```

- [ ] **Step 2: 写出主规则章节**

`SKILL.md` 需要包含以下章节，顺序保持一致：

```markdown
# DevFlow

## 核心定位

## 适用场景

## 工作区与真相源

## 路径分类规则

## 主线流程

## 阶段门禁

## 回退规则

## 记录规则

## 读取地图
```

- [ ] **Step 3: 把以下关键规则写进正文**

```markdown
- `devflow` 是长期开发与中大型开发任务的主入口
- 工作区固定为 `.devflow/<mission-slug>/`
- 默认创建 `workflow.md`、`state.md`、`decision-log.md`
- `plans/`、`spec/`、`bug-log.md`、`checkpoints.md`、`checkpoints-archive.md`、`handoffs/` 按阶段懒创建
- 路径采用“系统先判断 + 用户可覆盖”
- 重型路径固定三件套：`proposal.md`、`design.md`、`tasks.md`
- 轻量路径至少要求轻量 `plan` 与轻量 `tasks`
- `plan != spec`
- 正常完成不强制 handoff；暂停、跨对话、上下文过长、阶段性交接时才生成 handoff
- 每轮推进后至少更新 `state.md`
```

- [ ] **Step 4: 添加阅读地图**

```markdown
## 读取地图

- 路径判断与阶段说明：`references/routing-and-stages.md`
- brainstorm 与 plan 关系：`references/brainstorming-guide.md`
- 工作区结构与模板：`references/workspace-and-templates.md`
- 记录规则：`references/recording-rules.md`
- 质量门禁：`references/quality-gates.md`
- 示例：`references/examples/`
- 子技能：`skills/`
```

- [ ] **Step 5: 检查关键字符串**

Run:

```powershell
rg -n "plan != spec|\.devflow/<mission-slug>|系统先判断 \+ 用户可覆盖|正常完成不强制 handoff" '.codex\skills\devflow\SKILL.md'
```

Expected: 四条关键规则都能被搜索到。

### Task 5: 编写 `references/brainstorming-guide.md`

**Files:**
- Create: `.codex/skills/devflow/references/brainstorming-guide.md`
- Reference: `.codex/skills/context-budget-explore/skills/spark-workflow/references/brainstorming-guide.md`
- Reference: `docs/superpowers/specs/2026-04-09-devflow-design.md`

- [ ] **Step 1: 以旧 guide 为骨架，改写为 DevFlow 语境**

文档必须覆盖：

```markdown
- 什么时候必须先对齐
- 轻量路径和重型路径下对齐深度的区别
- 对齐结束后如何沉淀到 `plans/`
- brainstorm 与 `spec` 的关系
- 用户可覆盖路径时，如何用一句话解释判断理由
```

- [ ] **Step 2: 加入禁令**

```markdown
- 不允许跳过 Align 直接进入 Apply
- 不允许把 brainstorm 结果只留在对话中而不落盘
```

- [ ] **Step 3: 校验是否覆盖关键词**

Run:

```powershell
rg -n "轻量路径|重型路径|plans/|spec|判断理由" '.codex\skills\devflow\references\brainstorming-guide.md'
```

Expected: 五个关键词均出现。

### Task 6: 编写其余规则参考文件

**Files:**
- Create: `.codex/skills/devflow/references/routing-and-stages.md`
- Create: `.codex/skills/devflow/references/workspace-and-templates.md`
- Create: `.codex/skills/devflow/references/recording-rules.md`
- Create: `.codex/skills/devflow/references/quality-gates.md`

- [ ] **Step 1: 写 `routing-and-stages.md`**

该文件必须写清：

```markdown
- 轻量 / 重型 / bug / resume 四类路径
- 每类路径的进入信号
- 每类路径的阶段流转
- 何时升级或降级路径
- 回退矩阵
```

- [ ] **Step 2: 写 `workspace-and-templates.md`**

该文件必须写清：

```markdown
- `.devflow/<mission-slug>/` 的目录结构
- 默认创建与懒创建策略
- 每个模板文件在什么阶段使用
- checkpoint 的滚动保留与归档规则
```

- [ ] **Step 3: 写 `recording-rules.md`**

该文件必须写清：

```markdown
- 每轮推进后至少更新 `state.md`
- 何时写 `decision-log.md`
- 何时写 `plan`
- 何时写 `bug-log.md`
- 何时写 `checkpoint`
- 何时写 `handoff`
```

- [ ] **Step 4: 写 `quality-gates.md`**

该文件必须写清：

```markdown
- 对齐门禁
- 计划门禁
- Apply 前必须具备任务定义
- Bug 必须先进 systematic-debugging
- 完成前必须进 verification-before-completion
```

- [ ] **Step 5: 提交主规则与参考文档**

Run:

```powershell
git add -- '.codex/skills/devflow/SKILL.md' '.codex/skills/devflow/references'
git commit -m "feat: define devflow routing and recording rules"
```

Expected: 生成一个只包含主入口与参考文档的提交。

## Chunk 3: 编写模板与示例

### Task 7: 编写记录模板

**Files:**
- Create: `.codex/skills/devflow/assets/templates/workflow-template.md`
- Create: `.codex/skills/devflow/assets/templates/state-template.md`
- Create: `.codex/skills/devflow/assets/templates/decision-log-template.md`
- Create: `.codex/skills/devflow/assets/templates/plan-template.md`
- Create: `.codex/skills/devflow/assets/templates/light-tasks-template.md`
- Create: `.codex/skills/devflow/assets/templates/bug-log-template.md`
- Create: `.codex/skills/devflow/assets/templates/checkpoint-template.md`
- Create: `.codex/skills/devflow/assets/templates/handoff-template.md`

- [ ] **Step 1: 写 `workflow-template.md`**

模板内容至少包含：

```markdown
# Mission Workflow

## 目标

## 范围

## 成功标准

## 当前路径

## 主要里程碑
```

- [ ] **Step 2: 写 `state-template.md`**

模板内容至少包含：

```markdown
# Mission State

## 当前阶段

## 已确认事实

## 当前阻塞

## 下一步

## 最近一次路径判断
```

- [ ] **Step 3: 写 `decision-log-template.md` 与 `plan-template.md`**

`decision-log-template.md` 至少包含：

```markdown
# Decision Log

## 最新决策

| 时间 | 决策 | 备选方案 | 原因 | 影响 |
| --- | --- | --- | --- | --- |
```

`plan-template.md` 至少包含：

```markdown
# Plan

## 背景

## 目标

## 方案比较

## 放弃方案

## 最终选择

## 产出指向
```

- [ ] **Step 4: 写 `light-tasks-template.md` 与 `bug-log-template.md`**

`light-tasks-template.md` 至少包含：

```markdown
# Light Tasks

- [ ] 任务 1
- [ ] 任务 2

## 验证
```

`bug-log-template.md` 至少包含：

```markdown
# Bug Log

## 现象

## 复现方式

## 根因分析

## 修复动作

## 验证结果
```

- [ ] **Step 5: 写 `checkpoint-template.md` 与 `handoff-template.md`**

`checkpoint-template.md` 至少包含：

```markdown
## Checkpoint

- 时间：
- 当前阶段：
- 已完成：
- 风险：
- 下一步：
- 相关文件：
```

`handoff-template.md` 至少包含：

```markdown
# Handoff

## 当前状态

## 已完成内容

## 未完成内容

## 风险与注意事项

## 下一步建议
```

- [ ] **Step 6: 校验模板关键词**

Run:

```powershell
rg -n "^#|^##|^- 时间：|^- 当前阶段：" '.codex\skills\devflow\assets\templates'
```

Expected: 所有模板文件都含有明确标题与必要字段。

### Task 8: 编写示例文档

**Files:**
- Create: `.codex/skills/devflow/references/examples/light-task.md`
- Create: `.codex/skills/devflow/references/examples/heavy-task.md`
- Create: `.codex/skills/devflow/references/examples/bug-task.md`
- Create: `.codex/skills/devflow/references/examples/resume-task.md`

- [ ] **Step 1: 写 `light-task.md`**

示例需要展示：

```markdown
- 一个小型明确改动
- 如何做 Mini Align
- 如何写轻量 plan
- 如何使用 light tasks
- 如何验证并更新 state
```

- [ ] **Step 2: 写 `heavy-task.md`**

示例需要展示：

```markdown
- 一个中大型开发任务
- 如何选择重型路径
- 如何从 plan 进入 proposal/design/tasks
- 如何在 Apply 后进入 review/verify
```

- [ ] **Step 3: 写 `bug-task.md` 与 `resume-task.md`**

`bug-task.md` 需要展示：

```markdown
- bug 路径如何先进入 debugging
- 如何写 bug-log
- 如何回写 state
```

`resume-task.md` 需要展示：

```markdown
- 如何读取 state 与最新 handoff
- 如何重新判断当前路径
- 如何决定继续还是回退阶段
```

- [ ] **Step 4: 提交模板与示例**

Run:

```powershell
git add -- '.codex/skills/devflow/assets/templates' '.codex/skills/devflow/references/examples'
git commit -m "feat: add devflow templates and examples"
```

Expected: 生成一个只包含模板与示例的提交。

## Chunk 4: 自检、校验与收尾

### Task 9: 校验路径引用和关键规则是否一致

**Files:**
- Modify: `.codex/skills/devflow/SKILL.md`
- Modify: `.codex/skills/devflow/references/*.md`

- [ ] **Step 1: 检查所有内部路径引用**

Run:

```powershell
rg -n "\.devflow/|references/|assets/templates|skills/" '.codex\skills\devflow'
```

Expected: 所有引用都指向 `devflow` 自己的目录，不再指向 `spark-workflow` 或 `.explore/`。

- [ ] **Step 2: 检查是否残留旧术语**

Run:

```powershell
rg -n "spark-workflow|context-budget-explore|\.explore/" '.codex\skills\devflow'
```

Expected: 结果为 0 行；如有命中，仅允许出现在“参考来源”说明中，不能出现在当前规则中。

- [ ] **Step 3: 检查是否覆盖关键规则**

Run:

```powershell
rg -n "plan != spec|checkpoint|handoff|懒创建|轻量路径|重型路径|bug 路径|resume 路径" '.codex\skills\devflow'
```

Expected: 所有规则至少在一处文档中被明确声明。

### Task 10: 最终自检并准备执行验证

**Files:**
- Modify: `.codex/skills/devflow/**`
- Reference: `docs/superpowers/specs/2026-04-09-devflow-design.md`

- [ ] **Step 1: 对照 spec 做覆盖检查**

Run:

```powershell
Get-Content -Raw 'docs\superpowers\specs\2026-04-09-devflow-design.md'
```

Expected: 能逐节核对设计要求与实现文件是否对应。

- [ ] **Step 2: 进行占位词扫描**

Run:

```powershell
rg -n "TBD|TODO|待补|占位|implement later|fill in details" '.codex\skills\devflow'
```

Expected: 结果为 0 行。

- [ ] **Step 3: 查看最终变更集**

Run:

```powershell
git status --short
```

Expected: 只包含本次 `devflow` 相关新增或修改，不应误改其它技能目录。

- [ ] **Step 4: 提交第一版实现**

Run:

```powershell
git add -- '.codex/skills/devflow'
git commit -m "feat: add first devflow skill"
```

Expected: 生成第一版 `devflow` 的完整提交。

## 自检结论

本计划覆盖了 `devflow` 第一版设计文档中的全部核心要求：

- 主入口与路径分类
- `.devflow/<mission-slug>/` 工作区规则
- 默认创建与懒创建策略
- `plan != spec`
- checkpoint 与 handoff 分工
- 子技能复用与调度
- 模板与示例

占位词扫描要求已在计划内单独列出，没有把关键内容留成空壳步骤。

## 执行建议

优先按 Chunk 顺序执行，不要交叉进行。  
如果在 Chunk 2 编写 `SKILL.md` 时发现目录或模板结构需要调整，应先更新计划中的目标文件列表，再继续实现，避免 `SKILL.md` 与模板不一致。
