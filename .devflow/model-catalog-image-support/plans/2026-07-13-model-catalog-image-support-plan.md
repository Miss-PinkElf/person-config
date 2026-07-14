# 模型目录图片支持与上下文修正实施计划（Implementation Plan）

> **面向执行代理：** 必须按轻量任务（Light Tasks）逐项执行；每项任务完成后记录证据。用户已明确要求本计划完成后直接进入实施（Apply）。

**目标（Goal）：** 修正 CC Switch 模型目录（Model Catalog）中现有五个模型的图片输入声明，并把指定模型的上下文窗口（Context Window）更新为用户确认的数值。

**架构（Architecture）：** 本次不修改应用代码，只对单个 JSON 配置（JSON Configuration）做定点字段更新。更新脚本先验证模型集合、创建同目录备份，再保留原有字段并修改 `input_modalities`、`supports_image_detail_original`、`context_window`、`max_context_window`；随后用独立读取校验确认结果。

**技术栈（Tech Stack）：** Python（标准库 `json`、`pathlib`、`datetime`）、CC Switch 外部 JSON 配置。

---

## 背景

本地模型目录把全部模型声明为仅支持文本，导致 CC Switch 在图片进入请求前就阻断并报 `gpt-5.6-terra does not support image inputs`。用户已确认使用最小目录修正方案、不要新增 `gpt-5.5`，并要求本计划后直接实施。

## 目标与验收

1. 五个现有条目都具有 `input_modalities: ["text", "image"]`。
2. 五个现有条目都具有 `supports_image_detail_original: true`。
3. `gpt-5.6-terra` 与 `gpt-5.6-sol` 的两个窗口字段均为 300,000。
4. `gpt-5.4` 的两个窗口字段均为 1,000,000。
5. `grok-4.5` 的两个窗口字段均为 500,000。
6. 不出现新增的 `gpt-5.5`，JSON 可独立解析。

## 文件结构与职责

- 修改：`~/.codex/cc-switch-model-catalog.json`——唯一受控目标，保存模型能力和窗口声明。
- 创建：`~/.codex/cc-switch-model-catalog.json.bak-<UTC 时间戳>`——修改前不可覆盖的备份。
- 创建：`.devflow/model-catalog-image-support/plans/2026-07-13-model-catalog-image-support-light-tasks.md`——任务状态与验收记录。
- 更新：`.devflow/model-catalog-image-support/state.md`、`.devflow/model-catalog-image-support/workflow.md`、`.devflow/model-catalog-image-support/decision-log.md`——记录阶段和验证结果。

## 已确认约束

- 不新增模型，不修改 `priority`、`slug`、推理能力（Reasoning Capability）或工具能力（Tool Capability）。
- 配置文件在工作区外；写入前需取得外部路径写入授权。
- 本地能力目录只解除客户端前置拦截，不能作为上游服务实际图片能力的证明。
- 不执行 Git 提交（Git Commit），除非用户在修改完成后另行明确许可。

## 方案与取舍

采用最小目录修正（Minimal Catalog Correction）：原地更新现有条目的指定字段，并保留所有未指定字段。放弃目录重建和新增模型方案，以避免覆盖自定义元数据或扩大本轮范围。

## 风险与处理

- 若目标文件结构与此前读取内容不一致，脚本在写入前因模型集合缺失而失败，不会写入文件。
- 若写入中断，使用同目录时间戳备份恢复。
- 若 JSON 校验失败，停止并报告实际错误，不继续重试猜测。

## 下一阶段入口条件

- 用户已审阅并确认对齐文档与本计划后直接实施。
- 当前用户指令已明确授权按计划进入 Apply。
- 外部配置文件写入操作仍需通过运行环境的单次授权。
