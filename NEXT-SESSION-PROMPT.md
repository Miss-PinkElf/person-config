# Next Session Prompt

请继续当前关于 `codex-plugin-cc` / Codex 代理 skill / OpenClaw 验证的任务，并直接基于仓库中的记录继续，不要从头重复论证“能不能完全替代 Claude Code 内置 `WebSearch` / `WebFetch`”。这个结论已经有了。

先按这个顺序读取：

1. `.explore/codex-plugin-cc-eval/state.md`
2. `.explore/codex-plugin-cc-eval/handoffs/index.md`
3. `.explore/codex-plugin-cc-eval/handoffs/2026-04-07-003-rest-ready.md`
4. `.explore/codex-plugin-cc-eval/decision-log.md`
5. `.explore/codex-plugin-cc-eval/learnings.md`

当前已确认事实：

- 本地 Codex companion/setup 曾返回 `ready: true`，Node/npm/Codex CLI/认证前提基本可用。
- `codex-plugin-cc` 更像 Claude Code → Codex 的任务委托桥接层，不是内置工具替换层。
- 它不能等价替代 Claude Code 的 `WebSearch` / `WebFetch`，但可以作为旁路或部分替代方案。
- 已落地两个最小代理 skill：
  - `.claude/skills/codex-websearch-proxy/SKILL.md`
  - `.claude/skills/codex-webfetch-proxy/SKILL.md`
- 经过真实试跑，这两个 skill 当前都已经达到“先可用”的状态。
- 当前阶段用户接受的标准是：优先先能成功返回结构化、可消费结果，不急于一开始就强卡严格最终 schema。
- 已用 `codex-websearch-proxy` 实际搜索过 `openclaw 用法`，结果能命中 OpenClaw 官方文档与官方仓库。
- 已用 `codex-webfetch-proxy` 抓取过 OpenClaw 官方安装页与入门页，并基于抓取结果给出过安装建议。
- 期间出现过一次 `401 Unauthorized`，但后续复测已证明这不是两个 skill 文案本身必然导致的问题，更可能是底层 Codex 运行时、远端网关或会话令牌的偶发状态问题。

下轮优先目标：

1. 优先补一层 Claude 侧宽松 schema 兼容约定，尤其是 `webfetch_result` 中的变体字段：
   - `content_markdown` / `content`
   - `warnings` 可选或缺省
   - `links` 等附加字段
2. 再决定下一步是：
   - 补脚本化 smoke test / 正式 eval
   - 还是做一个统一总路由 skill
3. 如果继续 OpenClaw 方向，可直接协助用户执行安装，并验证：
   - `openclaw onboard --install-daemon`
   - `openclaw gateway status`
   - `openclaw dashboard`
4. 如果再次遇到 401，不要先怀疑 skill 文案，优先排查底层 Codex 运行时 / 远端网关 / 令牌状态。

输出要求：

- 先给出简洁现状判断和下一步建议，再开始修改文件。
- 不要重复大段可行性分析。
- 优先更新 `.explore/codex-plugin-cc-eval/` 下的记录。
- 如果提交代码，只提交和这两个 skill / `.explore` 记录 / `NEXT-SESSION-PROMPT.md` 相关的文件，不要误带 `.claude/settings.local.json`。
