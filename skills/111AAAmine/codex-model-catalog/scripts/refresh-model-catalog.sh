#!/usr/bin/env bash
set -euo pipefail

catalog_path=".codex/model-catalog.json"
model=""
context_window=""
input_modalities="text"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --catalog) catalog_path="$2"; shift 2 ;;
    --model) model="$2"; shift 2 ;;
    --context-window) context_window="$2"; shift 2 ;;
    --input-modalities) input_modalities="$2"; shift 2 ;;
    *) echo "未知参数：$1" >&2; exit 2 ;;
  esac
done

[[ -n "$model" && -n "$context_window" ]] || { echo "必须提供 --model 和 --context-window" >&2; exit 2; }
command -v codex >/dev/null || { echo "未找到 codex" >&2; exit 1; }
command -v jq >/dev/null || { echo "未找到 jq" >&2; exit 1; }

temporary_directory="$(mktemp -d)"
temporary_catalog="$(mktemp "${TMPDIR:-/tmp}/model-catalog.XXXXXX")"
trap 'rm -rf "$temporary_directory" "$temporary_catalog"' EXIT

(cd "$temporary_directory" && codex debug models 2>/dev/null) | jq \
  --arg model "$model" \
  --argjson context_window "$context_window" \
  --argjson input_modalities "$(jq -cn --arg values "$input_modalities" '$values | split(",")')" \
  '(.models[0]) as $template
   | ($template
      | .slug = $model
      | .display_name = $model
      | .description = $model
      | .context_window = $context_window
      | .max_context_window = $context_window
      | .input_modalities = $input_modalities
      | .priority = 10000
      | .visibility = "list") as $custom
   | .models = ([.models[] | select(.slug != $model)] + [$custom])' > "$temporary_catalog"

mkdir -p "$(dirname "$catalog_path")"
mv "$temporary_catalog" "$catalog_path"
trap - EXIT
echo "已写入 ${catalog_path}：${model}，${context_window} tokens，${input_modalities}"
