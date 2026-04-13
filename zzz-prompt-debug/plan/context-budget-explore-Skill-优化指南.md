# context-budget-explore Skill 优化指南

> 本文档记录了对 context-budget-explore skill 的三轮优化方案与具体操作步骤，适用于将同样的优化应用到其他目录中的同名 skill。

## 优化背景

### 问题

恢复一个任务时，skill 指令 + 工作区文件总计消耗约 **8,000-12,000 tokens**（占可用上下文的 8-12%）。主要瓶颈：

1. **SKILL.md 过重**：339 行全部加载，即使只需要路由判断
2. **工作区文件膨胀**：`checkpoints.md` 和 `decision-log.md` 随任务推进无限增长
3. **恢复时读取过多**：默认读 6 个文件，很多信息是冗余的
4. **流程门禁缺失**：Mission Init 后可以跳过 Align/brainstorming 直接写代码，spec/ 未创建就进入实施

### 优化后效果

| 指标 | 优化前 | 优化后 | 改善 |
|------|--------|--------|------|
| SKILL.md 触发消耗 | ~3,000 tokens | ~1,800 tokens | **-40%** |
| checkpoints 10 轮后 | ~3,000 tokens | ~900 tokens | **-70%** |
| decision-log 8 条后 | ~2,400 tokens | ~1,700 tokens | **-30%** |
| 恢复时必读文件数 | 6 个 | 2 个 | **-67%** |
| 总恢复消耗 | ~10,000 tokens | ~5,000 tokens | **-50%** |

---

## 方案一：SKILL.md 延迟加载拆分

### 原理

将 SKILL.md 从"一次全部加载"改为"核心骨架 + 按需读取详情"。触发时只加载精简的主文件，进入具体阶段执行时再读取详细指南。

### 操作步骤

#### 1. 新建 `references/phases-and-rules.md`

从 SKILL.md 中提取以下内容到这个新文件：

- 阶段 0-5 的完整流程描述（Classify / Mission Init / Bounded Loop / Checkpoint / 上下文预算控制 / Handoff Resume）
- 记录规则（各文件职责 + 更新策略）
- Checkpoint 滚动窗口规则
- Decision-Log 自动摘要规则

文件开头加一行说明：

```markdown
# 阶段详细流程与记录规则

本文件包含各阶段的完整执行指南和记录归档策略。由 SKILL.md 按需指引读取。
```

#### 2. 精简 SKILL.md

SKILL.md 只保留以下内容（目标 ~120 行）：

- **frontmatter**：name / description / version / allowed-tools（不变）
- **核心定位**：skill 是什么、负责什么（保留原文）
- **适用范围**：什么时候用、什么时候不用（保留原文）
- **默认工作目录**：精简为 3-4 行
- **真相源**：精简为 1-2 行概括
- **路由规则**：改用表格，一行一个路由，新增"前置条件"列：

```markdown
| 路由 | 场景 | 前置条件 | 读取 | 外层更新 |
|------|------|---------|------|---------|
| 一 | 纯探索 / 需求梳理 / 方案比较 | 无 | `skills/spark-workflow/SKILL.md` | workflow / state / decision-log / learnings |
| 二 | 方向已确定，产出 proposal / design / tasks | 路由一已完成或需求已足够清晰 | `skills/spark-workflow/SKILL.md` | spec/ 目录 |
| 三 | 已批准，进入实施与验证 | **spec/ 下 proposal + tasks 已存在且已获用户批准** | `skills/spark-workflow/SKILL.md` | 按 spec/tasks.md 推进 |
| 四 | 需要 handoff / resume | 无 | `skills/session-handoff/SKILL.md` | handoffs/ + state.md |
```

- **标准流程（概览）**：改用表格，一行一个阶段，附指引读取 `references/phases-and-rules.md`：

```markdown
| 阶段 | 名称 | 核心动作 |
|------|------|---------|
| 0 | Classify | 判断请求类型，选择路由，告知用户 |
| 1 | Mission Init | 定义目标/范围/成功标准，初始化工作区 |
| 2 | Bounded Loop | 每轮推进一个子目标，回写状态文件 |
| 3 | Checkpoint | 阶段切换/重要决策后写 checkpoint（滚动保留 3 个） |
| 4 | 上下文预算控制 | 轻度精简→中度 checkpoint→重度 handoff |
| 5 | Handoff / Resume | 创建交接或从最新 handoff 恢复 |

进入具体阶段执行时，读取 `references/phases-and-rules.md` 获取完整指引。
```

- **硬性规则**：保留原有 7 条 + 新增第 8、9 条（见方案四）
- **建议输出格式**：精简为 2 行
- **读取顺序**：更新为按需分层版本
- **环境偏好**：精简为 2-3 行

#### 3. 删除 SKILL.md 中的以下内容（已移到 phases-and-rules.md）

