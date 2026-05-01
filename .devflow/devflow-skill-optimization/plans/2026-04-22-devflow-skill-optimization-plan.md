# DevFlow 技能（DevFlow Skill）流程级优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 `devflow` 技能（DevFlow skill）在真实使用中容易被跳阶段、漏记录、漏触发的问题，并将规则按“主文档摘要 + references 细则”结构收口。

**Architecture:** 本轮实施只修改 `devflow` 主 skill 与 3 个 references 文件，不改子 skill，不建设评测（Evaluation）资产。`SKILL.md` 负责触发、路径、门禁与摘要，references 分别承接阶段检查、记录规则和最小模板，避免主文档继续膨胀。

**Tech Stack:** Markdown、技能文档（Skill Docs）、DevFlow 工作区（Mission Workspace）

---

### Task 1: 产出 proposal / design / tasks 三件套

**Files:**
- Create: `.devflow/devflow-skill-optimization/spec/proposal.md`
- Create: `.devflow/devflow-skill-optimization/spec/design.md`
- Create: `.devflow/devflow-skill-optimization/spec/tasks.md`
- Reference: `.devflow/devflow-skill-optimization/plans/2026-04-22-devflow-skill-optimization-align.md`

- [ ] **Step 1: 基于 Align 与 Plan 提炼 proposal**

proposal 至少包含：

```text
- 为什么要做这次 devflow skill 优化
- 当前问题与影响
- 本轮范围与不纳入范围
- 预期收益与风险
```

Run: `Test-Path '.devflow/devflow-skill-optimization/spec'`
Expected: 若目录不存在，则先创建当前 mission 的 `spec/` 目录再写 proposal。

- [ ] **Step 2: 提炼 design，固定文件边界与规则归属**

design 至少包含：

```text
- SKILL.md 与 references 的职责分工
- 6 个优化项的落点映射
- 为什么不改子 skill、不做评测资产
- 关键术语与阶段边界
```

Expected: design 能直接指导实施，不再依赖聊天上下文。

- [ ] **Step 3: 产出 tasks，按可追踪项拆分实施**

tasks 至少包含：

```text
- 更新 SKILL.md
- 更新 routing-and-stages.md
- 更新 recording-rules.md
- 更新 workspace-and-templates.md
- 联合验证与 checkpoint
```

Expected: tasks 能作为后续 Apply 的直接追踪依据。

- [ ] **Step 4: 自检三件套与 Plan 一致性**

检查点：

```text
- proposal/design/tasks 是否与 Align 和 Plan 一致
- 是否没有遗漏 6 个优化项
- 是否没有把评测资产或子 skill 误写进正式范围
```

Run: `Get-Content -Raw '.devflow/devflow-skill-optimization/spec/<file>'`
Expected: 三件套与本轮 scope 完全一致。

### Task 2: 更新主 skill 入口与触发摘要

**Files:**
- Modify: `.codex/skills/devflow/SKILL.md`
- Reference: `.devflow/devflow-skill-optimization/plans/2026-04-22-devflow-skill-optimization-align.md`

- [ ] **Step 1: 重新阅读主 skill 当前结构，锁定需要改写的段落**

读取并标记以下段落：

```text
- frontmatter 的 description
- “不可跳过的铁律”
- “路径分类规则”
- “主线流程”
- “阶段门禁”
- “记录规则”
```

Run: `Get-Content -Raw '.codex/skills/devflow/SKILL.md'`
Expected: 成功读取当前主 skill 文本，能定位上述段落的现有内容。

- [ ] **Step 2: 改写 description，加入自动关联与隐式触发摘要**

将 description 从“显式触发词主导”改为“显式触发 + 上下文触发”，至少覆盖以下信号：

```text
- 已存在 `.devflow/<mission>/`
- 当前对话已经读取 mission 的 state / checkpoint / handoff / NEXT-SESSION-PROMPT
- 后续请求属于该 mission 的延续性改动
```

Expected change:

```markdown
description: |
  长期开发任务主入口。只要任务会分阶段推进、预计跨多轮继续、需要先讨论再写 plan、需要记录决策/bug/checkpoint/handoff，或用户说“先梳理”“先讨论”“先写 plan”“保存进度”“继续上次”，都应优先使用它。
  额外触发条件：当工作区内已存在 `.devflow/<mission>/` 且当前对话已读取该 mission 的 state、checkpoint、handoff、NEXT-SESSION-PROMPT 或其他工作区文件时，后续与该 mission 相关的改动默认继续纳入 devflow，而不是按普通即时任务处理。
  不要把 devflow 当成收尾记录器；它必须在第一次真正推进前介入，并强制执行 Align -> Plan -> Spec/Tasks -> Apply -> Verify/Close。
```

