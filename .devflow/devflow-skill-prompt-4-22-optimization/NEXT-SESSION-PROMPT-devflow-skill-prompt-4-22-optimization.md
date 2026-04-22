# NEXT SESSION PROMPT - devflow-skill-prompt-4-22-optimization

你现在接手的 mission 是：`devflow-skill-prompt-4-22-optimization`。

## 当前进度概述

本轮已经按完整 `devflow` 流程完成：

- Align
- Plan
- OpenSpec proposal / design / tasks
- Apply
- Verify
- Close / checkpoint / handoff

已经完成的正式修改文件：

- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/routing-and-stages.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`

本轮核心落地内容：

- 活跃 mission 自动关联（Mission Auto-Attach）
- description 的隐式触发（Implicit Trigger）扩展
- `plan` / `spec` 边界澄清
- 进入 `Apply` 的显式前置检查
- checkpoint 触发矩阵
- 轻量 Plan 最小模板

## 未完成的任务清单

1. 确认是否需要提交代码
2. 如果需要提交，执行中文 `commit`
3. 如果不提交，后续可继续观察真实使用效果，决定是否开启下一轮优化

## 未讨论完的议题

1. 顶层 `devflow` 规则修正后，是否仍存在子 skill 级偏差
2. 是否需要为 `devflow` 建设评测（Evaluation）资产
3. mission 自动关联（Mission Auto-Attach）的触发强度是否还要继续微调

## 需要注意的上下文信息

- 本轮明确采用方案 B：只改 `SKILL.md` + 3 个 references，不改子 skill，不做评测资产
- 本轮已经完成新鲜验证：
  - `rg` 关键词落点搜索
  - `git diff --check`
- 过程中曾有一次中断，导致 `routing-and-stages.md` 临时删除；随后已完整恢复，当前仓库状态是正确的
- 过程中还暴露过一次 spec 产物误写到 `openspec/changes/` 的问题；当前已迁回 `.devflow/devflow-skill-prompt-4-22-optimization/spec/`，并已修正默认路径契约
- 当前 mission 文档、OpenSpec 三件套、checkpoint 与 handoff 都已齐全

## 建议下次优先处理的事项

1. 先读取：
   - `.devflow/devflow-skill-prompt-4-22-optimization/state.md`
   - `.devflow/devflow-skill-prompt-4-22-optimization/checkpoints.md`
   - `.devflow/devflow-skill-prompt-4-22-optimization/handoffs/index.md`
   - 最新 handoff
2. 先问用户是否需要提交代码
3. 如果用户要提交：
   - 使用中文提交信息
   - 提交前再做一次必要的最终核对
4. 如果用户不提交但要继续优化：
   - 先讨论是扩展到子 skill，还是补评测（Evaluation）资产
   - 不要跳过新的 Align / Plan
