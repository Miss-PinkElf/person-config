# 创建 Worktree 时复制本地文件：需求对齐（Align）

## 目标

扩展现有 VS Code 插件 Git Worktree Manager。创建 worktree 时，把当前文件夹里配置的文件和文件夹复制到新 worktree，层级保持不变。`.codex`、`.claude` 这类被 Git 忽略的目录会随新 worktree 一起出现。

原始需求：`zzz-prompt-debug/修改gitworktree插件/prompt-01.md`。

## 已确认的做法

沿用现有 glob 设置，不新增第二套路径列表。

| 方案 | 优点 | 代价 | 结论 |
| --- | --- | --- | --- |
| 扩展 `worktreeCopyPatterns` | 复用现有设置、文档和复制入口 | 需要补上“文件夹整份复制”和“当前文件夹”来源 | 采用 |
| 新增显式路径列表并保留 glob | 路径写法更直观 | 两套规则并存，容易配重 | 不采用 |
| 只保留显式路径 | 行为最窄 | 已有 `*.local` 这类 glob 配置失效 | 不采用 |

## 配置

继续使用这两个设置：

- `git-worktree-manager.worktreeCopyPatterns`
- `git-worktree-manager.worktreeCopyIgnores`

两项的作用域（Configuration Scope）改为 `resource`。读取时传入当前文件夹的 URI，因此每个仓库可以在自己的 `.vscode/settings.json` 里覆盖。未覆盖时使用用户设置；用户设置也未改时使用扩展默认值。用户把模式设成空数组时，不复制任何文件，也不回退到默认值。

`worktreeCopyPatterns` 的默认值在现有三项之后追加两个目录：

```json
[".env", ".vscode/**", "*.local", ".codex", ".claude"]
```

`worktreeCopyIgnores` 的默认值保持不变，仍然排除 `node_modules`、`dist`、`.git`、`.svn`、`.hg`、`CVS`、`Thumbs.db`、`.DS_Store`。

## 复制来源与落点

Git 命令 `git worktree add` 的工作目录仍是主仓库目录（main folder）。复制来源是另一个字段 `sourceFolder`：

- 从仓库创建 worktree 时，`sourceFolder` 是用户选中的当前文件夹（`gitFolder`）。
- 从已有 worktree 项创建时，`sourceFolder` 是该项的 `fsPath`。

落点规则：

1. 不含 glob 字符的相对路径，相对于 `sourceFolder` 解析。文件按相同相对路径写入新 worktree。文件夹整份递归复制，内部层级不变。
2. 不含 glob 字符的绝对路径，直接作为来源。它位于 `sourceFolder` 内部时，按相对 `sourceFolder` 的层级写入。它位于外部时，用路径最后一段名称放到新 worktree 根目录；来源是文件夹时，整份复制到这个名称下。
3. 含有 `*`、`?`、`[`、`{` 的相对模式按 glob 处理，cwd 为 `sourceFolder`。命中的文件按相对 `sourceFolder` 的路径写入，例如 `.vscode/settings.json` 仍写到新 worktree 的 `.vscode/settings.json`。绝对 glob 的复制根目录是第一个 glob 字符之前的目录；命中的文件按相对该根目录的路径写到新 worktree 根下。
4. 来源路径不存在时跳过该项，不提示错误。空文件夹也会在新 worktree 中创建。
5. 复制文件夹时合并进目标目录，不先删除目标里已有的其他文件。同名文件覆盖。新 worktree 可能已经检出被 Git 跟踪的文件。
6. 符号链接按链接本身复制，不把链接目标展开成实体目录。
7. 新 worktree 路径若落在来源文件夹内部，复制时排除它，避免把正在生成的目录再拷进去。

忽略规则对 glob 和文件夹递归都生效。文件夹内部的相对路径用现有 `worktreeCopyIgnores` 判断。外部绝对路径复制时，忽略模式相对于该外部来源自身的根目录。

## 组件与数据流

1. `ICreateWorktreeInfo` 增加必填的 `sourceFolder`。两个创建入口传入上节定义的来源，`cwd` 仍传给 `git worktree add`。
2. worktree 创建成功后，调用 `copyWorktreeFiles(sourceFolder, newWorktreePath)`，然后再执行已有的创建后命令（postCreateCmd）。
3. `Config.get` 增加可选的文件夹 URI。复制时用 `sourceFolder` 读取上述两项设置。其他调用不传 URI，行为不变。
4. 路径规划抽到不依赖 VS Code API 的纯函数，放在 `src/core/util/copyWorktreePlan.ts`。它负责区分 glob 与普通路径、计算目标相对路径、展开文件夹，并应用忽略规则。`copyWorktreeFiles.ts` 负责进度、取消、符号链接和文件写入。
5. 某个文件复制失败时，用现有错误提示告诉用户原因，并停止后续复制。已经创建的 worktree 保留，不回滚。用户取消时停止复制，不额外弹错误。

## 测试与文档

单测使用临时目录和 `fast-glob`，不启动 VS Code。覆盖：

- 相对文件，例如 `.env`
- 相对文件夹整份复制，例如 `.codex/skills/a.md`
- 现有 glob，例如 `.vscode/**`
- 文件夹内部的绝对路径保持相对层级
- 文件夹外部的绝对路径落到新 worktree 根目录的最后一段名称下
- 不存在的来源被跳过
- `**/node_modules/**` 不会被复制进新 worktree

同步更新：

- `README.md`
- `README.zh-CN.md`
- `package.nls.json`
- `package.nls.zh-cn.json`
- `package.nls.zh-tw.json`
- `package.nls.ja.json`

说明需要写明：文件夹会整份复制；相对路径相对于当前文件夹；绝对路径的两种落点；每个仓库可以用工作区设置覆盖。

## 范围边界

本轮不新增“对已有 worktree 重新复制”的命令，不修改 `postCreateCmd` 和 `preRemoveCmd` 的语义，也不在删除 worktree 时单独清理这些文件。删除整个 worktree 目录时，复制过去的文件会一起消失。
