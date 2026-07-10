import { equal, ok } from "node:assert/strict";
import { buildAttachWorkerCommand, buildEnsureWorkerCommand, buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

equal(sanitizeWorkerId("My Worker 01"), "my-worker-01");
equal(sanitizeWorkerId(""), "worker");

const command = buildStartWorkerCommand({
  workspacePath: "/Users/demo/project",
  workerId: "macos-worker",
  cliRelativePath: ".codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs"
});

ok(command.includes("cd '/Users/demo/project'"));
ok(command.includes("node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs start-in-vscode --id macos-worker"));
ok(command.includes("tmux set-option -t devflow-worker-macos-worker mouse on"));
ok(command.includes("tmux attach -t devflow-worker-macos-worker"));

const ensureCommand = buildEnsureWorkerCommand({
  workspacePath: "/Users/demo/project",
  workerId: "macos-worker",
  cliRelativePath: ".codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs"
});

ok(ensureCommand.includes("cd '/Users/demo/project'"));
ok(ensureCommand.includes("node .codex/skills/devflow-cli-worker/cli/bin/devflow-worker.mjs ensure-in-vscode --id macos-worker --command codex"));
ok(ensureCommand.includes("tmux attach -t devflow-worker-macos-worker"));

const attachCommand = buildAttachWorkerCommand({ workspacePath: "/Users/demo/project", workerId: "research-a" });
ok(attachCommand.includes("cd '/Users/demo/project'"));
ok(attachCommand.includes("tmux set-option -t devflow-worker-research-a mouse on"));
ok(attachCommand.includes("tmux attach -t devflow-worker-research-a"));

console.log("commandBuilder tests passed");
