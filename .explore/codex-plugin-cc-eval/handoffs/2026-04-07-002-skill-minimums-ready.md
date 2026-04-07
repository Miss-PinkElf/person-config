# Handoff - codex-plugin-cc-eval

## 基本信息
- 日期：2026-04-07
- 阶段：路由四恢复后 / 最小 skill 实现已落地
- 任务：为 Codex 代理搜索与抓取落地两个最小 skill，并收敛 JSON 输出协议

## 当前状态总结
本轮已经完成最小落地：两个 proxy skill 已创建，协议、边界和测试 prompt 已写入 `SKILL.md`。

已确认：
1. 本地 Codex companion/setup 正常，`ready: true`，Node/npm/Codex CLI/认证均可用。
2. `codex-plugin-cc` 仍被视为任务委托桥接层，不是 Claude Code 内置 `WebSearch` / `WebFetch` 的等价替换层。
3. 本轮已在仓库中创建：
   - `.claude/skills/codex-websearch-proxy/SKILL.md`
   - `.claude/skills/codex-webfetch-proxy/SKILL.md`
4. 两个 skill 都明确了统一边界：Codex 只负责采集，Claude 负责理解与总结。
5. 两个 skill 都要求 Codex 优先只输出严格 JSON，不允许自然语言解释。

## 本轮已完成内容
- 更新 `.explore/codex-plugin-cc-eval/` 下的：
  - `state.md`
  - `decision-log.md`
  - `learnings.md`
- 新增两个 skill 文件：
  - `codex-websearch-proxy/SKILL.md`
  - `codex-webfetch-proxy/SKILL.md`
- 在 skill 中收敛了 3 类结构：
  - `websearch_result`
  - `webfetch_result`
  - `error`
- 各补了 3 个最小测试 prompt，覆盖正常、空结果/失败、重定向或解析异常等分支。

## 当前协议约束
### WebSearch 成功
- `type = websearch_result`
- 必须包含：`query`、`results[]`、`warnings[]`
- 无结果时返回 `results: []`
- 不允许把“没结果”写成自然语言说明

### WebFetch 成功
- `type = webfetch_result`
- 必须包含：`url`、`final_url`、`title`、`content_type`、`status`、`content_markdown`、`excerpt`、`warnings[]`
- 允许正文截断，但需要写入 `warnings`

### Error
- `type = error`
- `stage` 限制为：`search | fetch | parse`
- 必须包含：`message`、`retryable`
- 失败时只返回结构化 error JSON，不允许解释型自然语言

## 当前未完成项
1. 还没有真实试跑两个 skill。
2. 还没有验证 Codex 是否能稳定遵守“只输出 JSON、不要前后缀说明”的约束。
3. 还没有做脚本化 eval 或自动校验。
4. 还没有决定是否需要总路由 skill。

## 推荐的下一步顺序
1. 先真实试跑 `codex-websearch-proxy` 的 2~3 个测试 prompt。
2. 再真实试跑 `codex-webfetch-proxy` 的 2~3 个测试 prompt。
3. 记录哪些分支最容易漂成自然语言或代码块围栏。
4. 如果有漂移，再收紧 skill 中的执行模板与 Claude 侧消费规则。
5. 结果稳定后，再决定要不要补总路由 skill 或正式 eval。

## 风险与注意事项
- 不要重新回到“能不能彻底替代内置 WebSearch/WebFetch”的论证。
- 当前最重要的是协议稳定性，而不是功能描述的华丽程度。
- 如果试跑时 Codex 输出了 JSON 之外的说明，应该视为协议失败，而不是宽松接收。
- 提交时只应包含 `.explore/codex-plugin-cc-eval/` 和这两个 skill 相关文件，不要误带 `.claude/settings.local.json`。

## 最新相关文件
- `.explore/codex-plugin-cc-eval/state.md`
- `.explore/codex-plugin-cc-eval/decision-log.md`
- `.explore/codex-plugin-cc-eval/learnings.md`
- `.claude/skills/codex-websearch-proxy/SKILL.md`
- `.claude/skills/codex-webfetch-proxy/SKILL.md`

## 立即可执行的第一步
直接开始真实试跑两个 skill，先测 `codex-websearch-proxy` 的“正常结果”和“无结果”分支。