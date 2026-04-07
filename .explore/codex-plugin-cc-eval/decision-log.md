# 决策日志

## 历史决策摘要

（当完整记录超过 5 条时，旧决策压缩到这里）

## 完整记录

### [2026-04-07 01] 先验证本地 Codex 可用性，再评估替代能力
- 原因：如果本地 Codex CLI 或认证不可用，后续关于替代 `WebSearch` / `WebFetch` 的讨论都不成立。
- 影响：先运行 setup，自下而上确认运行前提。

### [2026-04-07 02] 不追求替换内置工具，改做两个 Codex 代理 skill
- 原因：当前 `codex-plugin-cc` 更像任务委托桥接层，不具备等价替换 Claude Code 内置 `WebSearch` / `WebFetch` 的工具语义。
- 影响：后续方向调整为实现 `codex-websearch-proxy` 和 `codex-webfetch-proxy` 两个 skill，让 Codex 只返回结构化采集结果，内容理解留在 Claude Code 主模型中。

### [2026-04-07 03] 先拆两个 skill，再考虑统一总路由
- 原因：WebSearch 与 WebFetch 的输入、输出协议和触发条件不同，先拆开更容易稳定触发和调试结构化返回。
- 影响：下一轮优先分别落地两个 `SKILL.md`，暂不急着做总 skill。
