import * as vscode from "vscode";
import { join } from "node:path";
import { createBridgeServer } from "./bridgeServer";
import { buildAttachWorkerCommand, buildEnsureWorkerCommand, buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

const START_COMMAND = "devflowCliWorker.start";
const CLI_RELATIVE_PATH = ".codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs";
const DEFAULT_WORKER_ID = "macos-worker";
const workerTerminals = new Map<string, vscode.Terminal>();

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(START_COMMAND, startWorker);
  context.subscriptions.push(disposable);
  context.subscriptions.push(vscode.window.onDidCloseTerminal(removeClosedTerminal));
  void startDefaultWorker();
  void startBridge(context);
}

export function deactivate(): void {
  // VSCode 扩展生命周期（Extension Lifecycle）要求保留该出口。
}

async function startWorker(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage("请先打开一个工作区再启动 devflow worker。");
    return;
  }

  const input = await vscode.window.showInputBox({
    title: "devflow worker id",
    prompt: "输入 worker id，用于 session 目录和 tmux 会话名。",
    value: DEFAULT_WORKER_ID
  });

  if (input === undefined) {
    return;
  }

  const workerId = sanitizeWorkerId(input);
  openWorkerTerminal(workerId, buildStartWorkerCommand({
    workspacePath: workspaceFolder.uri.fsPath,
    workerId,
    cliRelativePath: CLI_RELATIVE_PATH
  }));
}

async function startDefaultWorker(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return;
  }

  openWorkerTerminal(DEFAULT_WORKER_ID, buildEnsureWorkerCommand({
    workspacePath: workspaceFolder.uri.fsPath,
    workerId: DEFAULT_WORKER_ID,
    cliRelativePath: CLI_RELATIVE_PATH
  }));
}

async function startBridge(context: vscode.ExtensionContext): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  try {
    const bridge = await createBridgeServer(
      join(workspaceFolder.uri.fsPath, ".devflow/devflow-cli-worker/vscode-bridge.sock"),
      async (workerId) => attachWorkerTerminal(workspaceFolder.uri.fsPath, workerId)
    );
    context.subscriptions.push({ dispose: () => { void bridge.dispose(); } });
  } catch (error) {
    vscode.window.showErrorMessage(`启动 devflow VSCode 桥接失败：${error instanceof Error ? error.message : "未知错误"}`);
  }
}

function attachWorkerTerminal(workspacePath: string, workerId: string): { ok: true; workerId: string; reused: boolean } {
  const existing = workerTerminals.get(workerId);
  if (existing) {
    existing.show();
    return { ok: true, workerId, reused: true };
  }

  openWorkerTerminal(workerId, buildAttachWorkerCommand({ workspacePath, workerId }));
  return { ok: true, workerId, reused: false };
}

function openWorkerTerminal(workerId: string, command: string): void {
  const terminal = vscode.window.createTerminal({ name: `devflow worker: ${workerId}` });
  workerTerminals.set(workerId, terminal);
  terminal.show();
  terminal.sendText(command, true);
}

function removeClosedTerminal(terminal: vscode.Terminal): void {
  for (const [workerId, current] of workerTerminals) {
    if (current === terminal) workerTerminals.delete(workerId);
  }
}
