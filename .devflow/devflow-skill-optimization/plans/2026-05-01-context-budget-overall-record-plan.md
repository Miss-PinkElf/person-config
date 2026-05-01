# DevFlow 上下文预算与总记录优化计划（Context Budget And Overall Record Plan）

**目标（Goal）：** 优化 `devflow` 技能（DevFlow skill）本体，让长期 mission 在持续扩大后仍能低 token 恢复，同时保留给人理解开发过程的总记录（overall record）。

**方案（Approach）：** 在 `devflow` 主 skill 与 references 中增加上下文预算（context budget）、恢复热路径（resume hot path）、滚动摘要（rolling summary）和总记录（overall record）规则；同步更新 `devflow-handoff.md`，让收尾提示词按同一套记录边界执行。

**范围（Scope）：**

- 修改 `.codex/skills/devflow/SKILL.md`
- 修改 `.codex/skills/devflow/references/recording-rules.md`
- 修改 `.codex/skills/devflow/references/workspace-and-templates.md`
- 修改 `devflow-handoff.md`
- 更新当前 mission 的 `state.md`、`workflow.md`、`decision-log.md`、`checkpoints.md` 与 `development-overview.md`

## 文件边界

- `SKILL.md`：定义高层铁律、恢复读取策略和总记录职责边界
- `recording-rules.md`：细化 `state.md`、`workflow.md`、`development-overview.md`、checkpoint、handoff 的更新与读取规则
- `workspace-and-templates.md`：补充工作区结构、建议预算和总记录模板
- `devflow-handoff.md`：同步交接提示词，避免默认全量更新和默认全量读取

## 任务

- [x] 在 `SKILL.md` 中补充上下文预算（context budget）与恢复热路径（resume hot path）规则
- [x] 在 `recording-rules.md` 中补充滚动摘要（rolling summary）与总记录（overall record）职责
- [x] 在 `workspace-and-templates.md` 中补充 `development-overview.md` 与预算建议
- [x] 更新 `devflow-handoff.md`，让交接收尾遵循新规则
- [x] 回写当前 mission 记录
- [x] 运行关键词搜索与 `git diff --check` 验证
