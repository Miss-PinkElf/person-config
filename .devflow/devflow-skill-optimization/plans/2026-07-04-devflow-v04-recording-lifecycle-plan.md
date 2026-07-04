# DevFlow v0.4 记录生命周期优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `优化思路-1.md` 与 `优化思路-2.md` 中的记录生命周期（recording lifecycle）规则补齐到当前启用的开发流技能（DevFlow skill）。

**Architecture:** 以 `.codex/skills/devflow` 为真相源（source of truth），只修改顶层技能说明、记录规则、工作区模板、模板资产和根目录交接命令（handoff command）。本轮不修改 OpenSpec / Superpowers 子技能（sub-skills），不修改旧版 `skills/all-skills/devflow-v1`，不新增评测资产（Evaluation assets）。

**Tech Stack:** Markdown 技能文档（Skill docs）、DevFlow mission 文档、PowerShell / ripgrep 验证命令。

---

## 对齐结论

- 原始输入索引（origin.md）不是不可变文件；Mission Init 时创建，后续允许追加原始提示词（raw prompt）来源。
- 如果原始提示词已经存在于 `zzz-prompt-debug/.../prompt-N.md`，`origin.md` 只引用相对路径，不强制复制全文。
- 实施阶段（Apply）默认专注实现，不被频繁过程文档更新打断；阶段切换、回退、暂停、收口时再更新必要记录。
- 状态文件（state.md）保持短当前快照；旧快照进入 `state-history.md`，恢复时默认不读历史。
- 延期项拆成轻量待办（backlog.md）与明确延期项（deferred/）。
- `devflow-handoff.md` 需要同步上述规则，但不引入快速/深度多模式。

## 文件结构

- Modify: `.codex/skills/devflow/SKILL.md`
  - 更新版本号与主规则，加入原始输入索引、状态分层、延期项和 Apply 记录节奏。
- Modify: `.codex/skills/devflow/references/recording-rules.md`
  - 补充分阶段记录策略、`state-history.md`、`origin.md`、`backlog.md`、`deferred/` 的写入规则。
- Modify: `.codex/skills/devflow/references/workspace-and-templates.md`
  - 更新 mission 工作区结构、默认创建/懒创建列表、模板使用时机和恢复读取策略。
- Modify: `.codex/skills/devflow/assets/templates/state-template.md`
  - 精简为短当前快照模板。
- Create: `.codex/skills/devflow/assets/templates/origin-template.md`
  - 记录多次原始提示词来源、用途与吸收状态。
- Create: `.codex/skills/devflow/assets/templates/backlog-template.md`
  - 记录轻量延期想法。
- Create: `.codex/skills/devflow/assets/templates/deferred-template.md`
  - 记录明确延期的功能/逻辑。
- Modify: `devflow-handoff.md`
  - 同步 state 分层、backlog/deferred 检查和 origin 更新规则。
- Modify: `.devflow/devflow-skill-optimization/state.md`
  - 更新当前 mission 状态。
- Modify: `.devflow/devflow-skill-optimization/checkpoints.md`
  - 写入本轮 checkpoint，保持最近 3 条窗口。
- Modify as needed: `.devflow/devflow-skill-optimization/checkpoints-archive.md`
  - 如果 checkpoint 超过 3 条，将旧条目归档。
- Modify as needed: `.devflow/devflow-skill-optimization/development-overview.md`
  - 本轮属于长期规则演进，需要补充阶段总览。

## Task 1: 更新开发流主技能规则

**Files:**
- Modify: `.codex/skills/devflow/SKILL.md`

- [ ] **Step 1: 更新版本与定位**

将 frontmatter 版本从 `0.2.0` 更新为 `0.4.0`，日期更新为 `2026-07-04`。在核心定位中加入记录生命周期（recording lifecycle）与原始输入索引（origin index）。

- [ ] **Step 2: 补齐工作区文件**

在工作区真相源、默认创建、懒创建列表中加入：

```text
origin.md
state-history.md
backlog.md
deferred/
```

`origin.md` 默认创建；`state-history.md`、`backlog.md`、`deferred/` 按需要懒创建。

- [ ] **Step 3: 写入 Apply 记录节奏**

在记录规则中明确：

```text
Align / Plan 阶段：文档是交付物，正常产出。
Apply 阶段：默认专注实现，不主动更新过程文档。
Apply 中发生回退、阻塞、用户暂停、上下文压缩时：写最小状态快照与 checkpoint。
Verify / Close 阶段：补齐 state、checkpoint、必要的 decision-log 与 development-overview。
```

- [ ] **Step 4: 写入状态分层规则**

明确 `state.md` 是短当前快照，建议 30 行内；更新前将旧快照追加到 `state-history.md`，恢复时默认只读 `state.md`，需要追溯时才读 `state-history.md`。

- [ ] **Step 5: 写入原始输入索引规则**

明确 `origin.md` 允许追加，不是不可变文件。每条来源至少包含：相对路径、时间、用途、是否已吸收进 plan/spec/tasks。

## Task 2: 更新记录规则参考文档

**Files:**
- Modify: `.codex/skills/devflow/references/recording-rules.md`

- [ ] **Step 1: 重写每轮推进后的最小要求**

将“每轮推进至少更新 state.md”调整为分阶段策略，避免 Apply 阶段被文档更新打断。

