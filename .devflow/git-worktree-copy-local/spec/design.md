# Design

## 总体思路

保留现有的 glob 设置，把“从哪里复制、复制到哪里”从主仓库目录改成当前文件夹。路径规则写成不依赖 VS Code 的纯函数，创建命令只负责传入来源目录和处理界面提示。这样单测可以覆盖落点、忽略和写入，不必启动 VS Code。

## 结构与边界

| 单元 | 文件 | 职责 |
| --- | --- | --- |
| 复制规划（Copy Plan） | `src/core/util/copyWorktreePlan.ts` | 判断 glob、计算目标路径、收集条目、写入磁盘 |
| 复制入口（Copy Entry） | `src/core/util/copyWorktreeFiles.ts` | 按当前文件夹读取设置，显示进度，处理取消和错误 |
| 设置（Config） | `src/core/config/setting.ts`、`package.json` | `resource` 作用域，读取时带上文件夹 URI |
| 创建命令（Create Command） | `createWorktreeFromInfo.ts`、`addWorktreeCmd.ts`、`addWorktreeFromBranchCmd.ts` | Git 命令仍用主仓库目录，复制使用 `sourceFolder` |

`CopyEntry` 只定义一次：

```typescript
export type CopyEntryKind = 'file' | 'dir' | 'symlink';

export interface CopyEntry {
    sourcePath: string;
    targetPath: string;
    kind: CopyEntryKind;
}
```

公开函数是 `isGlobPattern`、`globCopyRoot`、`explicitCopyRoot`、`toCopyTarget`、`collectCopyEntries`、`materializeCopyEntries`。它们不导入 VS Code。

## 数据流与接口

1. `addWorktreeCmd` 传入 `sourceFolder: gitFolder`。`addWorktreeFromBranchCmd` 传入 `sourceFolder: item.fsPath`。两者的 `cwd` 仍是 `mainFolder`。
2. `git worktree add` 成功后，`copyWorktreeFiles(sourceFolder, newWorktreePath)` 执行。
3. 读取设置时使用 `vscode.Uri.file(sourceFolder)`。模式为空则直接返回。
4. `collectCopyEntries` 区分 glob 与普通路径：
   - 普通相对路径相对于 `sourceFolder`。
   - 普通绝对路径在 `sourceFolder` 内时，复制根是 `sourceFolder`；在外部时，复制根是该路径的父目录。
   - 相对 glob 的 cwd 是 `sourceFolder`。绝对 glob 的复制根是第一个 `*`、`?`、`[` 或 `{` 之前的目录。
5. 文件夹递归展开。符号链接只记录为 `symlink`。忽略模式由 fast-glob 应用。新 worktree 位于来源内部时，其路径不进入结果。
6. `materializeCopyEntries` 先保证目录存在，再覆盖同名文件或重建符号链接。它不删除目标里未被复制的文件。
7. 成功后才执行已有的 `postCreateCmd`。复制抛出的非取消错误只显示消息。

符号链接是否位于来源目录内，用 `fs.realpath` 后的路径比较，避免 macOS 上 `/var` 与 `/private/var` 被当成目录外。

## 复用点

复用现有 `worktreeCopyPatterns`、`worktreeCopyIgnores`、`copyWorktreeFiles` 的进度文案，以及 `fast-glob`。路径比较复用 `src/core/util/path.ts` 的 `comparePath`、`isSubPath`、`toSimplePath`。不新增设置项，不替换创建后命令。

## 风险与权衡

- 单测覆盖规划、忽略和磁盘写入。设置界面和 VS Code 进度条不在单测里执行。
- 把作用域改成 `resource` 后，多根工作区里每个文件夹的 `.vscode/settings.json` 可以单独覆盖。未覆盖的文件夹仍使用用户设置和扩展默认值。
- 默认增加 `.codex` 和 `.claude` 会在这两个目录存在时复制它们。目录不存在时跳过。
- 外部绝对路径只保留最后一段名称，同名来源会互相覆盖。这是已确认的落点，不另做冲突改名。
