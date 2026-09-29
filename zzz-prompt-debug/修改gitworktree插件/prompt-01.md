### 需求01
1. 现在需要对一个vscode插件功能进行扩展，源码在:zzz-prompt-debug/修改gitworktree插件/git-worktree-manager
   1. 当创建worktree的时候，可以复制某些文件夹，和文件过去
   2. 比如我在当前分支，创建worktree a，当前分支的文件比如.codex,.claude,这些被gitignore忽略的，不会随着worktree的创建而被创建，所以我需要创建的时候同步cv过去
   3. 文件夹，和文件直接复制过去即可，层级不需要改变，这个是可以配置的，有一个默认配置，不同文件夹是不同的，就像不同的文件夹，worktree不一样，如果不写绝对路径，就默认从当前分支，也就是当前文件夹复制对应的文件即可