- [ ] **Step 3: 在主 skill 中补“门禁可执行化”与 plan/spec 摘要**

在不让文档过度膨胀的前提下，为以下内容补强摘要：

```text
- 阶段切换前必须执行检查，而不是只看原则声明
- 进入 Apply 前缺少前置条件时必须回退补齐
- plan 回答“做什么、顺序怎么排”
- spec 回答“为什么这样做、怎么实现、任务如何追踪”
```

Expected: `SKILL.md` 中出现明确的“摘要级”执行锚点，但详细清单仍下沉到 references。

- [ ] **Step 4: 自检主 skill 变更，确认没有与 references 职责重叠过度**

检查点：

```text
- 主文档是否只保留摘要而非长模板
- 是否明确引用 references 作为细则来源
- 是否没有把子 skill 的职责错误拉进主 skill
```

Run: `Get-Content -Raw '.codex/skills/devflow/SKILL.md'`
Expected: 结构仍以主线与门禁为主，没有重新变成“大杂烩”。

### Task 3: 补齐阶段前置检查与路径归属规则

**Files:**
- Modify: `.codex/skills/devflow/references/routing-and-stages.md`
- Reference: `.codex/skills/devflow/SKILL.md`

- [ ] **Step 1: 识别当前 references 中缺失的检查链**

对照 Align 文档，重点确认以下缺口：

```text
- Plan -> Propose / Tasks -> Apply 的检查链是否明确
- 重型路径进入 Apply 前是否明确要求 proposal/design/tasks
- mission 自动关联后的路径归属是否有说明
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/routing-and-stages.md'`
Expected: 能明确找出当前缺失项，并据此改写。

- [ ] **Step 2: 为重型路径新增进入 Apply 前的显式检查**

新增或改写说明，至少覆盖：

```markdown
进入 Apply 前必须确认：
- 已存在对应 plan
- `spec/proposal.md` 已存在并说明方案目的与取舍
- `spec/design.md` 已存在并说明实现结构
- `spec/tasks.md` 已存在并可追踪实施状态
- 若缺失，则回退到 Propose / Tasks，而不是直接实施
```

Expected: `routing-and-stages.md` 中对重型路径有清晰前置检查链。

- [ ] **Step 3: 为轻量路径补最小任务要求与 mission 自动关联规则**

补充：

```markdown
- 轻量路径进入 Apply 前，至少已有最小 plan 与最小 tasks
- 若某个 mission 已在上下文中激活，则相关小改动默认沿用该 mission
- 若任务复杂度变化，需要在 state.md 中回写路径升级或降级原因
```

Expected: 轻量路径不再存在“因为改动小所以不记计划”的解释空间。

- [ ] **Step 4: 自检阶段文档与主 skill 的表述一致性**

检查点：

```text
- 是否与 SKILL.md 的摘要一致
- 是否没有引入新的冲突术语
- 是否把“回退补齐”写成了明确动作
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/routing-and-stages.md'`
Expected: 阶段规则与主 skill 相互支撑，不互相打架。

### Task 4: 补齐记录规则与 checkpoint 触发矩阵

**Files:**
- Modify: `.codex/skills/devflow/references/recording-rules.md`
- Reference: `.codex/skills/devflow/SKILL.md`

- [ ] **Step 1: 识别当前记录规则中的模糊区**

重点检查以下问题：

```text
- checkpoint 触发时机是否足够具体
- checkpoint 与 handoff 边界是否足够明确
- 恢复时读取顺序是否足够强调 checkpoint 优先级
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/recording-rules.md'`
Expected: 能定位需要补强的段落。

- [ ] **Step 2: 增加 checkpoint 触发矩阵**

补充明确触发时机，至少包括：

```markdown
- 阶段切换时
- 重要里程碑完成时
- 做出影响后续实施方向的关键决策时
- 暂停前、Close 前、上下文需要压缩时
```

Expected: checkpoint 从“建议写”升级成“具体什么时候必须写”。

- [ ] **Step 3: 强化 checkpoint 与 handoff 的边界**

