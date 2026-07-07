import * as vscode from "vscode";
import { buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

const START_COMMAND = "devflowCliWorker.start";
const CLI_RELATIVE_PATH = ".codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(START_COMMAND, startWorker);
  context.subscriptions.push(disposable);
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
    value: "macos-worker"
  });

  if (input === undefined) {
    return;
  }

  const workerId = sanitizeWorkerId(input);
  const command = buildStartWorkerCommand({
    workspacePath: workspaceFolder.uri.fsPath,
    workerId,
    cliRelativePath: CLI_RELATIVE_PATH
  });

  const terminal = vscode.window.createTerminal({ name: `devflow worker: ${workerId}` });
  terminal.show();
  terminal.sendText(command, true);
}
