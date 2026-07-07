import * as vscode from "vscode";
import { ConfigService } from "./configService";
import { ControlledNode } from "./types";

export class WatcherService implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];
  private readonly watchedDirectories = new Map<string, vscode.FileSystemWatcher>();

  public constructor(
    private readonly configService: ConfigService,
    private readonly refresh: () => void
  ) {}

  public start(): void {
    const projectConfigUri = this.configService.getProjectConfigUri();
    if (projectConfigUri) {
      this.watchFile(projectConfigUri);
    }

    this.watchFile(this.configService.getGlobalConfigUri());
  }

  public watchExpandedNode(node: ControlledNode): void {
    if (node.kind !== "folder" || !node.uri) {
      return;
    }

    const key = node.uri.toString();
    if (this.watchedDirectories.has(key)) {
      return;
    }

    const pattern = new vscode.RelativePattern(node.uri.fsPath, "*");
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidCreate(() => this.refresh());
    watcher.onDidChange(() => this.refresh());
    watcher.onDidDelete(() => this.refresh());

    this.watchedDirectories.set(key, watcher);
    this.disposables.push(watcher);
  }

  public dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables.length = 0;
    this.watchedDirectories.clear();
  }

  private watchFile(uri: vscode.Uri): void {
    const watcher = vscode.workspace.createFileSystemWatcher(uri.fsPath);
    watcher.onDidCreate(() => this.refresh());
    watcher.onDidChange(() => this.refresh());
    watcher.onDidDelete(() => this.refresh());
    this.disposables.push(watcher);
  }
}
