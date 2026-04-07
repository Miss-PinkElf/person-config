# 当前状态

## 当前阶段
- 路由四：handoff / resume

## 已确认的事实
- 用户已安装并重载 Codex 插件。
- `codex-companion.mjs setup --json` 返回 `ready: true`。
- 本地环境中 Node、npm、Codex CLI、认证状态均可用。
- 已存在 mission 目录 `.explore/codex-plugin-cc-eval/`，本轮直接续写而非重建。
- 当前探索目标聚焦于：让 Codex 插件抓取 `openai/codex-plugin-cc`，并评估其是否能承担 `WebSearch` / `WebFetch` 的替代角色。
- 已形成当前结论：`codex-plugin-cc` 更适合作为 Codex 任务委托桥接层，不能等价替代 Claude Code 内置 `WebSearch` / `WebFetch`，但可作为旁路或部分替代方案。
- 用户已确认下一步方向：不做底层替换，改为新增两个 skill，分别代理 WebSearch 与 WebFetch，让 Codex 返回结构化结果，内容理解仍由 Claude Code 主模型负责。
- 当前仓库内尚未真正落地 skill 文件；只创建过目录尝试，未形成可提交的 `SKILL.md` 实现。

## 工作假设
- 两个独立 skill（`codex-websearch-proxy` / `codex-webfetch-proxy`）比一个总路由 skill 更容易控制触发与输出协议。
- Codex 更适合承担“数据采集层”，Claude 更适合承担“理解与综合层”。
- skill 输出需要强约束为结构化 JSON，避免 Codex 自行解释内容，降低后续解析漂移。

## 待解决的问题
- 两个 skill 的 `description`、触发条件与边界如何写得足够稳定。
- 两个 skill 内部应如何调用 Codex：直接走 `codex:rescue` 工作流描述，还是进一步抽象成固定任务模板。
- WebSearch 结果和 WebFetch 结果的 JSON 协议字段最终版如何定。
- 是否需要为两个 skill 配套 eval，用于验证结构化输出稳定性。

## 下一步
- 落地 `codex-websearch-proxy/SKILL.md`。
- 落地 `codex-webfetch-proxy/SKILL.md`。
- 为两个 skill 各补 2~3 个测试场景，验证结构化输出和失败分支。
- 如结果稳定，再决定是否增加一个总路由 skill 或进一步优化触发描述。

## 最新 handoff
- `handoffs/2026-04-07-001-resume-ready.md`

## 最小活跃上下文摘要
- 当前已经完成可行性判断，下一轮不要再重复论证“能不能完全替代内置 WebSearch/WebFetch”。
- 下次应直接进入两个代理 skill 的设计与实现，重点放在输出协议、触发条件、失败格式与最小 eval。
