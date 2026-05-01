# DevFlow 技能 Mission 重命名与总记录计划（Mission Rename And Overall Record Plan）

**目标（Goal）：** 将当前 mission 从一次性 prompt 绑定命名调整为长期主题命名，并补充用于理解开发过程的总记录（overall record）。

**方案（Approach）：** 保持当前 mission 的历史产物不丢失，只更新恢复入口与当前真相源（source of truth）。新增总记录文件承载完整开发脉络，`state.md` 和 `workflow.md` 继续保持短摘要，避免恢复时默认读取过多上下文。

**范围（Scope）：**

- 将 mission 目录调整为 `.devflow/devflow-skill-optimization/`
- 更新当前状态（state）、工作流（workflow）、决策日志（decision log）、checkpoint、handoff 与下一次提示词（next session prompt）中的新 mission 名称
- 新增 `development-overview.md`，作为给人理解整个 `devflow` 技能（DevFlow skill）优化过程的总记录
- 不修改 `.codex/skills/devflow/` 正式技能文件

## 任务

- [x] 确认旧 mission 目录存在且新目录不存在
- [x] 将 mission 目录重命名为 `.devflow/devflow-skill-optimization/`
- [x] 将下一次提示词文件重命名为 `NEXT-SESSION-PROMPT-devflow-skill-optimization.md`
- [x] 新增总记录（overall record）
- [x] 更新当前 mission 真相源中的新 slug 与恢复入口
- [x] 搜索旧 slug，确认没有影响恢复的残留引用
- [x] 运行文档级验证
