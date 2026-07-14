# 模型目录图片支持与上下文修正对齐文档（Align Doc）

## 背景

CC Switch 模型目录（Model Catalog）文件 `~/.codex/cc-switch-model-catalog.json` 中的全部现有模型仅声明了文本输入，因此客户端在附带图片时提前报错：`Model gpt-5.6-terra does not support image inputs. Remove images or switch models.`

本次目标是修正本地目录中的能力元数据（Capability Metadata），使客户端允许向已列出的模型传递图片，同时将用户指定模型的上下文窗口（Context Window）声明更新为正确数值。

## 已确认范围

### 范围内

1. 仅修改现有五个目录条目：`gpt-5.6-terra`、`gpt-image-2`、`grok-4.5`、`gpt-5.4`、`gpt-5.6-sol`。
2. 所有现有条目均将 `input_modalities` 设为 `["text", "image"]`，并把 `supports_image_detail_original` 设为 `true`。
3. 同步更新 `context_window` 与 `max_context_window`：
   - `gpt-5.6-terra`：300,000
   - `gpt-5.6-sol`：300,000
   - `gpt-5.4`：1,000,000
   - `grok-4.5`：500,000（保持不变）
4. 用 JSON 解析与字段汇总验证修改结果。

### 范围外

- 不新增 `gpt-5.5`。
- 不调整模型优先级（priority）、推理级别（reasoning levels）、工具支持（tool support）或其他未指明字段。
- 不修改 CC Switch 应用程序，也不验证各上游模型实际是否接受图片。

## 方案比较

### 方案 A：最小目录修正（推荐）

仅更新图片输入能力（Image Input Capability）及明确指定的上下文窗口字段。

- 优点：改动范围最小，不会覆盖已有自定义元数据；可直接消除本地能力检查造成的当前错误。
- 缺点：若上游模型本身拒绝图片，错误将由上游服务返回。

### 方案 B：完整重建目录

重新生成全部模型、工具和推理能力字段。

- 优点：看似可一次性补齐元数据。
- 缺点：缺少可靠目录来源，可能错误覆盖当前定制字段，明显超出本轮范围。

### 方案 C：仅按逐模型上游验证后开放图片

逐个确认上游能力后，选择性增加图片输入。

- 优点：目录与上游能力可能更严格一致。
- 缺点：不能立即实现“现有模型都支持图片”的已确认目标。

**结论：采用方案 A。**

## 实施设计

1. 保留每个模型原有字段与排序，只改两类能力字段和指定窗口字段。
2. 对所有现有模型写入：

```json
{
  "input_modalities": ["text", "image"],
  "supports_image_detail_original": true
}
```

3. 在指定模型中同步写入相同窗口值，确保 `context_window` 与 `max_context_window` 一致。
4. 配置文件位于工作区外；实施时必须先取得对 `~/.codex/cc-switch-model-catalog.json` 的写入授权。
5. 验证采用只读 Python（Python）脚本解析 JSON，并打印每个模型的 `slug`、输入模态、图片详情支持与两个窗口值。

## 验收标准

- JSON 解析成功。
- 当前五个模型的输入模态均包含 `image`。
- 当前五个模型的 `supports_image_detail_original` 均为 `true`。
- 指定模型的窗口数值与本文件“已确认范围”一致。
- 不出现 `gpt-5.5` 新条目。

## 风险与回退

- 风险：目录声明改变的是客户端校验，不能证明上游服务一定支持图片。
- 回退：若需要恢复，可将该文件中的图片字段改回 `input_modalities: ["text"]` 和 `supports_image_detail_original: false`，并恢复修改前窗口值；实施前将先在同目录创建带时间戳的备份文件。
