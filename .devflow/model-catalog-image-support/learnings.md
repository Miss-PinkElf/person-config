# 经验记录（Learnings）

## 2026-07-14：模型目录声明会在请求前阻断能力

- 本地模型目录（Model Catalog）的 `input_modalities` 与 `supports_image_detail_original` 属于客户端前置校验（Preflight Validation）依据；错误声明会在请求到达上游前直接阻断图片输入。
- 调整这类外部用户配置时，应先校验目标模型集合、创建同目录备份、保留未指定字段，并以独立进程重新解析 JSON（JavaScript Object Notation）。
- 本地声明通过不等同于上游服务端能力可用；后续问题必须记录实际接口返回错误后再进入调试（Debugging）。
