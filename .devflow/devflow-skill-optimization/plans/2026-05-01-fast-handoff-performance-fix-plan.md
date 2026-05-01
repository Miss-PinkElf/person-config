# DevFlow handoff 性能问题记录计划（Handoff Performance Issue Plan）

**目标（Goal）：** 记录 `devflow-handoff.md` 收尾耗时约 20 分钟的问题；分模式修复方案已按用户要求撤回。

**问题现象（Symptom）：** 使用 `devflow-handoff.md` 做普通对话收尾时耗时过长。

**根因（Root Cause）：** 外层提示词调用完整 handoff 子流程，内层 `session-handoff` 子技能（session-handoff sub-skill）又默认读取 `workflow.md`、`spec/`、旧 handoff、模板和 checklist，导致普通收尾被放大成完整审计。

**方案（Approach）：** 暂时不优化 `devflow-handoff.md`，保持原本直接交接流程。耗时问题只保留为 bug 记录，后续如继续处理需重新对齐。

## 任务

- [x] 记录问题到 `bug-log.md`
- [x] 撤回 `devflow-handoff.md` 分模式改动
- [x] 撤回 `.codex/skills/devflow/skills/session-handoff/SKILL.md` 分模式改动
- [x] 撤回 handoff 模板与 index 模板恢复指引改动
- [ ] 运行验证，确认分模式改动不再残留到正式提示词和子 skill
