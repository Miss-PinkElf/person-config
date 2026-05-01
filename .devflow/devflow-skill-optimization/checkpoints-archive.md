# Checkpoints Archive

## 2026-05-01 - Mission 重命名与总记录（Overall Record）建立

- 当前路径与阶段：重型路径（Heavy Route） / Explore -> Mini Align
- 本轮完成内容：
  - 将 mission 目录从单次 prompt 绑定命名重命名为 `.devflow/devflow-skill-optimization/`
  - 将下一次提示词文件重命名为 `NEXT-SESSION-PROMPT-devflow-skill-optimization.md`
  - 新增 `development-overview.md`，用于理解 `devflow` 技能（DevFlow skill）优化的完整开发过程
  - 新增轻量计划 `plans/2026-05-01-mission-rename-and-overall-record-plan.md`
  - 更新 `state.md` 与 `workflow.md`，把 mission 定位调整为长期主题
- 关键决策：
  - 总记录（overall record）需要保留，但不进入默认恢复热路径（resume hot path）
  - `state.md` 和 `workflow.md` 继续承担短快照职责，避免恢复 token 随项目扩大持续增长
- 风险与阻塞：
  - 上下文预算（context budget）规则尚未正式写入 `devflow` 技能文件
  - 旧计划中的历史路径引用可能保留为当时执行记录，后续验证时需区分“历史引用”和“恢复入口”
- 立即下一步：
  - 搜索旧 slug，修正会影响恢复的残留引用
  - 继续讨论并计划上下文预算（context budget）与滚动摘要（rolling summary）规则
- 相关文件与证据：
  - `.devflow/devflow-skill-optimization/development-overview.md`
  - `.devflow/devflow-skill-optimization/state.md`
  - `.devflow/devflow-skill-optimization/workflow.md`
  - `.devflow/devflow-skill-optimization/plans/2026-05-01-mission-rename-and-overall-record-plan.md`

## 2026-04-22 - DevFlow 技能（DevFlow Skill）流程级优化收口

- 当前路径与阶段：重型路径（Heavy Route） / Close
- 本轮完成内容：
  - 完成 `devflow` 主 skill 的 description、门禁摘要与 mission 自动关联规则更新
  - 完成 `references/routing-and-stages.md` 的活跃 mission 自动关联与阶段前置检查更新
  - 完成 `references/recording-rules.md` 的 checkpoint 触发矩阵与 checkpoint / handoff 边界更新
  - 完成 `references/workspace-and-templates.md` 的轻量 Plan 最小模板与 Mission Init 刷新规则更新
- 关键决策：
  - 本轮采用方案 B，不建设评测（Evaluation）资产
  - 只修改 `SKILL.md` 与 3 个 references，不改子 skill
  - 以关键词搜索与 `git diff --check` 作为本轮新鲜验证证据
- 风险与未覆盖内容：
  - 子 skill 协同问题本轮未动，后续仍需通过真实使用观察
  - 尚未建立专门的评测（Evaluation）资产
- 立即下一步：
  - 等待用户确认是否需要提交代码
  - 如无需提交，则以当前 checkpoint 结束本轮
- 相关文件与证据：
  - `.codex/skills/devflow/SKILL.md`
  - `.codex/skills/devflow/references/routing-and-stages.md`
  - `.codex/skills/devflow/references/recording-rules.md`
  - `.codex/skills/devflow/references/workspace-and-templates.md`
  - 验证命令：`rg -n '额外触发条件|活跃 Mission 自动关联|触发矩阵|轻量 Plan 最小模板|重型路径进入 \`Apply\` 前必须确认|checkpoint 回答|Mission Init 的职责是校验并刷新最小骨架' ...`
  - 验证命令：`git diff --check -- '.codex/skills/devflow/SKILL.md' '.codex/skills/devflow/references/routing-and-stages.md' '.codex/skills/devflow/references/recording-rules.md' '.codex/skills/devflow/references/workspace-and-templates.md'`
