import * as vscode from "vscode";

export type FrequencyMap = Record<string, number>;

const STORAGE_KEY = "controlledExplorer.openFrequencies";

export class FrequencyService {
  public constructor(private readonly state: vscode.Memento) {}

  public get(uriKey: string): number {
    return this.getAll()[uriKey] ?? 0;
  }

  public async increment(uriKey: string): Promise<void> {
    const all = this.getAll();
    all[uriKey] = (all[uriKey] ?? 0) + 1;
    await this.state.update(STORAGE_KEY, all);
  }

  public getAll(): FrequencyMap {
    return this.state.get<FrequencyMap>(STORAGE_KEY, {});
  }
}

export function compareByFrequencyThenName(
  left: { key: string; label: string },
  right: { key: string; label: string },
  frequencies: FrequencyMap
): number {
  const frequencyDiff = (frequencies[right.key] ?? 0) - (frequencies[left.key] ?? 0);
  if (frequencyDiff !== 0) {
    return frequencyDiff;
  }

  return left.label.localeCompare(right.label, "zh-Hans-CN", {
    sensitivity: "base",
    numeric: true,
  });
}
