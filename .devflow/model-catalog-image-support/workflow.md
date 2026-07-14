# 模型目录图片支持与上下文修正工作流（Workflow）

## 当前目标

修正 CC Switch 模型目录（Model Catalog）对现有模型能力的声明：允许图片输入，并把指定模型的上下文窗口（Context Window）更新为用户确认的数值。

## 当前路径

- 路径：轻量路径（Light Path）
- 原因：目标文件唯一、字段明确、无需新增模型或修改应用代码；仅需完成受控 JSON 配置更新与结构校验。

## 当前阶段

- 阶段：已收尾并交接（Close / Handoff）

## 范围

- 范围内：`~/.codex/cc-switch-model-catalog.json` 现有五个模型的图片输入能力声明，以及指定上下文窗口字段。
- 范围外：新增 `gpt-5.5`、变更模型列表、重建完整目录、修改 CC Switch 应用代码、校验上游服务真实可用性。

## 成功标准

1. 现有五个模型均声明支持文本与图片输入。
2. `gpt-5.6-terra`、`gpt-5.6-sol` 为 300,000；`gpt-5.4` 为 1,000,000；`grok-4.5` 保持 500,000。
3. 配置仍为可解析的 JSON（JavaScript Object Notation）。
4. 输出逐模型的能力与上下文窗口汇总，供人工复核。

## 下一步

下次恢复先读取 `state.md`、`checkpoints.md` 和最新 handoff；用户重启或重新加载 CC Switch 后测试图片请求，若出现新报错则进入调试（Debugging）路径。
