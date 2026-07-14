# 问题清单（Bug Log）

## 2026-07-14：本地模型目录阻断图片输入

- 问题现象：CC Switch 在向 `gpt-5.6-terra` 附带图片时显示 `Model gpt-5.6-terra does not support image inputs. Remove images or switch models.`，请求未发送至上游服务。
- 问题原因：`~/.codex/cc-switch-model-catalog.json` 将现有模型的 `input_modalities` 声明为仅 `text`，且 `supports_image_detail_original` 为 `false`，触发客户端能力校验（Capability Validation）。
- 解决方案：将五个现有模型的输入模态更新为 `text` 与 `image`，并开启原始图片详情支持；用独立 JSON 解析与断言校验。同步修正用户指定模型的上下文窗口。
- 验证结果：本地目录结构与目标字段校验通过。上游服务端实际图片接收能力尚待用户在 CC Switch 中验证。
