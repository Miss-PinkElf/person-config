import { dirname } from "node:path";
import * as vscode from "vscode";
import {
  cloneEntry,
  emptyConfig,
  hasEntryPath,
  normalizeConfig,
  removeEntryAtIndexPath,
  sortEntriesDefault,
} from "./configModel";
import { normalizeSlashes, toWorkspaceRelativePath } from "./pathUtils";
import {
  ControlledEntry,
  ControlledEntrySource,
  ControlledExplorerConfig,
} from "./types";

const PROJECT_CONFIG_RELATIVE_PATH = ".vscode/controlled-explorer.json";
const GLOBAL_CONFIG_FILE = "controlled-explorer.json";

export class ConfigService {
  public constructor(private readonly context: vscode.ExtensionContext) {}

  public getWorkspaceFolderPaths(): string[] {
    return (vscode.workspace.workspaceFolders ?? []).map((folder) => folder.uri.fsPath);
  }

  public getProjectConfigUri(): vscode.Uri | undefined {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return undefined;
    }

    return vscode.Uri.joinPath(workspaceFolder.uri, PROJECT_CONFIG_RELATIVE_PATH);
  }

  public getGlobalConfigUri(): vscode.Uri {
    return vscode.Uri.joinPath(this.context.globalStorageUri, GLOBAL_CONFIG_FILE);
  }

  public async openProjectConfig(): Promise<void> {
    const uri = this.getProjectConfigUri();
    if (!uri) {
      vscode.window.showWarningMessage("当前没有打开工作区，无法创建项目级受控文件配置。");
      return;
    }

    await this.ensureConfigFile(uri);
    await vscode.window.showTextDocument(uri);
  }

  public async openGlobalConfig(): Promise<void> {
    const uri = this.getGlobalConfigUri();
    await this.ensureConfigFile(uri);
    await vscode.window.showTextDocument(uri);
  }

  public async readProjectConfig(): Promise<ControlledExplorerConfig> {
    const uri = this.getProjectConfigUri();
    if (!uri) {
      return emptyConfig();
    }

    return this.readConfig(uri);
  }

  public async readGlobalConfig(): Promise<ControlledExplorerConfig> {
    return this.readConfig(this.getGlobalConfigUri());
  }

  public async writeProjectConfig(config: ControlledExplorerConfig): Promise<void> {
    const uri = this.getProjectConfigUri();
    if (!uri) {
      throw new Error("当前没有打开工作区，无法写入项目级配置。");
    }

    await this.writeConfig(uri, config);
  }

  public async writeGlobalConfig(config: ControlledExplorerConfig): Promise<void> {
    await this.writeConfig(this.getGlobalConfigUri(), config);
  }

  public async addUriToProjectConfig(uri: vscode.Uri): Promise<void> {
    const config = await this.readProjectConfig();
    const stat = await vscode.workspace.fs.stat(uri);
    const type: ControlledEntry["type"] =
      stat.type === vscode.FileType.Directory ? "folder" : "file";
    const pathValue = toWorkspaceRelativePath(uri.fsPath, this.getWorkspaceFolderPaths());

    if (hasEntryPath(config.roots, pathValue)) {
      vscode.window.showInformationMessage("该路径已经在受控文件配置中。");
      return;
    }

    config.roots = sortEntriesDefault([
      ...config.roots,
      {
        type,
        path: normalizeSlashes(pathValue),
      },
    ]);

    await this.writeProjectConfig(config);
  }

  public async removeRootEntry(
    source: ControlledEntrySource,
    indexPath: number[]
  ): Promise<void> {
    const config =
      source === "project" ? await this.readProjectConfig() : await this.readGlobalConfig();

    config.roots = removeEntryAtIndexPath(config.roots, indexPath);

    if (source === "project") {
      await this.writeProjectConfig(config);
      return;
    }

    await this.writeGlobalConfig(config);
  }

  public async sortProjectConfigDefault(): Promise<void> {
    const config = await this.readProjectConfig();
    config.roots = sortEntriesDefault(config.roots);
    await this.writeProjectConfig(config);
  }

  public async getEntryRoots(): Promise<{
    project: ControlledEntry[];
    global: ControlledEntry[];
  }> {
    const [project, global] = await Promise.all([
      this.readProjectConfig(),
      this.readGlobalConfig(),
    ]);

    return {
      project: project.roots.map((entry) => cloneEntry(entry)),
      global: global.roots.map((entry) => cloneEntry(entry)),
    };
  }

  private async ensureConfigFile(uri: vscode.Uri): Promise<void> {
    try {
      await vscode.workspace.fs.stat(uri);
      return;
    } catch {
      await this.writeConfig(uri, emptyConfig());
    }
  }

  private async readConfig(uri: vscode.Uri): Promise<ControlledExplorerConfig> {
    try {
      const data = await vscode.workspace.fs.readFile(uri);
      const rawText = new TextDecoder("utf-8").decode(data);
      return normalizeConfig(JSON.parse(rawText));
    } catch (error) {
      if (isMissingFileError(error)) {
        return emptyConfig();
      }

      vscode.window.showErrorMessage(`读取受控文件配置失败：${uri.fsPath}`);
      return emptyConfig();
    }
  }

  private async writeConfig(
    uri: vscode.Uri,
    config: ControlledExplorerConfig
  ): Promise<void> {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(dirname(uri.fsPath)));

    const data = new TextEncoder().encode(`${JSON.stringify(config, null, 2)}\n`);
    await vscode.workspace.fs.writeFile(uri, data);
  }
}

function isMissingFileError(error: unknown): boolean {
  if (error instanceof vscode.FileSystemError) {
    return error.code === "FileNotFound";
  }

  return error instanceof Error && /not found|ENOENT|FileNotFound/i.test(error.message);
}
