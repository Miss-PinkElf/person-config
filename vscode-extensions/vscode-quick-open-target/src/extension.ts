import { stat } from "node:fs/promises";
import * as path from "node:path";
import * as vscode from "vscode";
import { resolveCursorOffset } from "./cursorPosition";
import { resolveOpenTarget, type WorkspaceRoot } from "./openTarget";

const OPEN_COMMAND = "quickOpenTarget.openFile";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(OPEN_COMMAND, openTargetFile);
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // VS Code 扩展生命周期（Extension Lifecycle）要求保留该出口。
}

async function openTargetFile(args: unknown): Promise<void> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  const fileFolders = folders.filter((folder) => folder.uri.scheme === "file");
  if (folders.length > 0 && fileFolders.length === 0 && !isAbsolutePathArg(args)) {
    vscode.window.showErrorMessage("第一版只支持本机工作区中的相对路径。");
    return;
  }

  const roots = fileFolders.map((folder): WorkspaceRoot => ({
    name: folder.name,
    fsPath: folder.uri.fsPath
  }));
  const resolved = resolveOpenTarget(args, roots);
  if (!resolved.ok) {
    vscode.window.showErrorMessage(resolved.message);
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(resolved.target.fsPath);
  } catch (error) {
    const code = readErrorCode(error);
    if (code === "ENOENT") {
      vscode.window.showErrorMessage(`找不到文件：${resolved.target.fsPath}`);
      return;
    }
    vscode.window.showErrorMessage(`无法读取目标：${resolved.target.fsPath}`);
    return;
  }

  if (!fileStat.isFile()) {
    vscode.window.showErrorMessage(`目标不是文件：${resolved.target.fsPath}`);
    return;
  }

  let document: vscode.TextDocument;
  try {
    document = await vscode.workspace.openTextDocument(vscode.Uri.file(resolved.target.fsPath));
  } catch {
    vscode.window.showErrorMessage(`无法打开文件：${resolved.target.fsPath}`);
    return;
  }

  const offset = resolveCursorOffset(document.getText(), resolved.target.cursor);
  const position = document.positionAt(offset);
  const selection = new vscode.Selection(position, position);
  let editor: vscode.TextEditor;
  try {
    editor = await vscode.window.showTextDocument(document, {
      preview: false,
      preserveFocus: false,
      selection
    });
  } catch {
    vscode.window.showErrorMessage(`无法打开文件：${resolved.target.fsPath}`);
    return;
  }
  editor.selection = selection;
  editor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
}

function isAbsolutePathArg(args: unknown): boolean {
  if (args === null || typeof args !== "object" || Array.isArray(args) || !("path" in args)) {
    return false;
  }
  const rawPath = args.path;
  return typeof rawPath === "string" && path.isAbsolute(rawPath);
}

function readErrorCode(error: unknown): string {
  if (error !== null && typeof error === "object" && "code" in error) {
    return String(error.code);
  }
  return "";
}
