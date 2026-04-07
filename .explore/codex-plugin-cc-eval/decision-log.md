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

### [2026-04-07 04] 先固定最小 JSON 契约，再优化触发描述
- 原因：如果返回格式先天不稳，后续无论 skill 提示词还是总路由封装都会持续返工；应先收敛成功、空结果和失败三类输出。
- 影响：本轮优先固定 `websearch_result`、`webfetch_result`、`error` 三种类型，以及 `warnings` / `results` 的空值约定。

### [2026-04-07 05] 失败分支统一走结构化 error，且限制 stage 枚举
- 原因：Claude 侧后续消费最怕“半结构化失败描述”；限制为 `search | fetch | parse` 更利于后续分支处理。
- 影响：两个 proxy skill 都必须禁止输出解释型自然语言；失败时仅返回 `error` JSON。

### [2026-04-07 06] 当前阶段先追求“能返回值”，不急于强卡严格 shape
- 原因：用户当前更关注旁路能力先跑通，只要 Codex 能返回可消费的结构化结果，就有继续迭代价值；过早收紧契约会拖慢推进。
- 影响：本轮试跑以“是否成功返回结构化结果、是否可被 Claude 消费”为主，字段完整性和最终 schema 收敛后置。
