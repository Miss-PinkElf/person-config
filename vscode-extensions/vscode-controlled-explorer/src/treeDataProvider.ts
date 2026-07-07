import { basename } from "node:path";
import * as vscode from "vscode";
import { compareEntriesDefault, entryLabel } from "./configModel";
import { ConfigService } from "./configService";
import { FrequencyMap, compareByFrequencyThenName } from "./frequencyService";
import { resolveConfiguredPath } from "./pathUtils";
import {
  ControlledEntry,
  ControlledEntrySource,
  ControlledNode,
  ControlledNodeKind,
  SortMode,
} from "./types";

export class ControlledExplorerProvider implements vscode.TreeDataProvider<ControlledNode> {
  private readonly changeEmitter = new vscode.EventEmitter<ControlledNode | undefined>();
  public readonly onDidChangeTreeData = this.changeEmitter.event;

  public constructor(
    private readonly configService: ConfigService,
    private readonly getSortMode: () => SortMode,
    private readonly getFrequencies: () => FrequencyMap
  ) {}

  public refresh(node?: ControlledNode): void {
    this.changeEmitter.fire(node);
  }

  public getTreeItem(node: ControlledNode): vscode.TreeItem {
    const collapsibleState =
      node.kind === "group" || node.kind === "folder"
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;

    const item = new vscode.TreeItem(node.label, collapsibleState);
    item.id = node.id;
    item.resourceUri = node.uri;
    item.contextValue = buildContextValue(node);
    item.tooltip = node.uri?.fsPath ?? node.label;

    if (node.kind === "missing") {
      item.description = "路径不存在";
      item.iconPath = new vscode.ThemeIcon("warning");
      return item;
    }

    if (node.kind === "group") {
      item.iconPath = new vscode.ThemeIcon("folder-library");
      return item;
    }

    if (node.kind === "folder") {
      item.iconPath = vscode.ThemeIcon.Folder;
      return item;
    }

    item.iconPath = vscode.ThemeIcon.File;
    item.command = {
      command: "controlledExplorer.openNode",
      title: "打开",
      arguments: [node],
    };
    return item;
  }

  public async getChildren(node?: ControlledNode): Promise<ControlledNode[]> {
    if (!node) {
      return this.getRootNodes();
    }

    if (node.kind === "group" && node.entry?.type === "group") {
      return this.entriesToNodes(
        node.entry.children ?? [],
        node.source,
        node.rootIndexPath ?? [],
        true
      );
    }

    if (node.kind === "folder" && node.uri) {
      return this.directoryChildrenToNodes(node.uri, node.source);
    }

    return [];
  }

  private async getRootNodes(): Promise<ControlledNode[]> {
    const roots = await this.configService.getEntryRoots();
    const nodes = [
      ...(await this.entriesToNodes(roots.project, "project", [], true)),
      ...(await this.entriesToNodes(roots.global, "global", [], true)),
    ];

    return this.applyFrequencySort(nodes);
  }

  private async entriesToNodes(
    entries: ControlledEntry[],
    source: ControlledEntrySource,
    parentIndexPath: number[],
    isRootLevel: boolean
  ): Promise<ControlledNode[]> {
    const indexedEntries = entries.map((entry, index) => ({ entry, index }));
    const displayEntries =
      this.getSortMode() === "default"
        ? indexedEntries.sort((left, right) => compareEntriesDefault(left.entry, right.entry))
        : indexedEntries;

    const nodes = await Promise.all(
      displayEntries.map(({ entry, index }) => {
        const indexPath = [...parentIndexPath, index];
        return this.entryToNode(entry, source, indexPath, isRootLevel);
      })
    );

    return this.applyFrequencySort(nodes);
  }

  private async entryToNode(
    entry: ControlledEntry,
    source: ControlledEntrySource,
    indexPath: number[],
    isRootLevel: boolean
  ): Promise<ControlledNode> {
    if (entry.type === "group") {
      return {
        id: `${source}:group:${indexPath.join(".")}`,
        kind: "group",
        label: entryLabel(entry),
        source,
        entry,
        rootIndexPath: indexPath,
        isRootEntry: isRootLevel,
      };
    }

    const absolutePath = resolveConfiguredPath(
      entry.path,
      this.configService.getWorkspaceFolderPaths()
    );
    const uri = vscode.Uri.file(absolutePath);
    const exists = await this.exists(uri);

    return {
      id: `${source}:${entry.type}:${indexPath.join(".")}:${absolutePath}`,
      kind: exists ? entry.type : "missing",
      label: entryLabel(entry),
      source,
      entry,
      uri,
      rootIndexPath: indexPath,
      isRootEntry: isRootLevel,
    };
  }

  private async exists(uri: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  }

  private async directoryChildrenToNodes(
    directoryUri: vscode.Uri,
    source: ControlledEntrySource
  ): Promise<ControlledNode[]> {
    try {
      const entries = await vscode.workspace.fs.readDirectory(directoryUri);
      const nodes = entries
        .filter(([, fileType]) => {
          return (
            fileType === vscode.FileType.Directory ||
            fileType === vscode.FileType.File
          );
        })
        .sort(compareDirectoryEntries)
        .map(([name, fileType]) => {
          const uri = vscode.Uri.joinPath(directoryUri, name);
          const kind: ControlledNodeKind =
            fileType === vscode.FileType.Directory ? "folder" : "file";

          return {
            id: `disk:${uri.toString()}`,
            kind,
            label: name,
            source,
            uri,
            parentUri: directoryUri,
            isRootEntry: false,
          };
        });

      return this.applyFrequencySort(nodes);
    } catch {
      return [
        {
          id: `missing:${directoryUri.toString()}`,
          kind: "missing",
          label: basename(directoryUri.fsPath),
          source,
          uri: directoryUri,
          isRootEntry: false,
        },
      ];
    }
  }

  private applyFrequencySort(nodes: ControlledNode[]): ControlledNode[] {
    if (this.getSortMode() !== "frequency") {
      return nodes;
    }

    const folders = nodes.filter((node) => node.kind === "folder" || node.kind === "group");
    const files = nodes
      .filter((node) => node.kind === "file")
      .sort((left, right) =>
        compareByFrequencyThenName(
          { key: left.uri?.toString() ?? left.id, label: left.label },
          { key: right.uri?.toString() ?? right.id, label: right.label },
          this.getFrequencies()
        )
      );
    const missing = nodes.filter((node) => node.kind === "missing");

    return [...folders, ...files, ...missing];
  }
}

function compareDirectoryEntries(
  [leftName, leftType]: [string, vscode.FileType],
  [rightName, rightType]: [string, vscode.FileType]
): number {
  const leftOrder = leftType === vscode.FileType.Directory ? 0 : 1;
  const rightOrder = rightType === vscode.FileType.Directory ? 0 : 1;
  const typeDiff = leftOrder - rightOrder;
  if (typeDiff !== 0) {
    return typeDiff;
  }

  return leftName.localeCompare(rightName, "zh-Hans-CN", {
    sensitivity: "base",
    numeric: true,
  });
}

function buildContextValue(node: ControlledNode): string {
  const parts: string[] = [node.kind];

  if (node.kind === "folder" || node.kind === "file") {
    parts.push("resource");
  }

  if (node.isRootEntry) {
    parts.push("root");
  }

  return parts.join(" ");
}
