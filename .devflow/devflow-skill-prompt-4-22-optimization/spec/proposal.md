# Proposal

## 背景

当前 `devflow` 技能（DevFlow skill）已经具备长期任务调度、记录与阶段门禁的基本结构，但在真实使用中暴露出“规则存在、执行不稳”的问题。根据 `zzz-prompt-debug/devflow优化/prompt-4-22.md` 的实际踩坑记录，当前问题主要集中在以下方面：

1. 硬门禁（Hard Gate）更像文字声明，缺少进入阶段前的可执行检查
2. 轻量计划（Light Plan）只有原则，没有最小模板，导致小改动被跳过
3. 已有 mission 缺少自动关联（Mission Auto-Attach），恢复后的相关改动容易脱离流程
4. 计划（Plan）与规格（Spec）边界不清，重型路径（Heavy Route）可能从 Plan 直接跳到 Apply
5. checkpoint 缺少明确触发矩阵（Trigger Matrix）
6. description 触发条件偏显式，隐式触发（Implicit Trigger）覆盖不足

这些问题会直接削弱 `devflow` 的约束力，导致流程只停留在文档层，而不能稳定约束真实执行。

## 目标

本次变更的目标是对 `devflow` 技能（DevFlow skill）做一次流程级优化，使其在现有体系内更稳定地完成以下能力：

1. 在进入关键阶段前执行明确检查，而不是只依赖抽象原则
2. 让轻量改动也有清晰、低摩擦的计划（Plan）落盘方式
3. 在已有 mission 的延续场景中更可靠地自动纳入 `devflow`
4. 明确计划（Plan）与规格（Spec）的职责边界
5. 让 checkpoint 与 handoff 的使用边界更清晰、更可执行
6. 在不改子 skill 的前提下，强化顶层 `devflow` 的流程约束能力

## 范围

本轮变更纳入以下范围：

1. 更新 `.codex/skills/devflow/SKILL.md`
2. 更新 `.codex/skills/devflow/references/routing-and-stages.md`
3. 更新 `.codex/skills/devflow/references/recording-rules.md`
4. 更新 `.codex/skills/devflow/references/workspace-and-templates.md`
5. 在当前 mission 工作区中同步更新状态（state）、决策（decision）与 checkpoint

本轮优化项固定为 6 项：

1. 门禁可执行化（Executable Gates）
2. 轻量计划最小模板（Light Plan Minimum Template）
3. 已有 mission 自动关联（Mission Auto-Attach）
4. 计划与规格分层澄清（Plan vs Spec Separation）
5. checkpoint 触发矩阵（Checkpoint Trigger Matrix）
6. 隐式触发扩展（Implicit Trigger Expansion）

## 非目标

本轮不做以下事项：

1. 不建设评测（Evaluation）资产
2. 不新增 evals、benchmark、viewer 等评测相关文件
3. 不修改 `superpowers-brainstorming`、`superpowers-writing-plans`、`openspec-*` 等子 skill 正文
4. 不扩展到 `.explore/` 或其他工作流体系
5. 不尝试一次性重构整个技能体系的全部说明文档

## 边界场景

1. 如果某个任务本身并不属于已有 mission 的延续，只是目录里碰巧存在 `.devflow/`，则仍应结合当前上下文判断是否自动纳入，而不是机械关联
2. 如果重型路径（Heavy Route）在 Plan 阶段后仍缺少正式 artifact，则必须回退补齐，不能因为“任务看起来简单”而直接进入 Apply
3. 如果任务确实是局部小改，也不能跳过计划（Plan）；应通过最小模板降低记录成本，而不是放弃记录
4. 如果正常阶段收束时只需要近期恢复，不应强制写 handoff；checkpoint 仍是默认选择

## 开放问题

1. 本轮只修正顶层 `devflow` 规则后，是否已经足以稳定约束后续子阶段，仍需在真实使用中继续观察
2. mission 自动关联（Mission Auto-Attach）的描述需要足够强，但也要避免在无关任务上误触发，文案强度需要拿捏
