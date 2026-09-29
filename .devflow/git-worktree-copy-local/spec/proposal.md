# Proposal

## 背景

创建 Git worktree 时，`.codex`、`.claude` 这类被 Git 忽略的文件不会出现在新目录里。Git Worktree Manager 已有 `worktreeCopyPatterns`，但复制来源是主仓库目录（main folder），而且只写文件夹名时不会把文件夹内容一起复制。用户需要在创建时，从当前所在文件夹把这些本地文件原样带过去。

原始需求：`zzz-prompt-debug/修改gitworktree插件/prompt-01.md`。

## 目标

扩展插件 `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager`：

- 创建 worktree 成功后，从当前文件夹复制 `worktreeCopyPatterns` 命中的文件和文件夹。
- 文件夹整份复制，层级不变。默认在现有模式后增加 `.codex` 和 `.claude`。
- 每个仓库可以用自己的 `.vscode/settings.json` 覆盖。
- 相对路径从当前文件夹解析。绝对路径按对齐文档的两种落点处理。
- 复制失败只提示，不撤销已经创建的 worktree。

## 范围

- 新增不依赖 VS Code 的 `copyWorktreePlan.ts` 及其单测。
- `worktreeCopyPatterns` 与 `worktreeCopyIgnores` 的作用域改为 `resource`。
- `Config.get` 对这两项接受可选文件夹 URI。
- `ICreateWorktreeInfo` 增加 `sourceFolder`。两个创建入口分别传入当前选中文件夹和 worktree 项路径。
- `git worktree add` 的工作目录仍是主仓库目录。
- 更新 README 和四份语言包说明。

## 非目标

- 不新增第二套路径列表设置。
- 不新增“对已有 worktree 重新复制”的命令。
- 不修改 `postCreateCmd` 和 `preRemoveCmd` 的语义。
- 不在删除 worktree 时单独清理复制出去的文件。
- 不提交代码，除非用户另行允许。

## 边界场景

- 模式为空数组：不复制。
- 来源不存在：跳过该项，不报错。
- 空文件夹：在新 worktree 中创建。
- 目标里已有同名文件：覆盖该文件，保留目标目录中的其他文件。
- 符号链接：复制链接本身，不展开成实体目录。链接目标位于来源目录内时，改指到新 worktree 中的对应位置。
- 新 worktree 位于来源文件夹内部：不把新目录再复制进去。
- 当前文件夹外的绝对路径：用最后一段名称放到新 worktree 根目录。忽略规则相对于该外部来源自身。
- 绝对 glob：复制根目录是第一个 glob 字符之前的目录。
- 复制中取消：停止，不额外弹错误。
- 复制失败：提示原因，保留已创建的 worktree。

## 开放问题

无阻塞开放问题。用户已授权规格写完后在本会话进入实施（Apply）。