- [ ] **Step 2: 新增状态分层段落**

写清 `state.md` 与 `state-history.md` 的关系：

```text
state.md：短当前快照，只保留当前阶段、风险、下一步、关键指针。
state-history.md：旧 state 快照归档，带时间戳追加。
默认恢复：不读 state-history.md。
```

- [ ] **Step 3: 新增原始输入索引段落**

写清 `origin.md` 的定位：保存原始输入来源索引，支持多次追加 prompt，例如 `zzz-prompt-debug/.../prompt-1.md`、`prompt-2.md`。

- [ ] **Step 4: 新增延期项管理段落**

写清 `backlog.md` 与 `deferred/` 的区别：

```text
backlog.md：一句话轻量想法，可做可不做。
deferred/：明确延期的功能/逻辑，有已有思路、暂不做原因、触发条件和推荐阶段。
```

- [ ] **Step 5: 调整文件预算建议**

将 `state.md` 建议从 80-120 行收紧到 30 行内；保留 `workflow.md` 60-100 行、`checkpoints.md` 最近 3 条、`development-overview.md` 不默认读取。

## Task 3: 更新工作区模板说明与模板资产

**Files:**
- Modify: `.codex/skills/devflow/references/workspace-and-templates.md`
- Modify: `.codex/skills/devflow/assets/templates/state-template.md`
- Create: `.codex/skills/devflow/assets/templates/origin-template.md`
- Create: `.codex/skills/devflow/assets/templates/backlog-template.md`
- Create: `.codex/skills/devflow/assets/templates/deferred-template.md`

- [ ] **Step 1: 更新工作区结构**

在结构树加入：

```text
├── origin.md
├── state-history.md
├── backlog.md
└── deferred/
```

- [ ] **Step 2: 更新默认创建与懒创建**

默认创建：

```text
workflow.md
state.md
origin.md
decision-log.md
```

懒创建：

```text
state-history.md
backlog.md
deferred/
```

- [ ] **Step 3: 精简 state 模板**

`state-template.md` 改为包含以下 5 个字段：

```markdown
# 当前状态（Current State）

- Mission：
- 当前阶段（Current Stage）：
- 当前结论：
- 风险/阻塞：
- 下一步：
```

- [ ] **Step 4: 新增 origin 模板**

`origin-template.md` 内容包含“来源列表”“吸收状态”“备注”，明确使用相对路径。

- [ ] **Step 5: 新增 backlog/deferred 模板**

`backlog-template.md` 用表格记录轻量想法；`deferred-template.md` 用固定小节记录延期对象、本轮不做原因、已有思路、触发条件、推荐进入阶段。

## Task 4: 同步交接命令

**Files:**
- Modify: `devflow-handoff.md`

- [ ] **Step 1: 更新上下文预算规则**

补充：

```text
更新 state.md 前，如果旧内容仍有价值，先追加到 state-history.md。
origin.md 可追加本轮新增原始 prompt 来源。
backlog.md 与 deferred/ 在 handoff 前检查，handoff 可引用其内容。
```

- [ ] **Step 2: 调整检查顺序**

将 backlog/deferred 检查放在 handoff 生成前，顺序保持单一流程，不拆快速/深度模式。

- [ ] **Step 3: 保持提交约束**

不在 `devflow-handoff.md` 中加入“自动提交”规则，继续遵守当前仓库约束：完成代码修改后先询问用户是否需要提交代码。

## Task 5: 更新 mission 记录并验证

**Files:**
- Modify: `.devflow/devflow-skill-optimization/state.md`
- Modify: `.devflow/devflow-skill-optimization/checkpoints.md`
- Modify as needed: `.devflow/devflow-skill-optimization/checkpoints-archive.md`
- Modify as needed: `.devflow/devflow-skill-optimization/development-overview.md`

- [ ] **Step 1: 更新 state**

将当前阶段从 Close 更新为 Apply/Verify/Close 的最新状态，记录本轮目标与下一步。

- [ ] **Step 2: 更新 development overview**

增加本轮“v0.4 记录生命周期补齐”阶段，列出输入来源、核心改动、验证证据。

- [ ] **Step 3: 写 checkpoint**

写入本轮 checkpoint，并将 `checkpoints.md` 控制在最近 3 条。

- [ ] **Step 4: 运行关键词验证**

运行：

```powershell
rg -n "origin\\.md|state-history\\.md|backlog\\.md|deferred|Apply 阶段|原始输入|延期项" .codex\skills\devflow devflow-handoff.md
```

预期：能在主技能、记录规则、工作区模板、交接命令中找到对应规则。

- [ ] **Step 5: 运行 diff 检查**

运行：

```powershell
git diff --check
```

预期：没有空白错误；如果只有 LF/CRLF warning，记录为非阻断。

## 自审

- 覆盖 `优化思路-1.md`：原始 prompt 管理、上下文滑动窗口、文档索引、延期项、嵌套/拆 mission 取舍。
- 覆盖 `优化思路-2.md`：Apply 记录节奏、state 分层、origin、backlog/deferred、handoff 顺序。
- 未覆盖项：自动创建命令指向 NEXT-SESSION-PROMPT、评测资产、子技能协同，按本轮对齐结论不做。
- 无占位符：本计划中的路径、任务、验证命令均已明确。
