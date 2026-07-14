# 模型目录图片支持与上下文修正轻量任务（Light Tasks）

## 任务 1：备份并定点更新外部模型目录

- [x] 使用 Python（Python）读取 `~/.codex/cc-switch-model-catalog.json`。
- [x] 校验目录中的模型集合至少包含 `gpt-5.6-terra`、`gpt-image-2`、`grok-4.5`、`gpt-5.4`、`gpt-5.6-sol`；缺少任一条目即停止，不写入。
- [x] 在同目录创建时间戳备份 `cc-switch-model-catalog.json.bak-<UTC 时间戳>`。
- [x] 对上述五个模型设置：

```json
{
  "input_modalities": ["text", "image"],
  "supports_image_detail_original": true
}
```

- [x] 对 `gpt-5.6-terra`、`gpt-5.6-sol` 将 `context_window` 和 `max_context_window` 设置为 `300000`。
- [x] 对 `gpt-5.4` 将 `context_window` 和 `max_context_window` 设置为 `1000000`。
- [x] 对 `grok-4.5` 将 `context_window` 和 `max_context_window` 设置为 `500000`。
- [x] 将格式化后的 JSON 写回原文件；不修改其他字段。

**验收点：** 更新命令以退出码 0 结束，输出备份路径和五个模型的修改后摘要。

## 任务 2：独立解析与需求核验

- [x] 用新的只读 Python 进程加载修改后的 JSON。
- [x] 逐个断言五个模型的输入模态均包含 `text` 与 `image`，且图片详情字段为 `true`。
- [x] 断言四个指定模型的两个窗口字段分别等于 300,000、300,000、1,000,000、500,000。
- [x] 断言 `models` 中不存在 `slug: "gpt-5.5"`。
- [x] 输出逐模型汇总和“所有断言通过”标记。

**验收点：** 校验命令以退出码 0 结束，且所有断言通过。

## 收尾记录

- [x] 将任务状态、备份文件名与验证证据回写至 mission 状态（State）和工作流（Workflow）文档。
- [x] 不执行 Git 提交；修改完成后询问用户是否需要提交工作区内的 devflow 文档。

## 执行证据（2026-07-14）

- 备份：`~/.codex/cc-switch-model-catalog.json.bak-20260714T091900Z`。
- 写入：目标配置已以原子替换方式写回。
- 独立验证：新的 Python 进程成功解析 JSON，并对全部图片能力、四个指定窗口值和“不存在 `gpt-5.5`”执行断言；输出为“所有断言通过”。
