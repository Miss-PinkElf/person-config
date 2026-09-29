# 创建 Worktree 时复制本地文件（State）

- 当前阶段：验证（Verify）
- 当前路径：重型路径（Heavy Route）
- 代码：外层仓库提交 `92e8fa1` 已纳入插件源码。复制逻辑在 `src/core/util/copyWorktreePlan.ts`。插件自己的嵌套仓库里，这些改动仍未提交。
- 已验证：审查修复后单测 146 项通过，`tsc --noEmit` 退出码 0。证据在 `spec/tasks.md`。
- 未验证：还没有在 VS Code 里创建 worktree，确认设置和进度提示。
- 本次提交：本 mission 文档进入外层仓库。根目录 `package-lock.json` 不提交，那里没有 `package.json`，锁文件是空的。
- 下一步：在 VS Code 里手动创建一个 worktree，确认复制结果。
