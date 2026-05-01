# DevFlow 技能优化总记录（Development Overview）

## 定位

本文件是 `devflow` 技能（DevFlow skill）优化 mission 的总记录（overall record），用于帮助人理解这个需求为什么产生、做过哪些阶段、形成了哪些关键决策，以及后续还要观察什么。

它不是恢复热路径（resume hot path）文件。日常恢复时优先读取 `state.md` 和 `checkpoints.md`；只有需要理解完整开发过程、追溯历史取舍或进行深度交接时，才读取本文件。

## 背景

`devflow` 技能（DevFlow skill）用于长期开发任务的主线调度，负责把对齐（Align）、计划（Plan）、规格（Spec）、实施（Apply）、验证（Verify）、收口（Close）和交接（handoff）串起来。

真实使用中暴露出一个核心问题：规则虽然存在，但 agent 在长任务或跨会话恢复时仍可能跳过对齐、计划、记录或路径校验。用户希望把 `devflow` 优化成更稳定的长期开发工作流，而不是只在收尾时补记录。

## 已完成阶段

### 第一轮：流程级优化

输入来源：

- `zzz-prompt-debug/devflow优化/prompt-4-22.md`
- `zzz-prompt-debug/devflow优化/prompt-4-22-1.md`

已完成流程：

- 对齐（Align）
- 计划（Plan）
- OpenSpec 提案 / 设计 / 任务（proposal / design / tasks）
- 实施（Apply）
- 验证（Verify）
- 收口（Close）
- checkpoint / handoff / 下一次提示词（next session prompt）

正式修改文件：

- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/routing-and-stages.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`

核心落地内容：

- 活跃 mission 自动关联（Mission Auto-Attach）
- 隐式触发（Implicit Trigger）扩展
- 计划（Plan）与规格（Spec）边界澄清
- 进入实施（Apply）的显式前置检查
- checkpoint 触发矩阵
- 轻量计划（Light Plan）最小模板

验证证据：

- `rg` 关键词落点搜索
- `git diff --check`

### 第二轮：命名与记录边界调整

触发原因：

- 用户指出 mission 名称不应带日期或绑定单次 prompt
- 用户指出长期项目需要一个总记录（overall record），用于理解需求开发过程
- 用户同时担心恢复 token 消耗和记录文件无限增长

当前处理：

- mission 目录重命名为 `.devflow/devflow-skill-optimization/`
- 下一次提示词文件重命名为 `NEXT-SESSION-PROMPT-devflow-skill-optimization.md`
- 新增本文件作为开发总览（development overview）
- 保持 `state.md` 与 `workflow.md` 偏短，作为恢复热路径（resume hot path）的当前快照

### 第三轮：上下文预算与总记录规则落地

触发原因：

- 用户确认恢复 token 消耗和记录文件无限增长两个问题都需要处理
- 用户追问是否应该优化 `devflow` 技能（DevFlow skill）本体，而不是只优化 `devflow-handoff.md` 交接提示词
- 用户明确要求按照 `skill-creator-cc` 改进现有 skill

正式修改文件：

- `.codex/skills/devflow/SKILL.md`
- `.codex/skills/devflow/references/recording-rules.md`
- `.codex/skills/devflow/references/workspace-and-templates.md`
- `devflow-handoff.md`

核心落地内容：

- 新增上下文预算（Context Budget）规则
- 明确恢复热路径（Resume Hot Path）：默认读取 `state.md` 与 `checkpoints.md`
- 明确深度追溯路径（Deep Trace Path）：按需读取 `development-overview.md`、`decision-log.md`、`plans/`、`spec/`、`handoffs/`
- 明确 `state.md` 与 `workflow.md` 使用滚动摘要（Rolling Summary），不承载完整历史
- 明确 `development-overview.md` 是总记录（overall record），用于人类理解完整开发过程，但不默认读取
- 同步 `devflow-handoff.md`，避免交接时默认全量读取或全量改写 mission 文档

### 第四轮：handoff 耗时问题讨论与方案撤回

触发原因：

- 用户反馈 `devflow-handoff.md` 普通收尾可能耗时约 20 分钟。

问题原因：

- 外层 `devflow-handoff.md` 调用完整 handoff 子流程。
- 内置 `session-handoff` 子技能默认读取 `workflow.md`、`spec/`、旧 handoff、模板与 checklist。
- 两层规则叠加后，普通收尾被放大成深度交接（deep handoff）和全量审计（full audit）。

曾讨论的修改文件：

- `devflow-handoff.md`
- `.codex/skills/devflow/skills/session-handoff/SKILL.md`
- `.codex/skills/devflow/skills/session-handoff/assets/templates/handoff-template.md`
- `.codex/skills/devflow/skills/session-handoff/assets/templates/handoff-index-template.md`

当前结论：

- 用户确认 `devflow-handoff.md` 暂时不优化，不引入多模式。
- 已撤回 `devflow-handoff.md` 与内置 `session-handoff` 子技能的分模式改动。
- `devflow-handoff.md` 后续只做轻量适配：保持原本直接交接流程，但补充上下文预算、总记录和恢复热路径规则。
- 耗时问题保留在 `bug-log.md`，后续如继续优化需重新对齐方案。

## 关键决策

- `devflow` mission 应按长期主题命名，而不是按日期、prompt 或某一次输入命名。
- 需要保留总记录（overall record），因为人类理解项目演进时需要完整脉络。
- 总记录不应成为默认恢复热路径，否则会重新放大 token 消耗。
- `state.md` 应是当前状态快照（current snapshot），不负责承载完整历史。
- `workflow.md` 应是当前流程视图（current workflow view），不负责承载所有阶段细节。
- 历史事件优先进入 `checkpoints.md`、`checkpoints-archive.md`、`decision-log.md` 和本总记录。
- `devflow` 技能本体需要承载上下文预算规则；交接提示词只能同步这些规则，不能替代 skill 本体优化。
- 默认恢复只读 `state.md` 与 `checkpoints.md`，深度追溯文件必须按需读取。
- handoff 耗时问题存在，但暂时不引入快速 / 深度等多模式设计。

## 当前开放问题

- 是否继续优化子 skill 协同，尤其是 Superpowers 子技能与 OpenSpec 子技能对 `devflow` 外层规则的遵循。
- 是否建设评测（Evaluation）资产，用真实 prompt 验证 `devflow` 是否稳定触发 Align、Plan、Apply 与 Verify 门禁。

## 推荐读取策略

日常恢复读取：

1. `state.md`
2. `checkpoints.md`
3. 必要时读取最新 handoff

理解完整过程读取：

1. `development-overview.md`
2. `decision-log.md`
3. `plans/`
4. `spec/`
5. `handoffs/`

## 下一步建议

下一轮正式优化建议聚焦“上下文预算（context budget）与滚动摘要（rolling summary）”：

- 明确恢复热路径（resume hot path）默认读取哪些文件
- 明确 `state.md` 和 `workflow.md` 如何保持短快照
- 明确总记录（overall record）何时更新、何时读取
- 明确 checkpoint 与 archive 的窗口规则
