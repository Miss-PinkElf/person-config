# NEXT SESSION PROMPT - devflow-skill-optimization

你现在接手的 mission 是：`devflow-skill-optimization`。

## 当前进度概述

当前 mission 已完成 `devflow` 技能（DevFlow skill）v0.4 记录生命周期优化收口，并已提交前收尾。

已完成：

- 流程级优化
- mission 重命名与总记录（overall record）建立
- 上下文预算（context budget）规则落地
- v0.4 记录生命周期规则补齐
- `devflow-handoff.md` 在保持单一交接流程的前提下适配新的记录边界

已经完成的正式修改文件：

- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/routing-and-stages.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`
- `.codex/skills/devflow/assets/templates/state-template.md`
- `.codex/skills/devflow/assets/templates/origin-template.md`
- `.codex/skills/devflow/assets/templates/backlog-template.md`
- `.codex/skills/devflow/assets/templates/deferred-template.md`
- `devflow-handoff.md`

核心落地内容：

- 活跃 mission 自动关联（Mission Auto-Attach）
- description 的隐式触发（Implicit Trigger）扩展
- `plan` / `spec` 边界澄清
- 进入 `Apply` 的显式前置检查
- checkpoint 触发矩阵
- 轻量 Plan 最小模板
- mission 已从一次性 prompt 绑定命名调整为长期主题命名
- 已新增总记录（overall record）：`.devflow/devflow-skill-optimization/development-overview.md`
- 已新增上下文预算（Context Budget）规则
- 已明确恢复热路径（Resume Hot Path）：默认读取 `state.md` + `checkpoints.md`
- 已明确深度追溯路径（Deep Trace Path）：按需读取 `development-overview.md`、`decision-log.md`、`plans/`、`spec/`、`handoffs/`
- 已要求 `state.md` / `workflow.md` 使用滚动摘要（Rolling Summary），不承载完整历史
- `devflow-handoff.md` 保持原本交接流程，不拆多模式，但已补充总记录、checkpoint archive 与恢复热路径规则
- 已新增原始输入索引（Raw Input Source Index）：`.devflow/devflow-skill-optimization/origin.md`
- 已新增状态历史（State History）：`.devflow/devflow-skill-optimization/state-history.md`
- 已新增延期项管理（Deferred Work）：`backlog.md` 与 `deferred/`
- 已明确 `Apply` 阶段默认专注实现，不被频繁文档更新打断

## 未完成的任务清单

1. 如继续优化，先重新对齐具体方向
2. 可选方向一：检查子技能协同（Sub-skill Alignment）
3. 可选方向二：建设评测资产（Evaluation assets）
4. 可选方向三：重新处理 handoff 耗时问题

## 未讨论完的议题

1. 顶层 `devflow` 规则修正后，是否仍存在子 skill 级偏差
2. 是否需要为 `devflow` 建设评测（Evaluation）资产
3. mission 自动关联（Mission Auto-Attach）的触发强度是否还要继续微调
4. handoff 耗时问题是否需要重新设计方案

## 需要注意的上下文信息

- 第一轮明确采用方案 B：只改 `SKILL.md` + 3 个 references，不改子 skill，不做评测资产
- 第二轮按照 `skill-creator-cc` 优化现有 skill：改 `devflow` 技能本体，并同步 `devflow-handoff.md`
- 第三轮继续采用方案 B：补齐顶层 `devflow` v0.4 记录生命周期规则，不改子技能，不做评测资产
- `devflow-handoff.md` 的“快速/深度模式”方案已撤回；当前仅做规则适配，不做流程重构
- 已完成新鲜验证：
  - `rg` 关键词落点搜索
  - 模板与 mission 文件存在性检查
  - checkpoint 窗口检查
  - `git diff --check`
- `git diff --check` 只有 LF/CRLF warning，没有空白错误
- 过程中曾有一次中断，导致 `routing-and-stages.md` 临时删除；随后已完整恢复，当前仓库状态是正确的
- 过程中还暴露过一次 spec 产物误写到 `openspec/changes/` 的问题；当前已迁回 `.devflow/devflow-skill-optimization/spec/`，并已修正默认路径契约
- 当前 mission 文档、OpenSpec 三件套、checkpoint 与 handoff 都已齐全
- 当前恢复热路径（resume hot path）优先读 `state.md` + `checkpoints.md`
- 需要理解完整过程时读 `development-overview.md`
- 需要追溯原始输入、旧状态或延期项时读 `origin.md`、`state-history.md`、`backlog.md`、`deferred/`
- `state.md` 已压缩为短快照，旧内容已归档到 `state-history.md`
- 本轮已获用户明确授权提交相关代码

## 建议下次优先处理的事项

1. 先读取：
   - `.devflow/devflow-skill-optimization/state.md`
   - `.devflow/devflow-skill-optimization/checkpoints.md`
   - 如需理解完整过程，再读 `.devflow/devflow-skill-optimization/development-overview.md`
2. 如果继续优化，先讨论具体方向，不要跳过新的 Align / Plan
3. 优先候选方向：
   - 子技能协同（Sub-skill Alignment）
   - 评测资产（Evaluation assets）
   - handoff 性能优化
