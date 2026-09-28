#!/usr/bin/env bash
#
# 安装 Codex 模型探测：流式反向代理 + hooks 告警
#
# 默认是「演练模式」，只打印将要做什么，不做任何改动。
# 确认无误后加 --apply 才真正执行：
#
#     ./install.sh            # 演练
#     ./install.sh --apply    # 实际安装
#
set -euo pipefail

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

SRC="$(cd "$(dirname "$0")" && pwd)"
PROBE_DIR="$HOME/.codex-probe"
CODEX_DIR="$HOME/.codex"

say()  { printf '%s\n' "$*"; }
act()  { if [ "$APPLY" = 1 ]; then eval "$*"; else say "    [演练] $*"; fi; }

if [ "$APPLY" = 1 ]; then
  say "==> 实际安装 Codex 模型探测"
else
  say "==> 演练模式（不写入任何文件）。确认后用 ./install.sh --apply 执行。"
fi
say ""

say "[1/2] 脚本 -> $PROBE_DIR/"
act "mkdir -p '$PROBE_DIR'"
act "install -m 755 '$SRC/probe_proxy.py' '$PROBE_DIR/probe_proxy.py'"
act "install -m 644 '$SRC/check.py' '$PROBE_DIR/check.py'"

say ""
say "[2/2] 钩子 -> $CODEX_DIR/hooks.json"
if [ -f "$CODEX_DIR/hooks.json" ]; then
  say "    ! 该文件已存在。直接覆盖会丢掉你现有的钩子，已改为备份 + 覆盖："
  act "cp '$CODEX_DIR/hooks.json' '$CODEX_DIR/hooks.json.bak-$(date +%Y%m%dT%H%M%S)'"
  act "cp '$SRC/hooks.json' '$CODEX_DIR/hooks.json'"
  if [ "$APPLY" = 0 ]; then
    say "    现有内容如下，请确认是否需要手动合并："
    sed 's/^/      /' "$CODEX_DIR/hooks.json"
  fi
else
  act "cp '$SRC/hooks.json' '$CODEX_DIR/hooks.json'"
fi

cat <<'EOF'

==> 还需你手动完成 3 步（脚本不代劳）

1) 往 ~/.codex/config.toml 加入 provider，并把默认路由指过去：

   model_provider = "probe"

   [model_providers.probe]
   name                 = "probe"
   base_url             = "http://127.0.0.1:8787/backend-api/codex"
   wire_api             = "responses"
   supports_websockets  = false
   requires_openai_auth = true

   注：不加这段、不启动代理，Codex 行为与现在完全一致，不会有任何影响。

2) 启动探测代理（必须常驻，另开一个终端）：

   set -a; . ~/.codex/.env; set +a
   python3 ~/.codex-probe/probe_proxy.py

   必须带 .env，否则连不上 chatgpt.com（原因见 README「踩坑记录」）。

3) 在 Codex 里执行 /hooks，信任装好的 Stop 钩子。
   不信任 = 钩子被静默跳过 = 永远不会告警。

验证：

   python3 ~/.codex-probe/check.py --report

回滚：

   rm ~/.codex/hooks.json
   rm -rf ~/.codex-probe
   # 从 config.toml 删掉 model_provider 与 [model_providers.probe] 段

EOF