- `## 阶段 0：Classify` 到 `## 阶段 5：Handoff / Resume` 的全部详细描述
- `## 记录规则` 的详细内容（含 Decision-Log 自动摘要）
- `## 运作良好的标志`（非必要，可删除）
#### 4. 更新版本号

frontmatter 中 version 改为 `3.1.0`，date 改为当天日期。

---

## 方案三：自动归档 + 上下文上限

### 原理

给 `checkpoints.md` 和 `decision-log.md` 设置容量上限，旧内容自动归档或压缩，防止文件无限膨胀。同时精简恢复时的文件读取数量。

### 操作步骤

#### 1. Checkpoint 滚动窗口

在 SKILL.md（或提取后的 `references/phases-and-rules.md`）的阶段 3 Checkpoint 部分，追加以下内容：

```markdown
### Checkpoint 滚动窗口

`checkpoints.md` 只保留最近 3 个完整 checkpoint。当写入第 4 个时：

1. 把最早的 checkpoint 移到 `checkpoints-archive.md`（追加，不覆盖）
2. 在被移走的 checkpoint 原位置留一行摘要：`> [已归档] YYYY-MM-DD - 一句话概括`
3. 归档文件不主动读取，只在需要回溯历史时按需查看

这样 `checkpoints.md` 始终保持轻量，恢复时不会加载过多历史。
```

#### 2. Decision-Log 自动摘要

在记录规则部分，追加以下内容：

