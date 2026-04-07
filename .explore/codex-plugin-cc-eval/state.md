# 当前状态

## 当前阶段
- 路由四收尾：最小 proxy skill 已落地、已试跑、已进入休息前交接

## 已确认的事实
- 用户已安装并重载 Codex 插件。
- `codex-companion.mjs setup --json` 返回 `ready: true`。
- 本地环境中 Node、npm、Codex CLI、认证状态均可用。
- 已存在 mission 目录 `.explore/codex-plugin-cc-eval/`，本轮直接续写而非重建。
- 当前探索目标聚焦于：让 Codex 插件抓取 `openai/codex-plugin-cc`，并评估其是否能承担 `WebSearch` / `WebFetch` 的替代角色。
- 已形成当前结论：`codex-plugin-cc` 更适合作为 Codex 任务委托桥接层，不能等价替代 Claude Code 内置 `WebSearch` / `WebFetch`，但可作为旁路或部分替代方案。
- 用户已确认下一步方向：不做底层替换，改为新增两个 skill，分别代理 WebSearch 与 WebFetch，让 Codex 返回结构化结果，内容理解仍由 Claude Code 主模型负责。
- 当前仓库内已落地两个最小 skill 文件：`codex-websearch-proxy/SKILL.md` 与 `codex-webfetch-proxy/SKILL.md`。

## 工作假设
- 两个独立 skill（`codex-websearch-proxy` / `codex-webfetch-proxy`）比一个总路由 skill 更容易控制触发与输出协议。
- Codex 更适合承担“数据采集层”，Claude 更适合承担“理解与综合层”。
- skill 输出需要强约束为结构化 JSON，避免 Codex 自行解释内容，降低后续解析漂移。

## 待解决的问题
- 两个 skill 内部应如何调用 Codex：直接走 `codex:rescue` 工作流描述，还是进一步抽象成固定任务模板。
- 需要做一次真实试跑，验证 Codex 是否能稳定遵守“只输出 JSON、无前后缀说明”的约束。
- 是否需要为两个 skill 配套更正式的 eval 或脚本化验证。
- 是否还要补一个总路由 skill，统一在 search / fetch 间分发。

## 下一步
- 下轮优先补一层 Claude 侧宽松 schema 兼容约定，尤其是 `webfetch_result` 中 `content` / `links` 等字段变体的消费方式。
- 再决定是补脚本化 smoke test / 正式 eval，还是做一个统一总路由 skill。
- 如继续 OpenClaw 方向，可直接协助执行安装并验证 `onboard / gateway status / dashboard`。
- 如再次遇到 401，优先排查底层 Codex 运行时或令牌状态，而不是先怀疑 skill 文案。

## 最新 handoff
- `handoffs/2026-04-07-003-rest-ready.md`

## 最小活跃上下文摘要
- 当前已经完成可行性判断、skill 落地与真实试跑；`codex-websearch-proxy`、`codex-webfetch-proxy` 都已达到“先可用”的状态。
- 下轮重点是稳定性与兼容性收敛，不要再回到“能不能完全替代内置 WebSearch/WebFetch”的讨论。
