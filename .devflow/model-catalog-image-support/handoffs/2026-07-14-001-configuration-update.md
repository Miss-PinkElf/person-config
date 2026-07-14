# 模型目录图片支持与上下文修正交接（Handoff）

## 当前状态

当前 mission 已完成轻量路径（Light Path）的配置更新、独立结构验证和文档收尾。外部模型目录已修改，但本对话尚未验证 CC Switch 运行时向上游发送图片请求的结果。

## 当前目标

确保 CC Switch 模型目录（Model Catalog）不再因错误的本地能力声明而阻断现有五个模型的图片输入，并保留用户指定的上下文窗口（Context Window）数值。

## 本轮完成内容

1. 定位外部配置：`~/.codex/cc-switch-model-catalog.json`。
2. 修改现有五个模型：`gpt-5.6-terra`、`gpt-image-2`、`grok-4.5`、`gpt-5.4`、`gpt-5.6-sol`。
3. 全部五个模型设置为：
   - `input_modalities: ["text", "image"]`
   - `supports_image_detail_original: true`
4. 上下文窗口已写入：
   - `gpt-5.6-terra`：300,000
   - `gpt-5.6-sol`：300,000
   - `gpt-5.4`：1,000,000
   - `grok-4.5`：500,000
5. 没有新增 `gpt-5.5`。
6. 已创建备份：`~/.codex/cc-switch-model-catalog.json.bak-20260714T091900Z`。
7. 新的独立 Python（Python）进程已成功解析 JSON（JavaScript Object Notation），并对上述所有目标字段执行断言，结果为“所有断言通过”。

## 关键决策

- 采用最小目录修正（Minimal Catalog Correction），仅修改图片能力和明确指定的窗口字段，不重建目录或修改其他能力字段。
- 本地目录修正只解除客户端能力校验（Capability Validation）；不将其误报为上游服务端实际支持图片的证据。
- 不新增 `gpt-5.5`，因为用户明确要求不新增。

## 未完成内容与开放问题

1. 用户尚未在 CC Switch 重启或重新加载模型目录后发送真实图片请求。
2. 上游服务端是否接受每个模型的图片输入未知；若失败，应收集完整错误文本，而不要继续基于本地目录猜测。
3. 未发现需明确延期的产品功能；唯一待验证事项是运行时测试。

## 关键文件

- 对齐文档：`plans/2026-07-13-model-catalog-image-support-align.md`
- 实施计划：`plans/2026-07-13-model-catalog-image-support-plan.md`
- 任务与证据：`plans/2026-07-13-model-catalog-image-support-light-tasks.md`
- 问题清单：`bug-log.md`
- 经验记录：`learnings.md`
- 当前状态：`state.md`
- 检查点：`checkpoints.md`

## 恢复指引

1. 先读取 `state.md` 和 `checkpoints.md`。
2. 再读取本文件，确认本地配置已完成且已有备份。
3. 让用户重启或重新加载 CC Switch，然后用图片请求测试目标模型。
4. 若请求成功，记录运行时验证证据并关闭 mission。
5. 若请求失败，保存原始错误；只有在原因不明确时，创建或更新问题清单并转入调试（Debugging）路径。
