# VSCode Worker Attach 桥接实施计划

> **执行说明：** 在当前会话中按任务顺序实施。Unix Socket（Unix 域套接字）协议和终端复用先由测试定义；任何真实桥接失败先进入 bug 路径（Bug Path），不回退到键盘模拟。

**目标：** 新增 `open-in-vscode --id <worker-id>`，让 CLI 请求当前 VSCode 插件创建或聚焦对应 tmux worker 的内置终端。

**架构：** 插件在 workspace 的 `.devflow/devflow-cli-worker/vscode-bridge.sock` 启动单请求 JSON Lines 服务。CLI 先通过 tmux Driver（tmux Driver）确认 worker session 存在，再用 bridge Client（Bridge Client）发送 attach 请求；插件只创建或聚焦 `devflow worker: <worker-id>` 终端并 attach，CLI 继续直连 tmux 完成控制与轮询。

**技术栈：** Node.js ESM、Node.js `net`、VSCode Extension API、TypeScript、tmux。

---

### Task 1：同步 OpenSpec 规格

**文件：**
- 修改：`.devflow/devflow-cli-worker/spec/proposal.md`
- 修改：`.devflow/devflow-cli-worker/spec/design.md`
- 修改：`.devflow/devflow-cli-worker/spec/tasks.md`

- [ ] **Step 1：记录 attach 桥接范围与非目标**

在 proposal 中新增 `open-in-vscode`、Unix Socket、终端复用与 CLI 直连 tmux 控制边界；明确插件不代理 `/clear`、提示词、Bash 命令和轮询。

- [ ] **Step 2：记录 JSON Lines 协议**

在 design 中记录请求和响应：

```json
{"action":"attach","workerId":"research-a"}
{"ok":true,"workerId":"research-a","reused":false}
```

并定义 socket 路径、单请求连接、错误响应和遗留 socket 清理。

- [ ] **Step 3：新增可验收任务**

在 tasks 中追加桥接 CLI、插件 server、终端复用、单元测试和真实 macOS 验证任务。

### Task 2：实现 Worker CLI Bridge Client

**文件：**
- 新建：`.codex/skills/devflow-cli-worker/cli/src/vscode-bridge.mjs`
- 新建：`.codex/skills/devflow-cli-worker/cli/src/vscode-bridge.test.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/src/cli.test.mjs`
- 修改：`.codex/skills/devflow-cli-worker/cli/package.json`

- [ ] **Step 1：编写 Bridge Client 测试**

使用 `node:net` 在临时 socket 路径创建 fake server，断言 client 发送：

```json
{"action":"attach","workerId":"research-a"}
```

并覆盖成功响应、`ok: false` 响应、socket 不存在和 5 秒超时的中文错误。

- [ ] **Step 2：实现 Bridge Client**

实现 `requestVscodeAttach({ socketPath, workerId, timeoutMs })`：连接 socket，写一行 JSON，读取一行 JSON 响应并关闭连接；socket 缺失时抛出“VSCode 插件未就绪，请打开当前工作区并等待插件激活”。

- [ ] **Step 3：为 CLI 命令添加失败测试**

在 `cli.test.mjs` 使用 fake tmux 和 fake bridge：tmux session 缺失时断言 bridge 不被调用；session 存在时断言调用 `requestAttach` 并输出 `worker <id> opened in VSCode`。

- [ ] **Step 4：实现 `open-in-vscode`**

在 `runCli` 分派：

```js
if (command === "open-in-vscode") return openInVscode(rest, context);
```

使用 `context.tmux.hasSession` 检查 `devflow-worker-<id>`；通过 `context.bridge.requestAttach` 请求 workspace socket，并输出结构化成功消息。将 bridge Client 注入 `createContext`，以支持测试替身。

- [ ] **Step 5：运行 CLI 测试**

运行：

```bash
npm --prefix .codex/skills/devflow-cli-worker/cli test
```

预期：包含 `vscode-bridge.test.mjs` 的完整 CLI 测试通过。

### Task 3：实现 VSCode 插件 Bridge Server 与终端复用

