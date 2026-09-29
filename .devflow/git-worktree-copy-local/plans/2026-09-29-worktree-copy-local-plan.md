# 创建 Worktree 时复制本地文件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 worktree 时，从当前文件夹把配置的文件和文件夹复制到新 worktree，层级保持不变，默认包含 `.codex` 和 `.claude`。

**Architecture:** 路径规划和无界面的文件写入放在不依赖 VS Code 的 `copyWorktreePlan.ts`，用临时目录单测锁住规则。`copyWorktreeFiles.ts` 只负责按当前文件夹读取设置、显示进度、处理取消和错误提示。`git worktree add` 仍在主仓库目录（main folder）执行，复制来源使用单独的 `sourceFolder`。

**Tech Stack:** TypeScript、VS Code Extension API、fast-glob 3、Node.js `fs`、rstest。插件目录为 `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager`。

---

## 执行说明

- 对齐依据：`plans/2026-09-29-worktree-copy-local-align.md`。
- 重型路径（Heavy Route）在进入实施（Apply）前，还要把本计划落成当前 mission 的 `spec/proposal.md`、`spec/design.md`、`spec/tasks.md`。只有计划、没有这三份时，不得改插件代码。
- 下面的命令都在插件目录执行：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager`。
- 本仓库规则要求提交前询问用户。每个任务末尾的 `git commit` 只在用户明确允许后执行，提交信息使用中文。未允许时不要执行 commit。
- 当前插件目录没有 `node_modules`。任务 1 要先安装依赖。

## 已确认约束

- 继续使用 `worktreeCopyPatterns` 和 `worktreeCopyIgnores`，不新增第二套设置。
- 两项作用域（Configuration Scope）改为 `resource`。读取时传入当前文件夹 URI。
- 默认模式为 `.env`、`.vscode/**`、`*.local`、`.codex`、`.claude`。忽略列表不改。
- 用户把模式设成空数组时，不复制任何文件。
- 相对路径和相对 glob 相对于 `sourceFolder`，层级不变。文件夹整份递归复制。空文件夹也创建。
- 文件夹内的绝对路径保持相对 `sourceFolder` 的层级。文件夹外的非 glob 绝对路径用最后一段名称放到新 worktree 根目录。
- 绝对 glob 的复制根目录是第一个 glob 字符之前的目录。命中的文件按相对该根目录的路径写到新 worktree 根下。
- glob 字符是 `*`、`?`、`[`、`{`。
- 来源不存在则跳过，不报错。忽略规则对 glob 和文件夹递归都生效。外部来源的忽略根目录是该来源自身。
- 复制文件夹时合并，不先删除目标里的其他文件。同名文件覆盖。
- 符号链接按链接本身复制，不展开链接目标。
- 新 worktree 若位于来源文件夹内部，复制时排除它。
- 复制失败只提示，不删除已创建的 worktree。取消时不额外弹错误。
- 复制发生在 worktree 创建成功之后、`postCreateCmd` 之前。

## 文件结构

- 新建：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts`
  - 判断 glob、计算目标路径、收集复制条目、把条目写到磁盘。不导入 VS Code。
- 新建：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreeFiles.ts`
  - 读取当前文件夹的设置，调用规划函数，保留进度和错误提示。
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/config/setting.ts`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.json`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/types.ts`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/createWorktreeFromInfo.ts`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeCmd.ts`
- 修改：`zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeFromBranchCmd.ts`
- 修改：`README.md`、`README.zh-CN.md`、`package.nls.json`、`package.nls.zh-cn.json`、`package.nls.zh-tw.json`、`package.nls.ja.json`，均在插件目录内。

## 任务 1：路径判断

**Files:**

- Create: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts`
- Create: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts`

- [ ] **Step 1: 安装依赖**

在插件目录执行：

```bash
pnpm install
```

期望退出码为 0，并生成 `node_modules/`。不要把 `node_modules/` 加入 git。

- [ ] **Step 2: 写会失败的测试**

把下面内容写入 `src/test/unit/copyWorktreePlan.test.ts`。

```typescript
import { afterEach, describe, expect, it } from '@rstest/core';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { explicitCopyRoot, globCopyRoot, isGlobPattern, toCopyTarget } from '../../core/util/copyWorktreePlan';

const tempDirs: string[] = [];

async function makeTemp(): Promise<string> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wt-copy-'));
    tempDirs.push(dir);
    return dir;
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('isGlobPattern', () => {
    it('treats wildcard characters as glob', () => {
        expect(isGlobPattern('.vscode/**')).toBe(true);
        expect(isGlobPattern('*.local')).toBe(true);
        expect(isGlobPattern('/tmp/shared/*.local')).toBe(true);
    });

    it('treats plain relative and absolute paths as paths', () => {
        expect(isGlobPattern('.codex')).toBe(false);
        expect(isGlobPattern('.claude')).toBe(false);
        expect(isGlobPattern('/tmp/shared')).toBe(false);
    });
});

describe('copy roots and targets', () => {
    it('keeps files inside the source folder on their relative path', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        const sourcePath = path.join(source, '.codex', 'skills', 'a.md');

        expect(explicitCopyRoot(source, sourcePath)).toBe(source);
        expect(toCopyTarget(source, sourcePath, target)).toBe(path.join(target, '.codex', 'skills', 'a.md'));
    });

    it('places an outside path under its final segment', async () => {
        const source = await makeTemp();
        const outside = await makeTemp();
        const target = await makeTemp();
        const filePath = path.join(outside, 'solo.txt');

        expect(explicitCopyRoot(source, filePath)).toBe(outside);
        expect(toCopyTarget(outside, filePath, target)).toBe(path.join(target, 'solo.txt'));
        expect(toCopyTarget(path.dirname(outside), outside, target)).toBe(path.join(target, path.basename(outside)));
    });

    it('uses the directory before the first glob character as the absolute glob root', async () => {
        const outside = await makeTemp();
        expect(globCopyRoot(path.join(outside, '*.local'))).toBe(outside);
        expect(globCopyRoot('*.local')).toBe('');
    });
});
```

- [ ] **Step 3: 运行测试并确认失败**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望失败，原因是找不到 `copyWorktreePlan` 模块。

- [ ] **Step 4: 写最小实现**

把下面内容写入 `src/core/util/copyWorktreePlan.ts`。

```typescript
import path from 'path';
import { comparePath, isSubPath } from '@/core/util/path';

const GLOB_PATTERN = /[*?[{]/;

export function isGlobPattern(pattern: string): boolean {
    return GLOB_PATTERN.test(pattern);
}

export function globCopyRoot(pattern: string): string {
    const index = pattern.search(GLOB_PATTERN);
    if (index <= 0) return '';
    const normalized = path.normalize(pattern.slice(0, index));
    const stripped = normalized.replace(/[\\/]+$/, '');
    return stripped || path.parse(normalized).root;
}

export function explicitCopyRoot(sourceFolder: string, sourcePath: string): string {
    if (comparePath(sourceFolder, sourcePath) || isSubPath(sourceFolder, sourcePath)) {
        return sourceFolder;
    }
    return path.dirname(sourcePath);
}

export function toCopyTarget(copyRoot: string, sourcePath: string, targetWorktree: string): string {
    const relative = path.relative(copyRoot, sourcePath);
    if (!relative || relative === '.') {
        return targetWorktree;
    }
    if (relative === '..' || relative.startsWith(`..${path.sep}`)) {
        return path.join(targetWorktree, path.basename(sourcePath));
    }
    return path.join(targetWorktree, relative);
}
```

- [ ] **Step 5: 运行测试并确认通过**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望退出码为 0。

- [ ] **Step 6: 提交**

用户允许后再执行。提交信息：`测试并实现 worktree 复制路径判断`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts"
git commit -m "测试并实现 worktree 复制路径判断"
```

## 任务 2：收集复制条目

**Files:**

- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts`

- [ ] **Step 1: 把收集行为的失败测试追加到现有测试文件**

把测试文件顶部的 import 换成：

```typescript
import { afterEach, describe, expect, it } from '@rstest/core';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {
    collectCopyEntries,
    explicitCopyRoot,
    globCopyRoot,
    isGlobPattern,
    toCopyTarget,
    type CopyEntry,
} from '../../core/util/copyWorktreePlan';
```

保留任务 1 已有的 `tempDirs`、`makeTemp`、`afterEach` 和两组 `describe`。在文件末尾追加：

```typescript
function fileTargets(entries: CopyEntry[], target: string): string[] {
    return entries
        .filter((entry) => entry.kind === 'file')
        .map((entry) => path.relative(target, entry.targetPath))
        .sort();
}

describe('collectCopyEntries', () => {
    it('copies a relative file', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, '.env'), 'TOKEN=1');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.env'],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual(['.env']);
    });

    it('copies a relative directory recursively', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        const nested = path.join(source, '.codex', 'skills');
        await fs.mkdir(nested, { recursive: true });
        await fs.writeFile(path.join(nested, 'a.md'), 'hi');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.codex'],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('.codex', 'skills', 'a.md')]);
    });

    it('creates an empty directory entry', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.mkdir(path.join(source, '.claude'));

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.claude'],
            ignorePatterns: [],
        });

        expect(entries).toContainEqual({
            sourcePath: path.join(source, '.claude'),
            targetPath: path.join(target, '.claude'),
            kind: 'dir',
        });
    });

    it('keeps a relative glob hierarchy', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.mkdir(path.join(source, '.vscode'), { recursive: true });
        await fs.writeFile(path.join(source, '.vscode', 'settings.json'), '{}');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.vscode/**'],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('.vscode', 'settings.json')]);
    });

    it('keeps an absolute path inside the source folder', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        const filePath = path.join(source, '.claude', 'settings.json');
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, '{}');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: [filePath],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('.claude', 'settings.json')]);
    });

    it('places an outside absolute directory under its folder name', async () => {
        const source = await makeTemp();
        const outside = await makeTemp();
        const target = await makeTemp();
        const payload = path.join(outside, 'payload');
        await fs.mkdir(payload, { recursive: true });
        await fs.writeFile(path.join(payload, 'note.txt'), 'n');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: [payload],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('payload', 'note.txt')]);
    });

    it('applies ignore patterns relative to an outside directory', async () => {
        const source = await makeTemp();
        const outside = await makeTemp();
        const target = await makeTemp();
        const payload = path.join(outside, 'payload');
        await fs.mkdir(path.join(payload, 'node_modules'), { recursive: true });
        await fs.writeFile(path.join(payload, 'node_modules', 'pkg.js'), 'x');
        await fs.writeFile(path.join(payload, 'keep.txt'), 'k');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: [payload],
            ignorePatterns: ['**/node_modules/**'],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('payload', 'keep.txt')]);
    });

    it('places an absolute glob match under the static root', async () => {
        const source = await makeTemp();
        const outside = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(outside, 'a.local'), 'a');
        await fs.writeFile(path.join(outside, 'b.txt'), 'b');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: [path.join(outside, '*.local')],
            ignorePatterns: [],
        });

        expect(fileTargets(entries, target)).toEqual(['a.local']);
    });

    it('skips a missing source', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.missing'],
            ignorePatterns: [],
        });
        expect(entries).toEqual([]);
    });

    it('returns no entries for an empty pattern list', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, '.env'), 'TOKEN=1');
        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: [],
            ignorePatterns: [],
        });
        expect(entries).toEqual([]);
    });

    it('does not copy ignored files inside a directory', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.mkdir(path.join(source, '.codex', 'node_modules'), { recursive: true });
        await fs.writeFile(path.join(source, '.codex', 'node_modules', 'pkg.js'), 'x');
        await fs.writeFile(path.join(source, '.codex', 'keep.txt'), 'k');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.codex'],
            ignorePatterns: ['**/node_modules/**'],
        });

        expect(fileTargets(entries, target)).toEqual([path.join('.codex', 'keep.txt')]);
    });

    it('does not copy the new worktree when it is inside the source folder', async () => {
        const source = await makeTemp();
        const target = path.join(source, 'new-wt');
        await fs.mkdir(target);
        await fs.writeFile(path.join(source, '.env'), 'a');
        await fs.writeFile(path.join(target, 'secret.txt'), 'nope');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['**/*'],
            ignorePatterns: [],
        });

        expect(entries.some((entry) => entry.sourcePath.endsWith('secret.txt'))).toBe(false);
        expect(fileTargets(entries, target)).toContain('.env');
    });

    it('marks a symlink without expanding it', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, 'real.txt'), 'data');
        await fs.symlink(path.join(source, 'real.txt'), path.join(source, 'link.txt'));

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['link.txt'],
            ignorePatterns: [],
        });

        expect(entries).toEqual([
            {
                sourcePath: path.join(source, 'link.txt'),
                targetPath: path.join(target, 'link.txt'),
                kind: 'symlink',
            },
        ]);
    });
});
```

- [ ] **Step 2: 运行测试并确认失败**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望失败，原因是 `collectCopyEntries` 尚未导出。

- [ ] **Step 3: 实现收集函数**

把 `src/core/util/copyWorktreePlan.ts` 替换为：

```typescript
import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import { comparePath, isSubPath, toSimplePath } from '@/core/util/path';

