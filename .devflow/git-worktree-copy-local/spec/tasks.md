# Tasks

## 实施任务

- [x] 任务 1：路径判断
  - 新建 `src/core/util/copyWorktreePlan.ts`
  - 新建 `src/test/unit/copyWorktreePlan.test.ts`
  - 覆盖 glob 判断、文件夹内相对路径、文件夹外最后一段名称、绝对 glob 的静态根目录。
  - 验收：`pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts` 通过。

- [x] 任务 2：收集复制条目
  - 实现 `collectCopyEntries`。
  - 覆盖相对文件、递归文件夹、空文件夹、相对 glob、文件夹内外绝对路径、绝对 glob、缺失来源、空模式、`node_modules` 忽略、外部目录忽略、排除位于来源内部的新 worktree、符号链接不展开。
  - 验收：同一单测文件通过。

- [x] 任务 3：写入磁盘
  - 实现 `materializeCopyEntries`。
  - 覆盖目录合并、同名文件覆盖、符号链接改指、空文件夹落盘。
  - 验收：同一单测文件通过。

- [x] 任务 4：按文件夹读取设置
  - `setting.ts` 为两个复制设置增加可选 `scopeUri`。
  - `package.json` 把两项作用域改为 `resource`，默认模式追加 `.codex` 和 `.claude`。
  - 验收：`pnpm check-types` 通过。

- [x] 任务 5：接入创建流程
  - `copyWorktreeFiles` 调用规划函数，失败不删除 worktree，取消不额外报错。
  - `ICreateWorktreeInfo.sourceFolder` 与 Git `cwd` 分离。
  - 两个创建入口传入对齐文档规定的来源。复制完成后才执行 `postCreateCmd`。
  - 验收：`pnpm check-types` 和复制单测通过。

- [x] 任务 6：说明文档与全量验证
  - 更新 `README.md`、`README.zh-CN.md` 和四份 `package.nls*.json`。
  - 验收：四份语言包与 `package.json` 可被 JSON 解析；`pnpm test:unit` 和 `pnpm check-types` 通过。

## 验证

在 `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/` 执行：

```bash
pnpm install
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
pnpm test:unit
pnpm check-types
```

详细步骤以 `plans/2026-09-29-worktree-copy-local-plan.md` 为准。提交需另获用户允许。

实际验证（2026-09-29，插件目录）：

- 先跑单测时失败，提示找不到 `copyWorktreePlan` 模块。
- 实现后 `pnpm --config.manage-package-manager-versions=false exec rstest src/test/unit/copyWorktreePlan.test.ts`：1 file，21 tests passed。
- 审查后又补了跨盘路径、`../` 符号链接、断链和已存在链接。再次执行 `pnpm --config.manage-package-manager-versions=false test:unit`：13 files，146 tests passed。
- `pnpm --config.manage-package-manager-versions=false check-types` 退出码为 0。
- `package.json` 与四份 `package.nls*.json` 可被 `JSON.parse`。
- 本机 `pnpm` 10.30.1 会尝试切换到 `package.json` 里的 pnpm 12.7.0，该二进制是损坏的占位文件。安装和测试使用 `--config.manage-package-manager-versions=false`。`pnpm install` 曾把 `pnpm-lock.yaml` 判为损坏并重写，已用 `git checkout` 恢复，锁文件不在本次改动里。
- 未在 VS Code 里实际创建 worktree，因此设置界面和进度提示尚未手动验证。
