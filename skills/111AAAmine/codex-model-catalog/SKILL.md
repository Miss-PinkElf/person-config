---
name: codex-model-catalog
description: 维护 Codex 项目的模型目录（Model Catalog）。当用户要添加、更新或排查自定义模型（Custom Model）元数据、刷新官方模型目录、设置上下文窗口（Context Window）或图片输入（Image Input）能力时使用。
---

# Codex 模型目录维护

## 原则

- `model_catalog_json` 是覆盖而非追加；每次更新先运行刷新脚本获取完整官方目录，再写入自定义模型。
- 将 `model_provider` 与认证保留在用户级 `~/.codex/config.toml`；项目 `.codex/config.toml` 仅设置模型和目录路径。
- 将模型标识、上下文窗口和输入模态按中转服务实际能力填写；配置不会突破服务端限制。

## 添加或刷新模型

在项目根目录运行：

```bash
bash <skill-dir>/scripts/refresh-model-catalog.sh \
  --model grok-4.5 \
  --context-window 500000 \
  --input-modalities text,image
```

脚本从项目外执行 `codex debug models`，取得当前官方目录，追加或更新目标模型，并原子写入 `.codex/model-catalog.json`。

项目 `.codex/config.toml` 使用：

```toml
model = "grok-4.5"
model_catalog_json = "model-catalog.json"
```

## 验证

运行 `codex debug models`，确认模型的 `slug`、`context_window` 和 `input_modalities` 已出现。若命令在 JSON 前输出警告，过滤到首个 `{` 后再交给 `jq`。重启 Codex 后让新会话加载配置。