const GLOB_PATTERN = /[*?[{]/;

export type CopyEntryKind = 'file' | 'dir' | 'symlink';

export interface CopyEntry {
    sourcePath: string;
    targetPath: string;
    kind: CopyEntryKind;
}

interface CollectOptions {
    sourceFolder: string;
    targetWorktree: string;
    patterns: string[];
    ignorePatterns: string[];
}

interface CollectContext extends CollectOptions {
    seen: Set<string>;
    entries: CopyEntry[];
}

export function isGlobPattern(pattern: string): boolean {
    return GLOB_PATTERN.test(pattern);
}

export function globCopyRoot(pattern: string): string {
    const index = pattern.search(GLOB_PATTERN);
    if (index <= 0) return '';
    const normalized = path.normalize(pattern.slice(0, index));
    const stripped = normalized.replace(/[\\/]+$/, '');
    return stripped || path.parse(normalized).root;
}

export function explicitCopyRoot(sourceFolder: string, sourcePath: string): string {
    if (comparePath(sourceFolder, sourcePath) || isSubPath(sourceFolder, sourcePath)) {
        return sourceFolder;
    }
    return path.dirname(sourcePath);
}

export function toCopyTarget(copyRoot: string, sourcePath: string, targetWorktree: string): string {
    const relative = path.relative(copyRoot, sourcePath);
    if (!relative || relative === '.') {
        return targetWorktree;
    }
    if (relative === '..' || relative.startsWith(`..${path.sep}`)) {
        return path.join(targetWorktree, path.basename(sourcePath));
    }
    return path.join(targetWorktree, relative);
}

function isInsideOrEqual(parent: string, child: string): boolean {
    return comparePath(parent, child) || isSubPath(parent, child);
}

function pushEntry(ctx: CollectContext, sourcePath: string, copyRoot: string, kind: CopyEntryKind): void {
    if (isInsideOrEqual(ctx.targetWorktree, sourcePath)) return;
    const key = toSimplePath(sourcePath);
    if (ctx.seen.has(key)) return;
    ctx.seen.add(key);
    ctx.entries.push({
        sourcePath,
        targetPath: toCopyTarget(copyRoot, sourcePath, ctx.targetWorktree),
        kind,
    });
}

async function isIgnoredFile(sourcePath: string, ctx: CollectContext): Promise<boolean> {
    if (ctx.ignorePatterns.length === 0) return false;
    const ignoreRoot = isInsideOrEqual(ctx.sourceFolder, sourcePath) ? ctx.sourceFolder : path.dirname(sourcePath);
    const relative = path.relative(ignoreRoot, sourcePath);
    const matches = await fg(fg.escapePath(relative), {
        cwd: ignoreRoot,
        absolute: true,
        dot: true,
        onlyFiles: false,
        followSymbolicLinks: false,
        ignore: ctx.ignorePatterns,
    });
    return matches.length === 0;
}

async function addDirectoryTree(dirPath: string, copyRoot: string, ctx: CollectContext): Promise<void> {
    pushEntry(ctx, dirPath, copyRoot, 'dir');
    const ignoreRoot = isInsideOrEqual(ctx.sourceFolder, dirPath) ? ctx.sourceFolder : dirPath;
    const relativeDir = path.relative(ignoreRoot, dirPath);
    const pattern = !relativeDir || relativeDir === '.' ? '**/*' : `${fg.escapePath(relativeDir)}/**`;
    const children = await fg(pattern, {
        cwd: ignoreRoot,
        absolute: true,
        dot: true,
        onlyFiles: false,
        followSymbolicLinks: false,
        ignore: ctx.ignorePatterns,
        unique: true,
    });
    for (const child of children) {
        if (isInsideOrEqual(ctx.targetWorktree, child)) continue;
        const stat = await fs.lstat(child);
        if (stat.isSymbolicLink()) {
            pushEntry(ctx, child, copyRoot, 'symlink');
        } else if (stat.isDirectory()) {
            pushEntry(ctx, child, copyRoot, 'dir');
        } else {
            pushEntry(ctx, child, copyRoot, 'file');
        }
    }
}

async function addPath(sourcePath: string, copyRoot: string, ctx: CollectContext): Promise<void> {
    if (ctx.seen.has(toSimplePath(sourcePath))) return;
    if (isInsideOrEqual(ctx.targetWorktree, sourcePath)) return;
    let stat: Awaited<ReturnType<typeof fs.lstat>>;
    try {
        stat = await fs.lstat(sourcePath);
    } catch {
        return;
    }
    if (stat.isSymbolicLink()) {
        if (await isIgnoredFile(sourcePath, ctx)) return;
        pushEntry(ctx, sourcePath, copyRoot, 'symlink');
        return;
    }
    if (stat.isDirectory()) {
        await addDirectoryTree(sourcePath, copyRoot, ctx);
        return;
    }
    if (await isIgnoredFile(sourcePath, ctx)) return;
    pushEntry(ctx, sourcePath, copyRoot, 'file');
}

async function addGlob(pattern: string, ctx: CollectContext): Promise<void> {
    const absolute = path.isAbsolute(pattern);
    const copyRoot = absolute ? globCopyRoot(pattern) || path.parse(pattern).root : ctx.sourceFolder;
    const cwd = copyRoot || ctx.sourceFolder;
    const globPattern = absolute ? path.relative(cwd, pattern) : pattern;
    const matches = await fg(globPattern, {
        cwd,
        absolute: true,
        dot: true,
        onlyFiles: false,
        followSymbolicLinks: false,
        ignore: ctx.ignorePatterns,
        unique: true,
    });
    for (const match of matches) {
        await addPath(match, copyRoot, ctx);
    }
}

export async function collectCopyEntries(options: CollectOptions): Promise<CopyEntry[]> {
    const ctx: CollectContext = {
        ...options,
        seen: new Set<string>(),
        entries: [],
    };
    for (const pattern of options.patterns.map((item) => item.trim()).filter(Boolean)) {
        if (isGlobPattern(pattern)) {
            await addGlob(pattern, ctx);
            continue;
        }
        const sourcePath = path.isAbsolute(pattern) ? pattern : path.resolve(options.sourceFolder, pattern);
        await addPath(sourcePath, explicitCopyRoot(options.sourceFolder, sourcePath), ctx);
    }
    ctx.entries.sort((left, right) => {
        if (left.kind === 'dir' && right.kind !== 'dir') return -1;
        if (right.kind === 'dir' && left.kind !== 'dir') return 1;
        return left.targetPath.length - right.targetPath.length;
    });
    return ctx.entries;
}
```

- [ ] **Step 4: 运行测试并确认通过**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望退出码为 0。若 `**/node_modules/**` 没有滤掉 `pkg.js`，只调整 `addDirectoryTree` 的 ignore 用法，不放宽断言。

- [ ] **Step 5: 提交**

用户允许后再执行。提交信息：`测试并实现 worktree 复制条目收集`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts"
git commit -m "测试并实现 worktree 复制条目收集"
```

## 任务 3：写入磁盘

**Files:**

- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts`

- [ ] **Step 1: 追加写入行为的失败测试**

在 import 中加入 `materializeCopyEntries`。在测试文件末尾追加：

```typescript
describe('materializeCopyEntries', () => {
    it('merges a directory and overwrites only the same file', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.mkdir(path.join(source, '.vscode'), { recursive: true });
        await fs.mkdir(path.join(target, '.vscode'), { recursive: true });
        await fs.writeFile(path.join(source, '.vscode', 'settings.json'), 'new');
        await fs.writeFile(path.join(target, '.vscode', 'settings.json'), 'old');
        await fs.writeFile(path.join(target, '.vscode', 'other.json'), 'keep');

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.vscode'],
            ignorePatterns: [],
        });
        await materializeCopyEntries(entries);

        expect(await fs.readFile(path.join(target, '.vscode', 'settings.json'), 'utf8')).toBe('new');
        expect(await fs.readFile(path.join(target, '.vscode', 'other.json'), 'utf8')).toBe('keep');
    });

    it('copies a symlink as a link and retargets it when the target is inside the source directory', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, 'real.txt'), 'data');
        await fs.symlink('real.txt', path.join(source, 'link.txt'));

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['link.txt'],
            ignorePatterns: [],
        });
        await materializeCopyEntries(entries);

        expect(await fs.readlink(path.join(target, 'link.txt'))).toBe(path.join(target, 'real.txt'));
    });

    it('creates an empty directory on disk', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.mkdir(path.join(source, '.codex'));
        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.codex'],
            ignorePatterns: [],
        });
        await materializeCopyEntries(entries);
        const stat = await fs.stat(path.join(target, '.codex'));
        expect(stat.isDirectory()).toBe(true);
    });
});
```

- [ ] **Step 2: 运行测试并确认失败**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望失败，原因是 `materializeCopyEntries` 尚未导出。

- [ ] **Step 3: 实现写入**

在 `copyWorktreePlan.ts` 顶部补上：

```typescript
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
```

在文件末尾追加：

```typescript
async function copySymbolicLink(source: string, target: string): Promise<void> {
    const targetDir = path.dirname(target);
    await fs.mkdir(targetDir, { recursive: true });
    const realTargetPath = await fs.realpath(source);
    const realSourceDir = await fs.realpath(path.dirname(source));
    const linkStat = await fs.stat(realTargetPath);
    const linkType: 'file' | 'dir' | 'junction' = linkStat.isDirectory() ? 'dir' : 'file';
    const relativePath = path.relative(realSourceDir, realTargetPath);
    const insideSourceDir = relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`);
    if (insideSourceDir) {
        await fs.symlink(path.resolve(targetDir, relativePath), target, linkType);
        return;
    }
    await fs.symlink(realTargetPath, target, linkType);
}

export async function materializeCopyEntries(entries: CopyEntry[], signal?: AbortSignal): Promise<void> {
    for (const entry of entries) {
        if (signal?.aborted) {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            throw error;
        }
        if (entry.kind === 'dir') {
            await fs.mkdir(entry.targetPath, { recursive: true });
            continue;
        }
        if (entry.kind === 'symlink') {
            await copySymbolicLink(entry.sourcePath, entry.targetPath);
            continue;
        }
        await fs.mkdir(path.dirname(entry.targetPath), { recursive: true });
        await pipeline(createReadStream(entry.sourcePath), createWriteStream(entry.targetPath), { signal });
    }
}
```

- [ ] **Step 4: 运行测试并确认通过**

```bash
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

期望退出码为 0。

- [ ] **Step 5: 提交**

用户允许后再执行。提交信息：`测试并实现 worktree 复制写入`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreePlan.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/test/unit/copyWorktreePlan.test.ts"
git commit -m "测试并实现 worktree 复制写入"
```

## 任务 4：按文件夹读取设置

**Files:**

- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/config/setting.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.json`

- [ ] **Step 1: 给两个复制设置增加可选文件夹参数**

在 `setting.ts` 中，把这两行重载：

```typescript
static get(key: 'worktreeCopyPatterns', defaultValue: []): string[];
static get(key: 'worktreeCopyIgnores', defaultValue: []): string[];
```

换成：

```typescript
static get(key: 'worktreeCopyPatterns', defaultValue: [], scopeUri?: vscode.Uri): string[];
static get(key: 'worktreeCopyIgnores', defaultValue: [], scopeUri?: vscode.Uri): string[];
```

把实现签名和函数体换成：

```typescript
static get<T>(key: string, defaultValue: T, scopeUri?: vscode.Uri): T {
    return vscode.workspace.getConfiguration(APP_NAME, scopeUri).get(key, defaultValue);
}
```

其他重载不增加第三个参数。不传 `scopeUri` 的现有调用保持原样。

- [ ] **Step 2: 修改 package.json 的默认值和作用域**

`git-worktree-manager.worktreeCopyPatterns` 增加 `"scope": "resource"`，`default` 改为：

```json
[".env", ".vscode/**", "*.local", ".codex", ".claude"]
```

`git-worktree-manager.worktreeCopyIgnores` 只增加 `"scope": "resource"`。它的 `default` 数组保持不变。

- [ ] **Step 3: 做类型检查**

```bash
pnpm check-types
```

期望退出码为 0。

- [ ] **Step 4: 提交**

用户允许后再执行。提交信息：`按文件夹读取 worktree 复制设置`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/config/setting.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.json"
git commit -m "按文件夹读取 worktree 复制设置"
```

## 任务 5：接入创建流程的复制来源

**Files:**

- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreeFiles.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/types.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/createWorktreeFromInfo.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeCmd.ts`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeFromBranchCmd.ts`

- [ ] **Step 1: 用规划结果替换旧的 glob 复制**

把 `src/core/util/copyWorktreeFiles.ts` 整文件替换为：

```typescript
import * as vscode from 'vscode';
import { Config } from '@/core/config/setting';
import { actionProgressWrapper } from '@/core/ui/progress';
import { withResolvers } from '@/core/util/promise';
import { collectCopyEntries, materializeCopyEntries } from '@/core/util/copyWorktreePlan';

export async function copyWorktreeFiles(sourceRepo: string, targetWorktree: string) {
    const waitingCopy = withResolvers<void>();
    const tokenSource = new vscode.CancellationTokenSource();
    const abortController = new AbortController();
    let disposeAbortSignal: vscode.Disposable | undefined;

    try {
        disposeAbortSignal = tokenSource.token.onCancellationRequested(() => {
            abortController.abort();
        });

        const scope = vscode.Uri.file(sourceRepo);
        const patterns = Config.get('worktreeCopyPatterns', [], scope).filter(Boolean);
        const ignorePatterns = Config.get('worktreeCopyIgnores', [], scope).filter(Boolean);
        if (patterns.length === 0) return;

        const entries = await collectCopyEntries({
            sourceFolder: sourceRepo,
            targetWorktree,
            patterns,
            ignorePatterns,
        });
        if (entries.length === 0) return;

        actionProgressWrapper(
            vscode.l10n.t('Copying files to worktree {path}', { path: targetWorktree }),
            () => waitingCopy.promise,
            () => {},
            tokenSource,
        );

        await materializeCopyEntries(entries, abortController.signal);
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            return;
        }
        vscode.window.showErrorMessage(
            vscode.l10n.t('Failed to copy files: {error}', { error: error.message || error }),
        );
    } finally {
        disposeAbortSignal?.dispose();
        tokenSource.dispose();
        waitingCopy.resolve();
    }
}
```

这里不删除 `targetWorktree`，也不调用 worktree 删除命令。取消只从 `catch` 返回。

- [ ] **Step 2: 增加 sourceFolder，并保持 Git 命令的 cwd**

在 `src/types.ts` 的 `ICreateWorktreeInfo` 中增加必填字段：

```typescript
export interface ICreateWorktreeInfo {
    folderPath: string;
    name: string;
    label: string;
    isBranch: boolean;
    cwd: string;
    sourceFolder: string;
}
```

`createWorktreeFromInfo.ts` 解构出 `sourceFolder`。`addWorktree` 仍使用原来的 `cwd`。创建成功并取得 `mainFolder` 后，把复制调用改为：

```typescript
if (sourceFolder) {
    await copyWorktreeFiles(sourceFolder, folderPath);
}

await postCreateWorktree({
    worktreePath: folderPath,
    basePath: mainFolder,
});
```

不要再把 `mainFolder` 传给 `copyWorktreeFiles`。`postCreateCmd` 仍在复制之后执行。

`addWorktreeCmd.ts` 的 `createWorktreeFromInfo` 参数增加 `sourceFolder: gitFolder`，`cwd` 继续是 `mainFolder`。

`addWorktreeFromBranchCmd.ts` 的参数增加 `sourceFolder: item.fsPath`，`cwd` 继续是 `mainFolder`。

- [ ] **Step 3: 运行类型检查和单测**

```bash
pnpm check-types
pnpm exec rstest src/test/unit/copyWorktreePlan.test.ts
```

两个命令的期望退出码都是 0。

- [ ] **Step 4: 提交**

用户允许后再执行。提交信息：`创建 worktree 时从当前文件夹复制`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/util/copyWorktreeFiles.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/types.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/createWorktreeFromInfo.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeCmd.ts" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/src/core/command/addWorktreeFromBranchCmd.ts"
git commit -m "创建 worktree 时从当前文件夹复制"
```

## 任务 6：说明文档

**Files:**

- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/README.zh-CN.md`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/README.md`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.json`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.zh-cn.json`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.zh-tw.json`
- Modify: `zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.ja.json`

- [ ] **Step 1: 更新中文和英文 README**

把 `README.zh-CN.md` 里这两个配置段换成：

```markdown
- **`git-worktree-manager.worktreeCopyPatterns`**  
  创建 worktree 时，从当前文件夹复制匹配的文件和文件夹。文件夹会整份复制，内部层级不变。相对路径相对于当前文件夹。当前文件夹内的绝对路径保持相对层级；当前文件夹外的绝对路径用最后一段名称放到新 worktree 根目录。每个仓库可在自己的 `.vscode/settings.json` 里覆盖。默认包含 `.env`、`.vscode/**`、`*.local`、`.codex`、`.claude`。  
  **示例:** `[".codex", ".claude", ".env.local"]`

- **`git-worktree-manager.worktreeCopyIgnores`**  
  复制时排除匹配的文件或路径，即使它们符合 `worktreeCopyPatterns`。当前文件夹内的路径相对于当前文件夹判断；当前文件夹外的绝对路径相对于该来源自身的根目录判断。  
  **示例:** `["**/node_modules/**", "**/dist/**"]`
```

把 `README.md` 里对应的两段换成：

```markdown
- **`git-worktree-manager.worktreeCopyPatterns`**  
  Copy matching files and folders from the current folder when creating a worktree. A folder is copied recursively and keeps its internal hierarchy. Relative patterns resolve against the current folder. An absolute path inside the current folder keeps that relative hierarchy; an absolute path outside it is placed at the new worktree root under its final path segment. Each repository can override this in its own `.vscode/settings.json`. Defaults include `.env`, `.vscode/**`, `*.local`, `.codex`, and `.claude`.  
  **Example:** `[".codex", ".claude", ".env.local"]`

- **`git-worktree-manager.worktreeCopyIgnores`**  
  Exclude matching files or paths from the copy, even when they match `worktreeCopyPatterns`. Paths inside the current folder are judged relative to that folder. An absolute path outside the current folder is judged relative to that source path's own root.  
  **Example:** `["**/node_modules/**", "**/dist/**"]`
```

- [ ] **Step 2: 更新四份语言包说明**

`package.nls.zh-cn.json`：

```json
"config.worktreeCopyPatterns.description": "创建新 Worktree 时从当前文件夹复制的 glob 或路径。文件夹会整份复制，内部层级不变。相对路径相对于当前文件夹。当前文件夹内的绝对路径保持相对层级；当前文件夹外的绝对路径用最后一段名称放到新 Worktree 根目录。每个仓库可在自己的工作区设置中覆盖。扩展使用 [fast-glob](https://github.com/mrmlnc/fast-glob)。",
"config.worktreeCopyIgnores.description": "复制到新 Worktree 时排除的 glob。当前文件夹内的路径相对于当前文件夹判断；当前文件夹外的绝对路径相对于该来源自身的根目录判断。扩展使用 [fast-glob](https://github.com/mrmlnc/fast-glob)。"
```

`package.nls.json`：

```json
"config.worktreeCopyPatterns.description": "Glob patterns or paths copied from the current folder when creating a worktree. A folder is copied recursively and keeps its hierarchy. Relative patterns resolve against the current folder. An absolute path inside the current folder keeps that relative hierarchy; an absolute path outside it is placed at the new worktree root under its final path segment. Each workspace folder can override this setting. This extension uses [fast-glob](https://github.com/mrmlnc/fast-glob).",
"config.worktreeCopyIgnores.description": "Glob patterns excluded from the worktree copy. Paths inside the current folder are judged relative to that folder. An absolute path outside the current folder is judged relative to that source path's own root. This extension uses [fast-glob](https://github.com/mrmlnc/fast-glob)."
```

`package.nls.zh-tw.json`：

```json
"config.worktreeCopyPatterns.description": "建立新 Worktree 時從目前資料夾複製的 glob 或路徑。資料夾會整份複製，內部層級不變。相對路徑相對於目前資料夾。目前資料夾內的絕對路徑保持相對層級；目前資料夾外的絕對路徑用最後一段名稱放到新 Worktree 根目錄。每個儲存庫可在自己的工作區設定中覆蓋。擴充功能使用 [fast-glob](https://github.com/mrmlnc/fast-glob)。",
"config.worktreeCopyIgnores.description": "複製到新 Worktree 時排除的 glob。目前資料夾內的路徑相對於目前資料夾判斷；目前資料夾外的絕對路徑相對於該來源自身的根目錄判斷。擴充功能使用 [fast-glob](https://github.com/mrmlnc/fast-glob)。"
```

`package.nls.ja.json`：

```json
"config.worktreeCopyPatterns.description": "新しいワークツリー作成時に現在のフォルダからコピーする glob またはパス。フォルダは内部階層を保ったまま再帰的にコピーします。相対パスは現在のフォルダを基準にします。現在のフォルダ内の絶対パスは同じ相対階層を保ち、現在のフォルダ外の絶対パスは末尾の名前で新しいワークツリーのルートに置きます。リポジトリごとにワークスペース設定で上書きできます。この拡張機能は [fast-glob](https://github.com/mrmlnc/fast-glob) を使用します。",
"config.worktreeCopyIgnores.description": "ワークツリーへのコピー時に除外する glob。現在のフォルダ内のパスは現在のフォルダを基準に判断します。現在のフォルダ外の絶対パスは、そのコピー元自身のルートを基準に判断します。この拡張機能は [fast-glob](https://github.com/mrmlnc/fast-glob) を使用します。"
```

只替换这两个键，保留文件里的其他键和合法 JSON。

- [ ] **Step 3: 检查 JSON 和全文测试**

```bash
node -e "for (const file of ['package.json','package.nls.json','package.nls.zh-cn.json','package.nls.zh-tw.json','package.nls.ja.json']) JSON.parse(require('fs').readFileSync(file, 'utf8'))"
pnpm test:unit
pnpm check-types
```

三个命令的期望退出码都是 0。`pnpm test:unit` 还要让原有单测继续通过。

- [ ] **Step 4: 提交**

用户允许后再执行。提交信息：`更新 worktree 复制设置说明`。

```bash
git add \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/README.md" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/README.zh-CN.md" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.json" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.zh-cn.json" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.zh-tw.json" \
  "zzz-prompt-debug/修改gitworktree插件/git-worktree-manager/package.nls.ja.json"
git commit -m "更新 worktree 复制设置说明"
```

## 规格覆盖核对

| 对齐规则 | 任务 |
| --- | --- |
| 默认增加 `.codex`、`.claude`，忽略列表不变 | 任务 4 |
| `resource` 作用域，并按当前文件夹 URI 读取 | 任务 4、任务 5 |
| 空数组不复制 | 任务 2、任务 5 |
| 相对文件、相对文件夹、空文件夹、相对 glob | 任务 2、任务 3 |
| 文件夹内绝对路径、文件夹外绝对路径、绝对 glob | 任务 1、任务 2 |
| 缺失来源跳过 | 任务 2 |
| 忽略 `node_modules`，外部目录按该目录自身判断 | 任务 2 |
| 合并并覆盖同名文件 | 任务 3 |
| 符号链接不展开 | 任务 2、任务 3 |
| 排除位于来源内部的新 worktree | 任务 2 |
| `sourceFolder` 与 Git `cwd` 分离，复制后才执行 `postCreateCmd` | 任务 5 |
| 失败不删除 worktree，取消不额外报错 | 任务 5 |
| README 与四种语言包 | 任务 6 |