```markdown
### Decision-Log 自动摘要

当 `decision-log.md` 中完整决策记录超过 5 条时：

1. 保留最近 5 条完整记录（含背景、选择、原因、放弃方案、影响）
2. 更早的决策压缩为一行摘要格式：`> [#序号] YYYY-MM-DD - 选择了 X，因为 Y`
3. 摘要放在文件顶部的"历史决策摘要"区域，完整记录在下方

这样既保留了可追溯性，又避免文件无限膨胀。
```

#### 3. Handoff 恢复精简

将恢复任务的读取步骤从：

```
1. 找到对应 mission
2. 读取 state.md
3. 读取 handoffs/index.md
4. 读取最新 handoff，必要时补读上一份
5. 验证 handoff 提到的文件和当前仓库状态是否仍成立
6. 从最新 handoff 的下一步继续
```

改为：

```
1. 找到对应 mission
2. 读取 state.md（这是最重要的恢复入口）
3. 读取最新 handoff（只读最新 1 份，不再默认读 index + 多份）
4. 验证 handoff 提到的文件和当前仓库状态是否仍成立
5. 从最新 handoff 的下一步继续
6. 如果最新 handoff 信息不足，再按需读取 handoffs/index.md 或上一份 handoff
```

#### 4. 更新 `references/workspace-and-templates.md`

**目录结构**新增：

```
├── checkpoints-archive.md    ← 滚动归档的旧 checkpoint
```

**decision-log.md 模板**改为双区域：

```markdown
# 决策日志

## 历史决策摘要

（当完整记录超过 5 条时，旧决策压缩到这里）

## 完整记录

（保留最近 5 条）
```

**新增 checkpoints-archive.md 模板**：

```markdown
# Checkpoints 归档

（由滚动窗口自动归档的旧 checkpoint，按需查看，恢复时不主动读取）
```

**恢复策略**改为按需分层：

```markdown
恢复任务时按这个顺序读取：

1. `state.md`（最重要的恢复入口）
2. 最新 handoff（只读最新 1 份，不默认读多份）
3. `workflow.md`（按需，如果 state.md 信息不足）
4. `learnings.md`（按需）
5. `spec/` 中相关 artifact（按需）

不主动读取的文件（按需深入时才读）：
- `handoffs/index.md`（只在最新 handoff 信息不足时读取）
- `checkpoints-archive.md`（只在需要回溯历史时读取）
- `decision-log.md` 的历史摘要区
```

---

## 方案四：Align 门禁 + spec 前置检查

### 原理

实际使用中发现，模型在 Mission Init 之后会直接跳到写代码，跳过了 spark-workflow 的 Align 阶段（brainstorming）和 Propose 阶段（生成 spec/），导致：
- 没有需求对齐和方案讨论
- 没有 spec/ 目录下的 proposal.md / design.md / tasks.md
- 用户无法审查和批准方案就进入了实施

根因是 SKILL.md 的路由规则没有强制顺序，路由三（实施）没有前置条件。

### 操作步骤

#### 1. SKILL.md 路由规则表格新增"前置条件"列

路由三的前置条件明确为：**spec/ 下 proposal + tasks 已存在且已获用户批准**

#### 2. SKILL.md 路由规则下方新增"路由强制顺序"段落

```markdown
### 路由强制顺序

- Mission Init 完成后，首轮 Bounded Loop **必须走路由一或路由二**，触发 spark-workflow 的 Align 阶段（含 brainstorming），对齐需求方向
- **路由三的前置门禁**：`spec/proposal.md` 和 `spec/tasks.md` 必须已存在且获得用户批准，否则不能进入实施。没有 spec 就写代码是本 skill 最严重的反模式
- 如果用户给出的需求文档已经非常详细，仍然需要走 Align 确认，但可以走 Mini Align（spark-workflow 中的轻量路径）
```

#### 3. SKILL.md 硬性规则新增第 8、9 条

```markdown
8. **Mission Init 后首轮必须走 Align**：不能跳过需求对齐直接写代码，必须先读取 spark-workflow 触发 brainstorming
9. **没有 spec 不能写代码**：`spec/proposal.md` 和 `spec/tasks.md` 未创建或未获用户批准前，禁止进入路由三（实施）
```

#### 4. `references/phases-and-rules.md` 阶段 1 新增"强制流程"段落

在 Mission Init 的任务列表之后，添加：

```markdown
### Mission Init 后的强制流程

Mission Init 只是创建了工作区骨架，**不代表可以开始写代码**。

Init 完成后，首轮 Bounded Loop 必须按以下顺序推进：

1. **首先走 Align**：读取 `skills/spark-workflow/SKILL.md`，进入其 Step 1（Align），触发 brainstorming 对齐需求方向。即使需求文档已经很详细，也至少要走 Mini Align 做一次确认
2. **然后产出 spec**：Align 完成后进入 Step 2（Propose），在 `spec/` 目录下产出 `proposal.md`、`design.md`、`tasks.md`
3. **等待用户批准 spec**：用户必须明确批准 spec 后，才能进入实施（路由三）
4. **才能写代码**：按 `spec/tasks.md` 逐项推进实施

绝对禁止的流程：
- Mission Init → 直接创建 TaskList 写代码 ❌
- Mission Init → 只写 workflow.md / state.md 就开始改文件 ❌

正确的流程：
- Mission Init → Align（brainstorming）→ Propose（spec/）→ 用户批准 → Apply（写代码）✅
```

#### 5. `references/phases-and-rules.md` 末尾新增反模式表格

```markdown
## 反模式

| 反模式 | 为什么有害 | 正确做法 |
|--------|-----------|---------|
| Mission Init 后直接写代码 | 跳过了需求对齐，可能做错方向 | Init 后首轮必须走 Align |
| 只创建 workflow.md 不创建 spec/ | 没有可审查的方案文档，用户无法批准 | Align 后必须 Propose，产出 spec/ |
| 用 TaskList 替代 spec/tasks.md | TaskList 是执行跟踪，spec/tasks.md 是方案设计 | 先有 spec/tasks.md，再用 TaskList 跟踪执行 |
| spec/ 未获批准就进入实施 | 用户可能不认可方案 | 明确等待用户批准后再写代码 |
| 跳过 brainstorming 直接出方案 | 缺少方案对比和取舍讨论 | 通过 spark-workflow Align 阶段触发 brainstorming |
```

---

## 快速对照清单

应用到新目录时，按顺序检查：

**方案一：延迟加载**
- [ ] 新建 `references/phases-and-rules.md`，从 SKILL.md 提取阶段详情和记录规则
- [ ] 精简 SKILL.md 到 ~130 行（核心定位 + 路由表格 + 阶段概览表格 + 硬性规则）
- [ ] SKILL.md 的标准流程改为概览表格 + 指向 `references/phases-and-rules.md`
- [ ] 读取顺序改为按需分层

**方案三：自动归档**
- [ ] 阶段 3 追加 Checkpoint 滚动窗口规则（保留最近 3 个）
- [ ] 记录规则追加 Decision-Log 自动摘要（保留最近 5 条完整）
- [ ] 恢复流程改为 state.md 优先 + 只读最新 1 份 handoff
- [ ] `workspace-and-templates.md` 更新目录结构、模板、恢复策略

**方案四：Align 门禁**
- [ ] SKILL.md 路由规则表格新增"前置条件"列，路由三要求 spec 已批准
- [ ] SKILL.md 路由规则下方新增"路由强制顺序"段落
- [ ] SKILL.md 硬性规则新增第 8 条（首轮必须走 Align）和第 9 条（没有 spec 不能写代码）
- [ ] `references/phases-and-rules.md` 阶段 1 新增"Mission Init 后的强制流程"
- [ ] `references/phases-and-rules.md` 末尾新增反模式表格

**通用**
- [ ] 更新 version 和 date

## 适用目录

已知存在 context-budget-explore skill 的目录：

1. `.claude/skills/context-budget-explore/` — **已优化** ✅
2. `.codex/skills/context-budget-explore/` — 待优化
3. `.worktrees/agent-desktop-pet/.claude/skills/context-budget-ex