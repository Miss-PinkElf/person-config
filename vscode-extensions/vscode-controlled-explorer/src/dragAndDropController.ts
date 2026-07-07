import * as vscode from "vscode";
import { ConfigService } from "./configService";
import { FileOperations } from "./fileOperations";
import { parseUriList } from "./pathUtils";
import { ControlledNode } from "./types";

const INTERNAL_MIME = "application/vnd.code.tree.controlledExplorer.view";

export class ControlledDragAndDropController
  implements vscode.TreeDragAndDropController<ControlledNode>
{
  public readonly dragMimeTypes = [INTERNAL_MIME, "text/uri-list"];
  public readonly dropMimeTypes = [
    INTERNAL_MIME,
    "text/uri-list",
    "text/plain",
    "application/vnd.code.uri-list",
  ];

  public constructor(
    private readonly configService: ConfigService,
    private readonly fileOperations: FileOperations,
    private readonly refresh: () => void
  ) {}

  public async handleDrag(
    source: readonly ControlledNode[],
    dataTransfer: vscode.DataTransfer
  ): Promise<void> {
    const uris = source.flatMap((node) => (node.uri ? [node.uri.toString()] : []));
    dataTransfer.set(INTERNAL_MIME, new vscode.DataTransferItem(JSON.stringify(uris)));
    dataTransfer.set("text/uri-list", new vscode.DataTransferItem(uris.join("\n")));
  }

  public async handleDrop(
    target: ControlledNode | undefined,
    dataTransfer: vscode.DataTransfer
  ): Promise<void> {
    const droppedUris = await this.readDroppedUris(dataTransfer);
    if (droppedUris.length === 0) {
      return;
    }

    if (target?.kind === "folder" && target.uri && dataTransfer.get(INTERNAL_MIME)) {
      for (const uri of droppedUris) {
        await this.fileOperations.moveIntoDirectory(uri, target.uri);
      }
      this.refresh();
      return;
    }

    for (const uri of droppedUris) {
      await this.configService.addUriToProjectConfig(uri);
    }
    this.refresh();
  }

  private async readDroppedUris(dataTransfer: vscode.DataTransfer): Promise<vscode.Uri[]> {
    const internalItem = dataTransfer.get(INTERNAL_MIME);
    if (internalItem) {
      return this.parseInternalUris(internalItem.value);
    }

    const uriList = dataTransfer.get("text/uri-list") ?? dataTransfer.get("application/vnd.code.uri-list");
    if (uriList) {
      return parseUriList(await uriList.asString()).map((pathValue) => vscode.Uri.file(pathValue));
    }

    const plainText = dataTransfer.get("text/plain");
    if (plainText) {
      return parseUriList(await plainText.asString()).map((pathValue) => vscode.Uri.file(pathValue));
    }

    return [];
  }

  private parseInternalUris(value: unknown): vscode.Uri[] {
    if (typeof value !== "string") {
      return [];
    }

    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => vscode.Uri.parse(item));
    } catch {
      return [];
    }
  }
}
