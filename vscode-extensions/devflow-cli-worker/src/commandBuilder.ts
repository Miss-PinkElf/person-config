export interface BuildStartWorkerCommandInput {
  workspacePath: string;
  workerId: string;
  cliRelativePath: string;
}

export function buildStartWorkerCommand(input: BuildStartWorkerCommandInput): string {
  const tmuxSessionName = `devflow-worker-${input.workerId}`;
  return [
    `cd ${quoteForShell(input.workspacePath)}`,
    `node ${input.cliRelativePath} start-in-vscode --id ${input.workerId} --command codex`,
    `tmux attach -t ${tmuxSessionName}`
  ].join(" && ");
}

export function sanitizeWorkerId(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "worker";
}

function quoteForShell(value: string): string {
  return `'${value.replace(/'/g, "'\"'\"'")}'`;
}
