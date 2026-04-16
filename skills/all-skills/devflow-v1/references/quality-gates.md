# 质量门禁

## 对齐门禁

- 重型路径必须完整 Align
- 轻量路径也必须至少做一次 Mini Align
- 不允许跳过对齐直接进入 Apply

## 计划门禁

- 重型路径必须有 `plan`
- 轻量路径也必须有最小 plan
- 没有 plan，不进入正式实施

## 实施门禁

- Apply 前必须具备任务定义
- 重型路径依赖 `spec/tasks.md`
- 轻量路径依赖轻量 `tasks`
- 如果实施中暴露设计缺陷，停止并回退

## 调试门禁

- bug 必须先进 `superpowers-systematic-debugging`
- 根因未知时不允许猜改
- 连续 3 次修复失败后，必须质疑设计或方案

## 审查门禁

- 有意义的里程碑后要做 review
- 若 review 涉及设计变化，回退到 Propose

## 验证门禁

- 完成前必须进入 `superpowers-verification-before-completion`
- 必须运行实际验证
- 必须用新鲜证据支撑完成结论
