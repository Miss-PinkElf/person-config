export interface BuildStartWorkerCommandInput {
  workspacePath: string;
  workerId: string;
  cliRelativePath: string;
}

export function buildStartWorkerCommand(input: BuildStartWorkerCommandInput): string {
  return buildWorkerCommand(input, "start-in-vscode");
}

export function buildEnsureWorkerCommand(input: BuildStartWorkerCommandInput): string {
  return buildWorkerCommand(input, "ensure-in-vscode");
}

export function buildAttachWorkerCommand(input: Pick<BuildStartWorkerCommandInput, "workspacePath" | "workerId">): string {
  return [
    `cd ${quoteForShell(input.workspacePath)}`,
    `tmux set-option -t devflow-worker-${input.workerId} mouse on`,
    `tmux attach -t devflow-worker-${input.workerId}`
  ].join(" && ");
}

function buildWorkerCommand(input: BuildStartWorkerCommandInput, cliCommand: string): string {
  const tmuxSessionName = `devflow-worker-${input.workerId}`;
  return [
    `cd ${quoteForShell(input.workspacePath)}`,
    `node ${input.cliRelativePath} ${cliCommand} --id ${input.workerId} --command codex`,
    `tmux set-option -t ${tmuxSessionName} mouse on`,
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
