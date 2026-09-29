import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import fg from 'fast-glob';
import type { PlatformPath } from 'path';
import { toSimplePath } from '@/core/util/path';

const GLOB_PATTERN = /[*?[{]/;

export type CopyEntryKind = 'file' | 'dir' | 'symlink';

export interface CopyEntry {
    sourcePath: string;
    targetPath: string;
    kind: CopyEntryKind;
    copyRoot: string;
    targetRoot: string;
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
    const prefix = pattern.slice(0, index);
    if (prefix.endsWith('/') || prefix.endsWith('\\')) {
        const stripped = path.normalize(prefix).replace(/[\\/]+$/, '');
        return stripped || path.parse(prefix).root;
    }
    return path.dirname(prefix);
}

export function isInsideOrEqual(parent: string, child: string, pathApi: PlatformPath = path): boolean {
    const parentReal = pathApi.resolve(parent);
    const childReal = pathApi.resolve(child);
    if (pathApi.normalize(parentReal) === pathApi.normalize(childReal)) return true;
    const relative = pathApi.relative(parentReal, childReal);
    if (pathApi.isAbsolute(relative)) return false;
    return relative !== '..' && !relative.startsWith(`..${pathApi.sep}`);
}

export function explicitCopyRoot(sourceFolder: string, sourcePath: string): string {
    if (isInsideOrEqual(sourceFolder, sourcePath)) {
        return sourceFolder;
    }
    return path.dirname(sourcePath);
}

export function toCopyTarget(
    copyRoot: string,
    sourcePath: string,
    targetWorktree: string,
    pathApi: PlatformPath = path,
): string {
    const relative = pathApi.relative(copyRoot, sourcePath);
    if (!relative || relative === '.') {
        return targetWorktree;
    }
    if (pathApi.isAbsolute(relative) || relative === '..' || relative.startsWith(`..${pathApi.sep}`)) {
        return pathApi.join(targetWorktree, pathApi.basename(sourcePath));
    }
    return pathApi.join(targetWorktree, relative);
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
        copyRoot,
        targetRoot: ctx.targetWorktree,
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

async function replaceExistingLeaf(target: string): Promise<void> {
    try {
        const existing = await fs.lstat(target);
        if (existing.isSymbolicLink() || !existing.isDirectory()) {
            await fs.unlink(target);
        }
    } catch (error: unknown) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== 'ENOENT') throw error;
    }
}

async function copySymbolicLink(entry: CopyEntry): Promise<void> {
    const targetDir = path.dirname(entry.targetPath);
    await fs.mkdir(targetDir, { recursive: true });
    let linkText = await fs.readlink(entry.sourcePath);
    let linkType: 'file' | 'dir' | 'junction' = 'file';
    try {
        const realTargetPath = await fs.realpath(entry.sourcePath);
        const realRoot = await fs.realpath(entry.copyRoot);
        const relativePath = path.relative(realRoot, realTargetPath);
        const insideCopyRoot =
            !path.isAbsolute(relativePath) && relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`);
        const linkStat = await fs.stat(realTargetPath);
        linkType = linkStat.isDirectory() ? 'dir' : 'file';
        if (insideCopyRoot) {
            linkText = path.resolve(entry.targetRoot, relativePath);
        } else {
            linkText = realTargetPath;
        }
    } catch (error: unknown) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== 'ENOENT') throw error;
    }
    await replaceExistingLeaf(entry.targetPath);
    await fs.symlink(linkText, entry.targetPath, linkType);
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
            await copySymbolicLink(entry);
            continue;
        }
        await fs.mkdir(path.dirname(entry.targetPath), { recursive: true });
        await pipeline(createReadStream(entry.sourcePath), createWriteStream(entry.targetPath), { signal });
    }
}
