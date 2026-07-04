import { equal, ok } from "node:assert/strict";
import { buildStartWorkerCommand, sanitizeWorkerId } from "./commandBuilder";

equal(sanitizeWorkerId("My Worker 01"), "my-worker-01");
equal(sanitizeWorkerId(""), "worker");

const command = buildStartWorkerCommand({
  workspacePath: "/Users/demo/project",
  workerId: "macos-worker",
  cliRelativePath: "tools/devflow-cli-worker/bin/devflow-worker.mjs"
});

ok(command.includes("cd '/Users/demo/project'"));
ok(command.includes("node tools/devflow-cli-worker/bin/devflow-worker.mjs start-in-vscode --id macos-worker"));
ok(command.includes("tmux attach -t devflow-worker-macos-worker"));

console.log("commandBuilder tests passed");
