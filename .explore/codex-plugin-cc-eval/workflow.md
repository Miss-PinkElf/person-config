# 任务工作流

## 任务目标
- 使用已安装的 Codex 插件/运行时抓取并理解 `openai/codex-plugin-cc` 仓库。
- 评估是否可以把当前 Claude Code 中原本依赖 `WebSearch` / `WebFetch` 的部分能力委托给 Codex。
- 记录可行路径、限制、风险和后续建议。

## 范围边界
- 范围内：检查本地 Codex 插件可用性、阅读插件实现/说明、通过 Codex 获取目标仓库信息、评估网页抓取/搜索替代能力。
- 范围外：修改 Claude Code 内置工具实现；真的替换内置 `WebSearch` / `WebFetch`；发布新插件。

## 成功标准
- 明确 Codex 插件当前是否可用、如何调用。
- 明确 `openai/codex-plugin-cc` 仓库可通过何种方式被 Codex 读取/分析。
- 给出“能否替代”“能替代到什么程度”“缺什么”的结论。

## 阶段规划
1. 检查本地 Codex 插件与运行时状态。
2. 读取插件实现与调用入口。
3. 用 Codex 抓取并分析 `openai/codex-plugin-cc`。
4. 评估对 `WebSearch` / `WebFetch` 的替代可能性并沉淀结论。

## 当前阶段
- 路由四：handoff / resume（已完成探索结论沉淀，准备下次继续 skill 实现）。

## 退出条件
- 已形成当前阶段结论并写入 `state.md`、`decision-log.md`、`learnings.md`。
- 已生成 handoff，并在 `NEXT-SESSION-PROMPT.md` 中提供可直接续接的提示词。
