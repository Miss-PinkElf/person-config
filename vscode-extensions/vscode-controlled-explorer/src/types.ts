import * as vscode from "vscode";

export type ControlledEntryType = "group" | "folder" | "file";
export type ControlledEntrySource = "project" | "global";
export type SortMode = "default" | "frequency";

export interface ControlledEntryBase {
  type: ControlledEntryType;
  name?: string;
}

export interface ControlledGroupEntry extends ControlledEntryBase {
  type: "group";
  children?: ControlledEntry[];
}

export interface ControlledResourceEntry extends ControlledEntryBase {
  type: "folder" | "file";
  path: string;
}

export type ControlledEntry = ControlledGroupEntry | ControlledResourceEntry;

export interface ControlledExplorerConfig {
  version?: number;
  roots: ControlledEntry[];
}

export interface ControlledRoot {
  entry: ControlledEntry;
  source: ControlledEntrySource;
  indexPath: number[];
}

export type ControlledNodeKind = "group" | "folder" | "file" | "missing";

export interface ControlledNode {
  id: string;
  kind: ControlledNodeKind;
  label: string;
  source: ControlledEntrySource;
  entry?: ControlledEntry;
  uri?: vscode.Uri;
  parentUri?: vscode.Uri;
  rootIndexPath?: number[];
  isRootEntry: boolean;
}

export interface FileMoveRequest {
  source: vscode.Uri;
  targetDirectory: vscode.Uri;
}
