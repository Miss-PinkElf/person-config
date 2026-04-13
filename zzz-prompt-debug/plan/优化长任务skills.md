# DevFlow Skill 设计文档

> 日期：2026-04-08
> 前身：context-budget-explore
> 参考：OpenSpec（https://github.com/Fission-AI/OpenSpec）、Superpowers（https://github.com/obra/superpowers）

---

## 一、原始需求

### 1.1 我想要什么

一个**统一的开发工作流 skill**，让 AI 在做任务时：

- **任务有记录**：不是做完就忘，每次做了什么、为什么这么做，都有据可查
- **决策有记录**：选了方案 A 放弃方案 B，原因是什么，以后能追溯
- **Bug 有记录**：调试过程、根因、修复方案，不是改完就丢
- **可以接续任务**：上下文太长或跨对话时，能无缝恢复
- **有讨论有思考有计划**：不是上来就写代码，先讨论、先想、先写 plan
- **整个过程有记录**：从探索到实施到验证，全链路可追溯

### 1.2 痛点（为什么要做这个）

之前有三个独立的 skill 在做类似但分散的事：

| Skill | 做什么 | 问题 |
|-------|--------|------|
| context-budget-explore | 长任务记录+上下文管理 | 名字难记、不写 plan、头脑风暴不好触发 |
| superspec / spark-workflow | OpenSpec 生命周期 + Superpower 质量门禁 | 和外层记录割裂，三层嵌套 |
| session-handoff | 跨对话交接 | 独立存在，没和工作流整合 |

核心问题：**三层嵌套，各管各的**。

```
context-budget-explore（外层记录）
  → 调用 spark-workflow（中间调度层）
    → 调用 openspec / superpower（实际执行层）
```

外层管"记录"，中层管"调度"，内层管"执行"，结果记录和执行完全脱节。Plan 不写、brainstorming 不主动触发、bug 没地方记。

---

## 二、设计思路

### 2.1 核心理念

**一句话：OpenSpec 管生命周期，Superpower 管每个节点的思考质量，全过程有记录，跨对话可续接。**

- **OpenSpec** 做主干状态机：管理变更从 explore → propose → apply → archive 怎么推进
- **Superpower** 做质量门禁/策略插件：在每个阶段插入 brainstorming / debugging / review / verification
- **session-handoff** 管任务的交接

### 2.2 架构变化：从三层变两层

```
之前（三层嵌套，割裂）：
  context-budget-explore → spark-workflow → openspec/superpower
  外层只是"壳"，实际逻辑在内层，记录和执行脱节

现在（两层扁平，直接调度）：
  devflow(SKILL.md) → 直接调度 openspec/superpower/session-handoff
  主入口直接融合生命周期+门禁+记录+交接，去掉 spark-workflow 中间层
```

去掉的是 **spark-workflow 这个中间调度层**。子 skills（openspec-explore、superpowers-brainstorming 等）保留，因为它们内容多、职责清晰、可独立复用。只是由 SKILL.md 直接调度，不再经过中间人。

### 2.3 新增的关键机制

#### Plan 记录（最重要的新增）

**每次大改动必须写 plan，小改动问用户要不要写。**

- Plan = 过程记录，记录"讨论了什么、选择了什么、为什么"
- Spec = 正式产物，从 Plan 中提炼的结论
- Plan 和 Spec 双向引用：Plan 标注"产出: spec/proposal.md 更新"，Spec 标注"来源: plans/xxx.md"

```
plans/                  ← 过程（每次讨论的快照）
├── 2026-04-08-初始方案讨论.md
├── 2026-04-09-方案二调整.md

spec/                   ← 结论（从 plan 提炼的正式产物）
├── proposal.md         ← 为什么做、做什么
├── design.md           ← 怎么做
└── tasks.md            ← 执行清单
```

#### 入口确认

**每次新需求或续接任务，必须先问用户："需要先头脑风暴/写 plan 吗？还是直接继续？"**

不静默跳过（之前的问题），也不静默触发（可能用户只想快速改个小东西）。

#### Bug 日志

新增 `bug-log.md`，调试过程中记录：现象、根因分析（四阶段）、修复方案、影响范围。

