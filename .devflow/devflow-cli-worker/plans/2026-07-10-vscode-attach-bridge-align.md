# VSCode Worker Attach 桥接对齐记录

## 目标

让 devflow Worker CLI（devflow Worker CLI）能够请求当前 VSCode 插件（VSCode Extension）在内置终端（VSCode Integrated Terminal）中打开或聚焦指定 worker id 对应的 tmux（tmux）会话。VSCode 是可见展示和人工介入入口，tmux 与 CLI 仍是 worker 的实际控制层。

## 职责边界

| 层级 | 职责 | 不负责 |
| --- | --- | --- |
| Worker CLI（Worker CLI） | 创建与控制 tmux worker、发送提示词、`/clear`、Bash 命令、轮询、读取 result.md（Result File） | 创建 VSCode 内置终端 |
| tmux（tmux） | 运行 Codex CLI（Codex CLI）、保存可捕获的会话状态 | 了解 VSCode 窗口 |
| VSCode 插件（VSCode Extension） | 接收 attach 请求、创建或聚焦内置终端、执行 `tmux attach` | 代理 worker 消息、读取终端缓冲区、重复实现轮询 |

## 已确认行为

- CLI 新增 `open-in-vscode --id <worker-id>` 命令。
- 命令先确认 `devflow-worker-<worker-id>` tmux 会话存在；不存在时返回中文错误，不隐式启动 worker。
- 会话存在时，CLI 向当前工作区的 VSCode 插件发送 attach 请求。
- 插件为没有 VSCode 终端的 worker 创建 `devflow worker: <worker-id>`；已存在同名终端时只聚焦，不重复创建。
- 终端使用 `tmux attach -t devflow-worker-<worker-id>`，无需将 `/clear`、提示词、Bash 命令或轮询转发给插件。
- 既有自动启动 `macos-worker` 行为保留；其创建的终端也应参与同名复用。

## 方案比较

1. Unix Socket（Unix 域套接字）桥接（采用）：插件在工作区 `.devflow/devflow-cli-worker/vscode-bridge.sock` 启动本地 JSON Lines 服务；CLI 在相同路径连接并请求 attach。无需模拟键盘，可由插件真实调用 VSCode API（VSCode API）。
2. `osascript` 模拟命令面板：依赖 macOS 辅助功能（Accessibility）权限，且不能可靠选择 worker id；不采用。
3. CLI 只输出手动 attach 命令：不满足“CLI 打开 VSCode 终端”的目标；不采用。

## 协议与数据流

```text
CLI open-in-vscode --id research-a
  -> tmux has-session devflow-worker-research-a
  -> vscode-bridge.sock
  -> {"action":"attach","workerId":"research-a"}\n
VSCode 插件
  -> 创建或聚焦 devflow worker: research-a
  -> tmux attach -t devflow-worker-research-a
  -> {"ok":true,"workerId":"research-a","reused":true|false}\n
CLI
  -> 输出桥接响应
```

socket 文件位于当前工作区，插件激活时处理遗留 socket；请求和响应均为单行 JSON（JSON Lines），单次连接只处理一个请求后关闭。

## 错误处理

- 插件未加载或 socket 不存在：CLI 明确提示“VSCode 插件未就绪，请打开当前工作区并等待插件激活”。
- socket 请求超时、格式无效、未知 action：CLI 或插件返回结构化中文错误；不回退到 `osascript`。
- worker id 非法或 tmux 会话不存在：CLI 在连接 socket 前拒绝请求。
- 遗留 socket：插件启动时先探测并删除无监听的 socket；无法删除时记录错误，不假装桥接已就绪。

## 测试与验收

- CLI 测试覆盖：tmux 会话不存在时不连接 socket；桥接成功时输出响应；socket 缺失和错误响应时给出中文错误。
- 插件测试覆盖：合法 attach 请求创建终端，重复请求只调用 `show()`；协议解析与错误响应。
- CLI 测试、插件 TypeScript（TypeScript）编译和插件测试通过。
- 真实 macOS 验证：先由 CLI 启动 `research-a` tmux worker，再执行 `open-in-vscode --id research-a`；VSCode 出现对应终端；再次执行同一命令不创建第二个终端。

## 非目标

- 不把 CLI 的 `/clear`、提示词、Bash 命令或轮询迁入 VSCode 插件。
- 不读取 VSCode 普通终端输出。
- 不支持 Windows 原生、PowerShell（pwsh）或 WSL（Windows Subsystem for Linux）。
