/// <reference types="node" />
export interface CopyFileIfNewerEffects {
    readonly onStatError?: (err: NodeJS.ErrnoException, srcPath: string, destPath: string) => void;
    readonly onEnsureDestDirError?: (err: NodeJS.ErrnoException, destPath: string, srcPath: string) => void;
    readonly onCopyNotRequired?: (srcPath: string, destPath: string) => void;
    readonly onCopied?: (srcPath: string, destPath: string) => void;
}
export declare function copyFileIfNewerMemoizeEffects(): CopyFileIfNewerEffects & {
    destDirErrors: Map<string, NodeJS.ErrnoException>;
    memoized: Map<string, {
        copied: string[];
        notRequired: string[];
        statError: NodeJS.ErrnoException[];
    }>;
};
export declare function copyFileIfNewer(srcPath: string, destPath: string, effects?: CopyFileIfNewerEffects): void;
