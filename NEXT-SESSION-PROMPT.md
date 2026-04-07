# Next Session Prompt

请继续当前关于 `codex-plugin-cc` 与 Codex 代理 skill 的任务，并直接基于仓库中的记录继续，不要从头重复论证“能不能完全替代 Claude Code 内置 `WebSearch` / `WebFetch`”。这个结论已经有了。

先按这个顺序读取：

1. `.explore/codex-plugin-cc-eval/state.md`
2. `.explore/codex-plugin-cc-eval/handoffs/index.md`
3. `.explore/codex-plugin-cc-eval/handoffs/2026-04-07-001-resume-ready.md`
4. `.explore/codex-plugin-cc-eval/decision-log.md`
5. `.explore/codex-plugin-cc-eval/learnings.md`

当前已确认事实：

- 本地 Codex companion/setup 正常，`ready: true`，Node/npm/Codex CLI/认证都可用。
- `codex-plugin-cc` 更像 Claude Code → Codex 的任务委托桥接层，不是内置工具替换层。
- 它不能等价替代 Claude Code 的 `WebSearch` / `WebFetch`，但可以作为旁路或部分替代方案。
- 已经决定下一步不追求底层替换，而是新增两个 skill：
  - `codex-websearch-proxy`
  - `codex-webfetch-proxy`
- 这两个 skill 的目标是：把搜索/抓取请求委托给 Codex，并强约束 Codex 只返回结构化结果；内容理解、筛选、总结仍由 Claude Code 主模型负责。

下轮优先目标：

1. 设计并确认两个 skill 的最小 JSON 协议：
   - `websearch_result`
   - `webfetch_result`
   - `error`
2. 创建这两个目录下的 `SKILL.md`：
   - `.claude/skills/codex-websearch-proxy/SKILL.md`
   - `.claude/skills/codex-webfetch-proxy/SKILL.md`
3. 明确它们的触发条件、边界与输出约束：
   - Codex 只负责采集
   - 不允许返回解释型自然语言
   - 优先返回严格 JSON
4. 各补 2~3 个测试 prompt，用来验证结构化输出是否稳定，尤其是失败分支。

建议输出协议草案：

## WebSearch

```json
{
  "type": "websearch_result",
  "query": "openclaw 用法",
  "results": [
    {
      "title": "...",
      "url": "...",
      "snippet": "...",
      "source": "...",
      "rank": 1
    }
  ],
  "warnings": []
}
```

## WebFetch

```json
{
  "type": "webfetch_result",
  "url": "https://...",
  "final_url": "https://...",
  "title": "...",
  "content_type": "text/html",
  "status": 200,
  "content_markdown": "...",
  "excerpt": null,
  "warnings": []
}
```

## Error

```json
{
  "type": "error",
  "stage": "search_or_fetch",
  "message": "...",
  "retryable": true
}
```

输出要求：

- 先给出简洁方案和 skill 设计，再开始写文件。
- 不要重复大段可行性分析。
- 优先更新 `.explore/codex-plugin-cc-eval/` 下的记录。
- 如果开始实现，只提交和这两个 skill / handoff / prompt 相关的文件，不要误带 `.claude/settings.local.json`。
