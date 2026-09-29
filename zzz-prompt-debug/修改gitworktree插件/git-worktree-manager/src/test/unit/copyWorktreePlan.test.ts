import { afterEach, describe, expect, it } from '@rstest/core';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {
    collectCopyEntries,
    explicitCopyRoot,
    globCopyRoot,
    isGlobPattern,
    isInsideOrEqual,
    materializeCopyEntries,
    toCopyTarget,
    type CopyEntry,
} from '../../core/util/copyWorktreePlan';

const tempDirs: string[] = [];

async function makeTemp(): Promise<string> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wt-copy-'));
    tempDirs.push(dir);
    return dir;
}

function fileTargets(entries: CopyEntry[], target: string): string[] {
    return entries
        .filter((entry) => entry.kind === 'file')
        .map((entry) => path.relative(target, entry.targetPath))
        .sort();
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
        expect(globCopyRoot('/dir/file*/sub/*.txt')).toBe('/dir');
    });

    it('does not treat another Windows drive as inside the worktree', () => {
        const winPath = path.win32;
        expect(isInsideOrEqual('D:\\wt', 'C:\\repo\\.env', winPath)).toBe(false);
        expect(isInsideOrEqual('C:\\repo', 'C:\\repo\\.env', winPath)).toBe(true);
        expect(toCopyTarget('D:\\wt', 'C:\\secrets\\config.json', 'D:\\new-wt', winPath)).toBe('D:\\new-wt\\config.json');
    });
});

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
            copyRoot: source,
            targetRoot: target,
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
                copyRoot: source,
                targetRoot: target,
            },
        ]);
    });
});

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

    it('retargets a symlink that points at a parent file inside the source folder', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, 'real.txt'), 'data');
        await fs.mkdir(path.join(source, '.codex'));
        await fs.symlink('../real.txt', path.join(source, '.codex', 'link.txt'));

        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['.codex'],
            ignorePatterns: [],
        });
        await materializeCopyEntries(entries);

        expect(await fs.readlink(path.join(target, '.codex', 'link.txt'))).toBe(path.join(target, 'real.txt'));
    });

    it('copies a broken symlink as its original link text', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.symlink('missing.txt', path.join(source, 'broken.txt'));
        const entries = await collectCopyEntries({
            sourceFolder: source,
            targetWorktree: target,
            patterns: ['broken.txt'],
            ignorePatterns: [],
        });
        await materializeCopyEntries(entries);
        expect(await fs.readlink(path.join(target, 'broken.txt'))).toBe('missing.txt');
    });

    it('replaces an existing symlink at the destination', async () => {
        const source = await makeTemp();
        const target = await makeTemp();
        await fs.writeFile(path.join(source, 'real.txt'), 'data');
        await fs.symlink('real.txt', path.join(source, 'link.txt'));
        await fs.symlink('old.txt', path.join(target, 'link.txt'));

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
