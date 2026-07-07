import * as vscode from "vscode";
import { ConfigService } from "./configService";
import { ControlledDragAndDropController } from "./dragAndDropController";
import { FileOperations } from "./fileOperations";
import { FrequencyService } from "./frequencyService";
import { ControlledExplorerProvider } from "./treeDataProvider";
import { ControlledNode, SortMode } from "./types";
import { WatcherService } from "./watcherService";

const SORT_MODE_KEY = "controlledExplorer.sortMode";

export function activate(context: vscode.ExtensionContext): void {
  const configService = new ConfigService(context);
  const frequencyService = new FrequencyService(context.globalState);

  const getSortMode = (): SortMode => {
    return context.globalState.get<SortMode>(SORT_MODE_KEY, "default");
  };

  const provider = new ControlledExplorerProvider(
    configService,
    getSortMode,
    () => frequencyService.getAll()
  );
  const fileOperations = new FileOperations(configService);
  const dragAndDropController = new ControlledDragAndDropController(
    configService,
    fileOperations,
    () => provider.refresh()
  );
  const watcherService = new WatcherService(configService, () => provider.refresh());

  const treeView = vscode.window.createTreeView("controlledExplorer.view", {
    treeDataProvider: provider,
    dragAndDropController,
    showCollapseAll: true,
  });

  watcherService.start();
  treeView.onDidExpandElement((event) => watcherService.watchExpandedNode(event.element));

  context.subscriptions.push(
    treeView,
    watcherService,
    registerCommand("controlledExplorer.refresh", () => provider.refresh()),
    registerCommand("controlledExplorer.openProjectConfig", () =>
      configService.openProjectConfig()
    ),
    registerCommand("controlledExplorer.openGlobalConfig", () =>
      configService.openGlobalConfig()
    ),
    registerCommand("controlledExplorer.openNode", async (node: ControlledNode) => {
      await fileOperations.openNode(node);
      if (node.uri) {
        await frequencyService.increment(node.uri.toString());
      }
      provider.refresh();
    }),
    registerCommand("controlledExplorer.revealInFinder", (node: ControlledNode) =>
      fileOperations.revealInFinder(node)
    ),
    registerCommand("controlledExplorer.newFile", async (node: ControlledNode) => {
      await fileOperations.newFile(node);
      provider.refresh(node);
    }),
    registerCommand("controlledExplorer.newFolder", async (node: ControlledNode) => {
      await fileOperations.newFolder(node);
      provider.refresh(node);
    }),
    registerCommand("controlledExplorer.rename", async (node: ControlledNode) => {
      await fileOperations.rename(node);
      provider.refresh();
    }),
    registerCommand("controlledExplorer.trash", async (node: ControlledNode) => {
      await fileOperations.trash(node);
      provider.refresh();
    }),
    registerCommand("controlledExplorer.copyAbsolutePath", (node: ControlledNode) =>
      fileOperations.copyAbsolutePath(node)
    ),
    registerCommand("controlledExplorer.copyRelativePath", (node: ControlledNode) =>
      fileOperations.copyRelativePath(node)
    ),
    registerCommand("controlledExplorer.sendPathToTerminal", (node: ControlledNode) =>
      fileOperations.sendPathToTerminal(node)
    ),
    registerCommand("controlledExplorer.openInTerminal", (node: ControlledNode) =>
      fileOperations.openInTerminal(node)
    ),
    registerCommand("controlledExplorer.removeRoot", async (node: ControlledNode) => {
      if (!node.rootIndexPath) {
        return;
      }
      await configService.removeRootEntry(node.source, node.rootIndexPath);
      provider.refresh();
    }),
    registerCommand("controlledExplorer.addFromExplorer", async (resource?: vscode.Uri) => {
      const uri = resource ?? vscode.window.activeTextEditor?.document.uri;
      if (!uri) {
        vscode.window.showWarningMessage("没有可添加到受控文件的路径。");
        return;
      }

      await configService.addUriToProjectConfig(uri);
      provider.refresh();
    }),
    registerCommand("controlledExplorer.setDefaultSort", async () => {
      await context.globalState.update(SORT_MODE_KEY, "default");
      await configService.sortProjectConfigDefault();
      provider.refresh();
    }),
    registerCommand("controlledExplorer.setFrequencySort", async () => {
      await context.globalState.update(SORT_MODE_KEY, "frequency");
      provider.refresh();
    })
  );
}

export function deactivate(): void {
  // VS Code disposes subscriptions registered in activate.
}

function registerCommand(
  command: string,
  callback: (...args: never[]) => unknown
): vscode.Disposable {
  return vscode.commands.registerCommand(command, async (...args: never[]) => {
    try {
      await callback(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`受控文件操作失败：${message}`);
    }
  });
}
