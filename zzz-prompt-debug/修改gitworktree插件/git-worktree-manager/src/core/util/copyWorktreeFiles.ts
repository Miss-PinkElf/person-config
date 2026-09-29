import * as vscode from 'vscode';
import { Config } from '@/core/config/setting';
import { actionProgressWrapper } from '@/core/ui/progress';
import { withResolvers } from '@/core/util/promise';
import { collectCopyEntries, materializeCopyEntries } from '@/core/util/copyWorktreePlan';

export async function copyWorktreeFiles(sourceRepo: string, targetWorktree: string): Promise<boolean> {
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
        if (patterns.length === 0) return true;

        const entries = await collectCopyEntries({
            sourceFolder: sourceRepo,
            targetWorktree,
            patterns,
            ignorePatterns,
        });
        if (entries.length === 0) return true;

        actionProgressWrapper(
            vscode.l10n.t('Copying files to worktree {path}', { path: targetWorktree }),
            () => waitingCopy.promise,
            () => {},
            tokenSource,
        );

        await materializeCopyEntries(entries, abortController.signal);
        return true;
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            return false;
        }
        vscode.window.showErrorMessage(
            vscode.l10n.t('Failed to copy files: {error}', { error: error.message || error }),
        );
        return false;
    } finally {
        disposeAbortSignal?.dispose();
        tokenSource.dispose();
        waitingCopy.resolve();
    }
}