#### Checkpoint 归档

`checkpoints.md` 滚动保留 3 个，超出的搬到 `checkpoints-archive.md`。旧的不丢失，只是不主动加载。

---

## 三、主干流程

```
Classify → Align(brainstorming) → Plan(记录) → Propose(spec) → Apply → Review/Verify → Archive
                                    ↑ 新增
```

### Step 0：分类（Classify）

判断请求类型：
- 纯讨论/探索 → openspec-explore
- 纯 bug 修复 → systematic-debugging + 记录到 bug-log
- 小型明确改动 → 轻量路径：Mini Align → Plan → Propose → Apply → Verify
- 常规功能开发 → 标准路径：Align → Plan → Propose → Apply → Review/Verify → Archive
- 续接旧任务 → 读 state.md → 最新 handoff → 问用户要不要先头脑风暴

### Step 1：对齐（Align / Brainstorming）

不可跳过。两种模式：
- 完整模式：扫描代码库 → 逐个提问 → 方案对比 → 方案摘要 → 用户确认
- 轻量模式（Mini Align）：扫描 → 关键确认项 → 用户确认

### Step 2：计划（Plan）← 新增

将 Align 的讨论结论写入 `plans/YYYY-MM-DD-<topic>.md`。
Plan 至少包含：背景、目标、方案讨论（含放弃方案）、最终选择、关键决策、产出指向。

### Step 3：提案（Propose / Spec）

从 Plan 提炼正式产物到 `spec/`：
- proposal.md（做什么/为什么）
- design.md（怎么做）
- tasks.md（执行清单）

**用户批准 spec 后才能进入实施。**

### Step 4：实现（Apply）

按 tasks.md 推进，嵌入质量门禁：
- 遇 bug → Systematic Debugging + 记录到 bug-log
- 纯逻辑函数 → 可选 TDD
- 设计缺陷 → 暂停，回退 Step 3
- 连续 3 次修复失败 → 停止，质疑方案

### Step 5：收尾（Review → Verify → Archive）

- Code Review：先审查再宣称完成
- Verification：必须有证据证明完成
- Archive：验证通过后归档

---

## 四、Superpower 门禁嵌入点

| 生命周期阶段 | Superpower 门禁 | 作用 |
|-------------|----------------|------|
| 进入 Propose 前 | Brainstorming | 确保需求理解正确、方案对齐 |
| Apply 遇异常 | Systematic Debugging | 四阶段找根因，不允许瞎试 |
| Apply 纯逻辑函数 | TDD（可选） | 对数据计算/转换提升正确性 |
| 实现完成后 | Code Review | 先审查再宣称完成 |
| 收尾前 | Verification | 以证据证明完成，不是主观判断 |


## 五、过程记录系统

### 5.1 文件职责

| 文件 | 记录什么 | 更新时机 |
|------|---------|---------|
| `workflow.md` | 目标、范围、阶段、退出条件 | Mission Init |
| `state.md` | 当前阶段、事实、问题、下一步 | 每轮推进后 |
| `plans/` | 讨论/方案选择的过程 | Align/Plan 阶段 |
| `spec/` | 正式产物 | Propose 阶段 |
| `decision-log.md` | 关键决策（滚动 5 条+摘要） | 做选择后 |
| `bug-log.md` | bug 现象/根因/修复 | 调试后 |
| `learnings.md` | 可复用经验 | 形成经验时 |
| `checkpoints.md` | 阶段快照（滚动 3 个） | 阶段切换/重要节点 |
| `checkpoints-archive.md` | 归档的旧 checkpoint | 超出 3 个时搬入 |
| `handoffs/` | 交接文档 | 暂停/上下文过重时 |

### 5.2 工作区目录

```
.devflow/<mission-slug>/
├── workflow.md
├── state.md
├── plans/
│   └── YYYY-MM-DD-<topic>.md
├── spec/
│   ├── proposal.md
│   ├── design.md
│   └── tasks.md
├── decision-log.md
├── bug-log.md
├── learnings.md
├── checkpoints.md
├── checkpoints-archive.md
├── session-tasks.md
└── handoffs/
    ├── index.md
    └── YYYY-MM-DD-HHmm.md
```

