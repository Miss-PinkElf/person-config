# Checkpoints

## 2026-05-01 - `devflow-handoff.md` 适配上下文预算规则

- 当前路径与阶段：重型路径（Heavy Route） / Close
- 本轮完成内容：
  - 保留 `devflow-handoff.md` 原本直接交接流程，不引入多模式
  - 补充上下文预算（Context Budget）规则说明
  - 明确 `state.md` / `workflow.md` 使用滚动摘要（Rolling Summary）
  - 增加 `development-overview.md` 总记录（Overall Record）的按需更新项
  - 要求下一次提示词写明恢复热路径（Resume Hot Path）
  - 完成关键词搜索、checkpoint 窗口整理与 `git diff --check` 验证
- 关键决策：
  - `devflow-handoff.md` 需要适配 `devflow` 技能优化，但适配不等于拆分模式
- 风险与阻塞：
  - handoff 耗时问题仍未专门解决
- 立即下一步：
  - 等待用户确认是否需要提交代码
- 相关文件与证据：
  - `devflow-handoff.md`
  - `git diff --check`

## 2026-05-01 - 上下文预算（Context Budget）与总记录规则落地

- 当前路径与阶段：重型路径（Heavy Route） / Verify
- 本轮完成内容：
  - 按 `skill-creator-cc` 思路优化现有 `devflow` 技能（DevFlow skill），不是只修改交接提示词
  - 在 `.codex/skills/devflow/SKILL.md` 中新增上下文预算（context budget）、恢复热路径（resume hot path）与深度追溯路径（deep trace path）规则
  - 在 `references/recording-rules.md` 中补充滚动摘要（rolling summary）、总记录（overall record）与文件预算建议
  - 在 `references/workspace-and-templates.md` 中补充 `development-overview.md`、读取分层和总记录模板
  - 同步更新 `devflow-handoff.md`，让交接收尾默认只读热路径，并按需更新总记录
- 关键决策：
  - `state.md` 与 `checkpoints.md` 是默认恢复热路径
  - `development-overview.md` 是给人理解完整开发过程的总记录，不是默认恢复必读文件
  - `devflow-handoff.md` 只同步收尾流程，不能替代 `devflow` 技能本体优化
- 风险与阻塞：
  - 本轮未建设评测（Evaluation）资产
  - 子 skill 协同问题仍未修改
- 立即下一步：
  - 运行关键词搜索与 `git diff --check`
  - 如验证通过，询问用户是否需要提交代码
- 相关文件与证据：
  - `.codex/skills/devflow/SKILL.md`
  - `.codex/skills/devflow/references/recording-rules.md`
  - `.codex/skills/devflow/references/workspace-and-templates.md`
  - `devflow-handoff.md`
  - `.devflow/devflow-skill-optimization/plans/2026-05-01-context-budget-overall-record-plan.md`

## 2026-07-04 - v0.4 记录生命周期规则补齐

- 当前路径与阶段：重型路径（Heavy Route） / Close
- 本轮完成内容：
  - 读取并吸收 `zzz-prompt-debug/devflow优化/优化思路-1.md` 与 `zzz-prompt-debug/devflow优化/优化思路-2.md`
  - 按 `skill-creator-cc` 改进现有 `devflow` 技能（DevFlow skill）
  - 新增本轮计划：`.devflow/devflow-skill-optimization/plans/2026-07-04-devflow-v04-recording-lifecycle-plan.md`
  - 将 `origin.md` 定位修正为可追加的原始输入索引（Raw Input Source Index）
  - 补齐状态分层（state layering）、Apply 记录节奏、延期项管理（deferred work management）和 handoff 检查顺序
- 关键决策：
  - 采用方案 B：只改顶层 `devflow` 技能、references、templates、`devflow-handoff.md` 与当前 mission 记录
  - 不修改 OpenSpec / Superpowers 子技能（sub-skills）
  - 不修改旧版 `skills/all-skills/devflow-v1`
  - 不新增评测资产（Evaluation assets）
- 风险与阻塞：
  - 子技能协同与评测资产（Evaluation assets）仍未纳入本轮
- 立即下一步：
  - 询问用户是否需要提交代码
  - 如继续优化，先重新对齐子技能协同或评测资产范围
- 相关文件与证据：
  - `.codex/skills/devflow/SKILL.md`
  - `.codex/skills/devflow/references/recording-rules.md`
  - `.codex/skills/devflow/references/workspace-and-templates.md`
  - `.codex/skills/devflow/assets/templates/origin-template.md`
  - `.codex/skills/devflow/assets/templates/backlog-template.md`
  - `.codex/skills/devflow/assets/templates/deferred-template.md`
  - `devflow-handoff.md`
  - 关键词落点搜索：`rg -n "origin\\.md|state-history\\.md|backlog\\.md|deferred|Apply 阶段|原始输入|延期项" .codex\skills\devflow devflow-handoff.md .devflow\devflow-skill-optimization`
  - 冲突搜索：`rg -n "80-120|120 行|创建后不|冻结|每轮推进后至少更新 `state\\.md`|每轮推进后至少更新" .codex\skills\devflow devflow-handoff.md .devflow\devflow-skill-optimization`
  - 空白检查：`git diff --check`，仅有 LF/CRLF warning，无空白错误
