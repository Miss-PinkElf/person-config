# DevFlow 技能（DevFlow Skill）优化 Mission 工作流

## Mission 信息

- Mission 标识（Mission Slug）：`devflow-skill-optimization`
- 当前路径（Current Route）：重型路径（Heavy Route）
- 当前阶段（Current Stage）：Close
- 当前状态（Current Status）：已完成 `devflow` 技能（DevFlow skill）上下文预算规则落地，并让 `devflow-handoff.md` 在保持原本单一交接流程的前提下适配新的记录边界；当前等待用户决定是否提交代码

## 当前目标

围绕 `devflow` 技能（DevFlow skill）的真实使用问题，持续优化其触发、阶段门禁、记录、恢复、上下文预算（context budget）与长期维护机制。

## 范围

- 优化 `devflow` 技能（skill）的触发描述、阶段门禁、记录规则与恢复机制
- 明确计划（Plan）与规格（Spec）边界
- 补充可执行检查锚点，降低流程被跳过的概率
- 同步更新相关参考文档（references）
- 设计恢复热路径（resume hot path）与总记录（overall record）的边界，降低长期任务的 token 消耗

## 成功标准

1. 每轮优化都先完成对齐（Align）与计划（Plan），再进入实施（Apply）
2. 关键设计、决策与验证证据都能在当前 mission 中追溯
3. 恢复默认读取文件保持短小，不随项目扩大无限增长
4. 开发总览能帮助人理解整个需求和项目演进过程
5. 正式修改具备可执行验证（Verify）证据与 checkpoint

## 下一步

1. 先确认是否需要提交代码
2. 如果不提交，继续观察真实使用中的触发与交接表现
3. 如果继续优化，优先决定是否扩展到子 skill 或评测资产