新增或改写说明：

```markdown
- checkpoint 回答“做到哪了”
- handoff 回答“下次怎么接”
- 正常阶段收束优先写 checkpoint；只有跨会话/跨 agent/上下文过长时才强制写 handoff
```

Expected: 后续 agent 不会再用 handoff 替代 checkpoint。

- [ ] **Step 4: 自检记录规则与 workflow 语义一致性**

检查点：

```text
- 是否仍坚持每轮至少更新 state.md
- 是否没有把 handoff 写成强制默认动作
- 是否与主 skill 中的记录摘要一致
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/recording-rules.md'`
Expected: 记录规则更可执行，但没有过度增加噪声。

### Task 5: 补齐工作区模板与轻量计划最小模板

**Files:**
- Modify: `.codex/skills/devflow/references/workspace-and-templates.md`
- Reference: `.codex/skills/devflow/references/routing-and-stages.md`

- [ ] **Step 1: 确认当前模板文档的最小缺口**

重点检查：

```text
- 是否已有轻量计划最小模板
- 是否说明 mission 已存在时如何刷新骨架
- 是否需要补一个进入 Apply 的最小检查示例
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/workspace-and-templates.md'`
Expected: 能定位模板缺失项。

- [ ] **Step 2: 增加轻量计划最小模板**

新增模板示例，至少包含：

```markdown
# [任务名称]
- 改动文件：`path/a`，`path/b`
- 方案：一句话描述
- 状态：待实施 / 已完成
```

Expected: 小改动也有最低记录标准，不再依赖主观判断。

- [ ] **Step 3: 补充 mission 已存在时的刷新说明**

增加说明：

```markdown
- Mission Init 在 mission 已存在时，职责是校验并刷新最小骨架
- 不重复覆盖已有 state / decision / workflow 历史
- 只补缺失项，不重建整个工作区
```

Expected: 恢复与续作场景下的行为更明确。

- [ ] **Step 4: 自检模板文档是否足够轻量且可复用**

检查点：

```text
- 模板是否足够短，适合轻量任务快速落盘
- 是否没有把实施细则写进模板
- 是否与 routing-and-stages.md 的阶段要求一致
```

Run: `Get-Content -Raw '.codex/skills/devflow/references/workspace-and-templates.md'`
Expected: 模板足够直接，不会逼出冗长文档。

### Task 6: 联合校对、状态回写与验证

**Files:**
- Modify: `.devflow/devflow-skill-optimization/workflow.md`
- Modify: `.devflow/devflow-skill-optimization/state.md`
- Modify: `.devflow/devflow-skill-optimization/decision-log.md`
- Create: `.devflow/devflow-skill-optimization/checkpoints.md`

- [ ] **Step 1: 通读四份正式变更文件，检查术语与职责一致性**

需要联合检查：

```text
- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/routing-and-stages.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`
```

检查目标：

```text
- mission 自动关联的说法是否一致
- plan/spec 边界是否一致
- checkpoint/handoff 边界是否一致
- 没有“主文档写一套，reference 写一套”
```

Run: `Get-Content -Raw '<file>'`
Expected: 能完成一次联合语义校对。

- [ ] **Step 2: 回写 mission 状态与关键决策**

回写内容至少包括：

```text
- 当前阶段进入 Apply 前准备完成
- 已实施的文件与主要规则变化
- 本轮选择方案 B 的执行完成状态
```

Expected: `workflow.md`、`state.md`、`decision-log.md` 与实际修改同步。

- [ ] **Step 3: 写 checkpoint，记录本轮优化结果**

新增 checkpoint，至少包含：

```markdown
- 当前路径与阶段
- 本轮完成内容
- 关键决策
- 风险与未覆盖内容
- 立即下一步
- 相关文件与证据
```

Expected: `checkpoints.md` 形成一次完整阶段快照。

- [ ] **Step 4: 做最终验证并准备进入 Close**

最终验证：

```text
- 使用 `rg` 搜索核心关键词，确认新规则已落到目标文件
- 人工通读确认 6 个优化项都能在正式文档中找到对应落点
- 不做全局 lint，不处理无关 TypeScript 问题
```

Run: `rg -n "自动关联|隐式触发|checkpoint|plan 与 spec|Apply|轻量计划" '.codex/skills/devflow'`
Expected: 能在主 skill 与 references 中搜到对应变更。
