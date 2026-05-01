# NEXT SESSION PROMPT - devflow-skill-optimization

你现在接手的 mission 是：`devflow-skill-optimization`。

## 当前进度概述

当前 mission 已完成本轮 `devflow` 技能（DevFlow skill）优化收口：

- 已完成流程级优化
- 已完成 mission 重命名与总记录（overall record）建立
- 已完成上下文预算（context budget）规则落地
- 已让 `devflow-handoff.md` 在保持原本单一交接流程的前提下适配新的记录边界

已经完成的正式修改文件：

- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/routing-and-stages.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`
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

## 未完成的任务清单

1. 确认是否需要提交代码
2. 如果需要提交，执行中文 `commit`
3. 如果不提交，后续可继续观察真实使用效果，决定是否开启下一轮优化或补评测（Evaluation）资产

## 未讨论完的议题

1. 顶层 `devflow` 规则修正后，是否仍存在子 skill 级偏差
2. 是否需要为 `devflow` 建设评测（Evaluation）资产
3. mission 自动关联（Mission Auto-Attach）的触发强度是否还要继续微调
4. 上下文预算（Context Budget）是否需要引入自动检查脚本或评测样例

## 需要注意的上下文信息

- 第一轮明确采用方案 B：只改 `SKILL.md` + 3 个 references，不改子 skill，不做评测资产
- 第二轮按照 `skill-creator-cc` 优化现有 skill：改 `devflow` 技能本体，并同步 `devflow-handoff.md`
- `devflow-handoff.md` 的“快速/深度模式”方案已撤回；当前仅做规则适配，不做流程重构
- 已完成新鲜验证：
  - `rg` 关键词落点搜索
  - `git diff --check`
- `git diff --check` 只有 LF/CRLF warning，没有空白错误
- 过程中曾有一次中断，导致 `routing-and-stages.md` 临时删除；随后已完整恢复，当前仓库状态是正确的
- 过程中还暴露过一次 spec 产物误写到 `openspec/changes/` 的问题；当前已迁回 `.devflow/devflow-skill-optimization/spec/`，并已修正默认路径契约
- 当前 mission 文档、OpenSpec 三件套、checkpoint 与 handoff 都已齐全
- 当前恢复热路径（resume hot path）优先读 `state.md` + `checkpoints.md`；需要理解完整开发过程时再读 `development-overview.md`
- `state.md` 当前约 38 行，`workflow.md` 当前约 24 行，符合短快照目标

## 建议下次优先处理的事项

1. 先读取：
   - `.devflow/devflow-skill-optimization/state.md`
   - `.devflow/devflow-skill-optimization/checkpoints.md`
   - 如需理解完整过程，再读 `.devflow/devflow-skill-optimization/development-overview.md`
2. 先问用户是否需要提交代码
3. 如果用户要提交：
   - 使用中文提交信息
   - 提交前再做一次必要的最终核对
4. 如果用户不提交但要继续优化：
   - 先讨论是扩展到子 skill，还是补评测（Evaluation）资产
   - 不要跳过新的 Align / Plan
