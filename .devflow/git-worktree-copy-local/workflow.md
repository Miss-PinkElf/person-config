# 创建 Worktree 时复制本地文件（Workflow）

- 路径：重型路径（Heavy Route）
- 当前阶段：验证（Verify）
- 目标：创建 worktree 时，把当前文件夹里被 Git 忽略的指定文件和文件夹复制到新 worktree，层级保持不变。
- 范围：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager`
- 成功标准：可配置，带默认配置；相对路径从当前文件夹复制；不同文件夹可以有不同配置；文件夹整份复制。
- 阶段顺序：Align → Plan → proposal/design/tasks → Apply → Review → Verify → Close。
- 下一步：在 VS Code 里手动创建一个 worktree，确认复制结果。外层仓库已提交源码（`92e8fa1`）和本 mission。
