import { basename, dirname } from "node:path";
import * as vscode from "vscode";
import { ConfigService } from "./configService";
import { shellQuote, toWorkspaceRelativePath } from "./pathUtils";
import { ControlledNode } from "./types";

export class FileOperations {
  public constructor(private readonly configService: ConfigService) {}

  public async openNode(node: ControlledNode): Promise<void> {
    if (node.kind !== "file" || !node.uri) {
      return;
    }

    const document = await vscode.workspace.openTextDocument(node.uri);
    await vscode.window.showTextDocument(document);
  }

  public async revealInFinder(node: ControlledNode): Promise<void> {
    if (!node.uri) {
      return;
    }

    await vscode.commands.executeCommand("revealFileInOS", node.uri);
  }

  public async newFile(node: ControlledNode): Promise<void> {
    const directory = this.getDirectoryUri(node);
    if (!directory) {
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: "输入新文件名",
      placeHolder: "example.md",
      validateInput: (value) => (value.trim().length === 0 ? "文件名不能为空" : undefined),
    });
    if (!name) {
      return;
    }

    const target = vscode.Uri.joinPath(directory, name);
    await vscode.workspace.fs.writeFile(target, new Uint8Array());
    await vscode.window.showTextDocument(target);
  }

  public async newFolder(node: ControlledNode): Promise<void> {
    const directory = this.getDirectoryUri(node);
    if (!directory) {
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: "输入新文件夹名",
      placeHolder: "docs",
      validateInput: (value) => (value.trim().length === 0 ? "文件夹名不能为空" : undefined),
    });
    if (!name) {
      return;
    }

    await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(directory, name));
  }

  public async rename(node: ControlledNode): Promise<void> {
    if (!node.uri) {
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: "输入新名称",
      value: basename(node.uri.fsPath),
      validateInput: (value) => (value.trim().length === 0 ? "名称不能为空" : undefined),
    });
    if (!name) {
      return;
    }

    const target = vscode.Uri.file(`${dirname(node.uri.fsPath)}/${name}`);
    await this.moveWithoutOverwrite(node.uri, target);
  }

  public async trash(node: ControlledNode): Promise<void> {
    if (!node.uri) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `删除到废纸篓：${basename(node.uri.fsPath)}？`,
      { modal: true },
      "删除"
    );
    if (confirm !== "删除") {
      return;
    }

    await vscode.workspace.fs.delete(node.uri, {
      recursive: true,
      useTrash: true,
    });
  }

  public async copyAbsolutePath(node: ControlledNode): Promise<void> {
    if (!node.uri) {
      return;
    }

    await vscode.env.clipboard.writeText(node.uri.fsPath);
  }

  public async copyRelativePath(node: ControlledNode): Promise<void> {
    if (!node.uri) {
      return;
    }

    await vscode.env.clipboard.writeText(
      toWorkspaceRelativePath(node.uri.fsPath, this.configService.getWorkspaceFolderPaths())
    );
  }

  public sendPathToTerminal(node: ControlledNode): void {
    if (!node.uri) {
      return;
    }

    const terminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    terminal.show();
    terminal.sendText(shellQuote(node.uri.fsPath), false);
  }

  public openInTerminal(node: ControlledNode): void {
    if (!node.uri) {
      return;
    }

    const cwd = node.kind === "folder" ? node.uri : vscode.Uri.file(dirname(node.uri.fsPath));
    const terminal = vscode.window.createTerminal({
      name: "Controlled Explorer",
      cwd,
    });
    terminal.show();
  }

  public async moveIntoDirectory(source: vscode.Uri, targetDirectory: vscode.Uri): Promise<void> {
    const target = vscode.Uri.joinPath(targetDirectory, basename(source.fsPath));
    await this.moveWithoutOverwrite(source, target);
  }

  private getDirectoryUri(node: ControlledNode): vscode.Uri | undefined {
    if (node.kind === "folder") {
      return node.uri;
    }

    return node.parentUri;
  }

  private async moveWithoutOverwrite(source: vscode.Uri, target: vscode.Uri): Promise<void> {
    try {
      await vscode.workspace.fs.stat(target);
      vscode.window.showErrorMessage(`目标已存在：${target.fsPath}`);
      return;
    } catch {
      await vscode.workspace.fs.rename(source, target, {
        overwrite: false,
      });
    }
  }
}