**文件：**
- 新建：`vscode-extensions/devflow-cli-worker/src/bridgeServer.ts`
- 新建：`vscode-extensions/devflow-cli-worker/src/bridgeServer.test.ts`
- 修改：`vscode-extensions/devflow-cli-worker/src/commandBuilder.ts`
- 修改：`vscode-extensions/devflow-cli-worker/src/commandBuilder.test.ts`
- 修改：`vscode-extensions/devflow-cli-worker/src/extension.ts`
- 修改：`vscode-extensions/devflow-cli-worker/package.json`

- [ ] **Step 1：定义并测试 Bridge Server 协议**

以可注入的 `net` server、attach callback 和 socket 路径实现 `createBridgeServer`。测试合法 attach 请求、未知 action、无效 JSON、callback 异常与 stop 后 socket 删除。

- [ ] **Step 2：实现插件 Bridge Server**

每连接读取一行 UTF-8 JSON；仅接受 `{ action: "attach", workerId }`，调用 attach callback 后写入一行 JSON 响应并结束连接。启动前删除遗留 socket；`dispose()` 关闭 server 并删除 socket。

- [ ] **Step 3：实现 attach 终端命令构造**

新增 `buildAttachWorkerCommand({ workspacePath, workerId })`，返回：

```text
cd '<workspace>' && tmux attach -t devflow-worker-<worker-id>
```

为安全的 `workerId` 使用既有 `sanitizeWorkerId`。

- [ ] **Step 4：接入插件生命周期与终端复用**

插件激活时，若存在 workspace，启动 bridge server，并在 `context.subscriptions` 中注册 dispose。维护 `Map<string, vscode.Terminal>`：attach 请求命中仍存在的终端时调用 `show()` 并返回 `reused: true`；否则创建 `devflow worker: <worker-id>`，发送 attach 命令并返回 `reused: false`。自动启动 `macos-worker` 与手动入口复用同一 helper。

- [ ] **Step 5：编译并运行插件测试**

运行：

```bash
npm --prefix vscode-extensions/devflow-cli-worker run compile
npm --prefix vscode-extensions/devflow-cli-worker test
```

预期：Bridge Server、命令构造与 TypeScript 编译通过。

### Task 4：更新文档、版本与真实桥接验证

**文件：**
- 修改：`.codex/skills/devflow-cli-worker/SKILL.md`
- 修改：`.codex/skills/devflow-cli-worker/cli/README.md`
- 修改：`vscode-extensions/devflow-cli-worker/README.md`
- 修改：`vscode-extensions/devflow-cli-worker/package.json`
- 修改：`vscode-extensions/devflow-cli-worker/package-lock.json`
- 修改：`.devflow/devflow-cli-worker/state.md`
- 修改：`.devflow/devflow-cli-worker/checkpoints.md`

- [ ] **Step 1：更新使用说明与版本**

记录 `open-in-vscode --id <worker-id>` 的前置条件、终端复用与职责边界；发布版本提升至 `0.1.2`，同步 lockfile 和 VSIX 文件名。

- [ ] **Step 2：打包 VSIX**

运行：

```bash
npm --prefix vscode-extensions/devflow-cli-worker run package
```

预期：生成 `vscode-extensions/devflow-cli-worker/devflow-cli-worker-0.1.2.vsix`；仅记录既有 repository 与 LICENSE 警告。

- [ ] **Step 3：真实 macOS 桥接验证**

安装 `0.1.2` 后重新加载 VSCode 工作区。运行：

```bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs start-in-vscode --id bridge-smoke --command bash
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs open-in-vscode --id bridge-smoke
node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs open-in-vscode --id bridge-smoke
```

预期：第一次调用创建并显示 `devflow worker: bridge-smoke`，第二次只聚焦同一终端。随后执行 `kill bridge-smoke` 清理临时会话。

- [ ] **Step 4：最终验证与证据回写**

运行：

```bash
git diff --check
npm --prefix .codex/skills/devflow-cli-worker/cli test
npm --prefix vscode-extensions/devflow-cli-worker run compile
npm --prefix vscode-extensions/devflow-cli-worker test
```

回写 OpenSpec tasks、state 与 checkpoint，记录真实验证结果和未解决风险。