---

## 六、Skill 文件结构

```
.claude/skills/devflow/
├── SKILL.md                          ← 主入口（~380行）
│                                        融合生命周期+门禁+记录+交接
│                                        直接调度子 skills，无中间层
│
├── references/
│   ├── brainstorming-guide.md        ← 头脑风暴详细指引
│   ├── quality-gates.md              ← 质量门禁规则
│   ├── workspace-and-templates.md    ← .devflow/ 目录结构+文件模板
│   └── examples/
│       ├── simple-change.md          ← 小型改动示例
│       └── complex-change.md         ← 复杂改动示例
│
├── assets/templates/
│   ├── plan-template.md              ← plan 过程记录模板（新增）
│   ├── bug-log-template.md           ← bug 日志模板（新增）
│   ├── proposal-template.md          ← proposal 模板
│   ├── design-template.md            ← design 模板
│   └── tasks-template.md             ← tasks 模板
│
└── skills/                           ← 子 skills（直接由 SKILL.md 调度）
    │
    ├── OpenSpec 生命周期
    │   ├── openspec-explore/         ← 纯探索讨论
    │   ├── openspec-propose/         ← 生成 proposal/design/tasks
    │   ├── openspec-apply-change/    ← 按 tasks 执行实现
    │   └── openspec-archive-change/  ← 完成后归档
    │
    ├── Superpower 质量门禁
    │   ├── superpowers-brainstorming/              ← 对齐需求与方案
    │   ├── superpowers-systematic-debugging/        ← 系统化调试
    │   ├── superpowers-test-driven-development/     ← 可选 TDD
    │   ├── superpowers-requesting-code-review/      ← 请求审查
    │   ├── superpowers-receiving-code-review/        ← 评估反馈
    │   ├── superpowers-verification-before-completion/ ← 验证完成
    │   ├── superpowers-dispatching-parallel-agents/  ← 并行任务
    │   └── superpowers-subagent-driven-development/  ← 子代理实现
    │
    └── 交接
        └── session-handoff/          ← 创建/恢复交接文档
```

---

## 七、阶段回退规则

| 当前阶段 | 触发情况 | 回退到 |
|---------|---------|-------|
| Align | 用户补充大量新约束 | 继续 Align |
| Plan | 方向需要大改 | 回到 Align |
| Propose | 用户推翻原方案 | 回到 Align |
| Apply | 发现设计缺陷 | 回到 Propose |
| Apply | 连续 3 次修复失败 | Debugging，必要时回到 Propose |
| Review | 反馈涉及设计变更 | 回到 Propose |
| Verify | 验证失败且暴露设计缺陷 | 回到 Propose |

---

## 八、常见反模式

| 反模式 | 正确做法 |
|--------|---------|
| 新需求/续接不问用户就开干 | 先问"需要头脑风暴/写 plan 吗？" |
| 跳过 Align 直接写 spec | 至少做一次交互确认 |
| 不写 plan 直接出 spec | 大改动必须先记 plan，小改动问用户 |
| 没有 spec 就写代码 | spec 获批后才能写代码 |
| 遇 bug 直接猜改 | Systematic Debugging + 记录到 bug-log |
| 说"应该没问题"就宣布完成 | 必须展示验证证据 |
| 只改代码不更新记录 | 每轮推进后回写 state/plan/decision 等 |

---

## 九、在另一个项目还原此 Skill 的步骤

1. **复制 `.claude/skills/devflow/` 整个目录**到目标项目
2. **子 skills 来源**：从 superspec 里复制 openspec 和 superpowers 子 skills，从 session-handoff 复制交接 skill
3. **微调子 skills**（可选）：如果需要贴合具体项目，调整子 skill 中的路径引用
4. **确认 CLAUDE.md**：在项目的 CLAUDE.md 中将默认 skill 指向 devflow
5. **触发测试**：新对话中说"做个功能""先讨论一下""继续上次的任务"，看是否正确触发

### 参考仓库

- OpenSpec 原版：https://github.com/Fission-AI/OpenSpec
- Superpowers 原版：https://github.com/obra/superpowers
- 本次实现的源仓库：person-code-config/.claude/skills/devflow/