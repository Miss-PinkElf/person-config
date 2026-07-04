import * as vscode from "vscode";
import { buildLineReference } from "./reference";

const SEND_COMMAND = "sendRefToTerminal.send";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(SEND_COMMAND, sendReferenceToTerminal);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // VS Code 扩展生命周期（Extension Lifecycle）要求保留该出口。
}

async function sendReferenceToTerminal(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("请先打开一个文件再发送代码引用。");
    return;
  }

  const terminal = vscode.window.activeTerminal;
  if (!terminal) {
    vscode.window.showWarningMessage("请先打开或选中一个终端再发送代码引用。");
    return;
  }

  const relativePath = vscode.workspace.asRelativePath(editor.document.uri, false);
  const selection = editor.selection;
  const reference = buildLineReference({
    relativePath,
    startLine: selection.start.line + 1,
    endLine: selection.end.line + 1
  });

  terminal.sendText(reference, false);
}
