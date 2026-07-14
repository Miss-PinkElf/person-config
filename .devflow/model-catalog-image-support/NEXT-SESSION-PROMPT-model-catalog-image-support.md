# 下次会话提示词：模型目录图片支持与上下文修正

请继续 `.devflow/model-catalog-image-support/` mission。

## 当前进度

- 外部配置 `~/.codex/cc-switch-model-catalog.json` 已更新：五个现有模型均声明支持图片输入（Image Input）。
- `gpt-5.6-terra`、`gpt-5.6-sol` 为 300k，`gpt-5.4` 为 1m，`grok-4.5` 为 500k。
- JSON（JavaScript Object Notation）已由独立 Python（Python）进程解析并完成全部断言。
- 备份：`~/.codex/cc-switch-model-catalog.json.bak-20260714T091900Z`。

## 未完成事项

1. 请先让用户重启或重新加载 CC Switch 的模型目录（Model Catalog）。
2. 使用图片实际测试目标模型。
3. 若仍失败，记录完整错误文本并进入调试（Debugging）路径；不要在没有错误证据时修改其他字段。
4. 若测试成功，写入运行时验证证据并关闭 mission。

## 恢复阅读顺序

1. `.devflow/model-catalog-image-support/state.md`
2. `.devflow/model-catalog-image-support/checkpoints.md`
3. `.devflow/model-catalog-image-support/handoffs/2026-07-14-001-configuration-update.md`
4. 需要回顾方案时读 `plans/` 与 `decision-log.md`。
5. 需要追溯问题根因时读 `bug-log.md` 与 `learnings.md`。

## 范围提醒

- 不新增 `gpt-5.5`。
- 不改模型优先级（priority）、工具支持（Tool Support）或推理能力（Reasoning Capability），除非用户提供新的明确需求。
- 本地目录支持不等于上游服务端已确认支持图片。
