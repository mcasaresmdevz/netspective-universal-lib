/**
 * Converts a file URL to a path string.
 * @param url of a file URL
 */
export declare function fromFileUrl(url: string | URL): string;
export type GitWorkTreePath = string;
export type GitEntry = string;
export type GitDir = string;
export type GitTag = string;
export type GitBranchOrTag = string;
export interface ManagedGitReference {
    readonly paths: GitPathsSupplier;
}
export interface GitAsset extends ManagedGitReference {
    readonly assetPathRelToWorkTree: string;
    readonly gitBranchOrTag: GitBranchOrTag;
}
export interface GitPathsSupplier {
    readonly workTreePath: GitWorkTreePath;
    readonly gitDir: GitDir;
    readonly assetAbsWorkTreePath: (asset: GitAsset) => GitEntry;
}
export interface GitWorkTreeAsset extends GitAsset, ManagedGitReference {
}
export interface GitWorkTreeAssetUrlResolver<Identity extends string> {
    readonly identity: Identity;
    readonly gitAssetUrl: (asset: GitWorkTreeAsset, fallback?: () => string | undefined) => string | undefined;
}
export interface GitWorkTreeAssetUrlResolvers<Identity extends string> {
    readonly gitAssetUrlResolver: (identity: string) => GitWorkTreeAssetUrlResolver<Identity> | undefined;
    readonly gitAssetUrlResolvers: Iterable<GitWorkTreeAssetUrlResolver<Identity>>;
    readonly registerResolver: (resolver: GitWorkTreeAssetUrlResolver<Identity>) => void;
}
export interface GitWorkTreeAssetResolver {
    (candidate: GitEntry, gitBranchOrTag: GitBranchOrTag, paths: GitPathsSupplier): GitWorkTreeAsset | undefined;
}
export interface GitRemoteAnchor extends GitAsset {
    readonly href: string;
    readonly textContent: string;
}
export interface RouteGitRemoteResolver<Remote> {
    (fileSysPath: string, branch: GitBranchOrTag, paths: GitPathsSupplier): Remote | undefined;
}
export type WorkspaceEditorIdentity = string;
export type EditableSourceFilePathAndName = string;
export type EditableSourceURI = string;
export type EditableTargetURI = string;
export interface WorkspaceEditorTarget {
    readonly identity: WorkspaceEditorIdentity;
    readonly editableTargetURI: EditableTargetURI;
    readonly openInWorkspaceHTML?: (classes?: string) => string;
}
export interface WorkspaceEditorTargetResolver<Target extends WorkspaceEditorTarget> {
    (src: EditableSourceFilePathAndName | EditableSourceURI, line?: number): Target | undefined;
}
export interface ManagedGitResolvers<Identity extends string> extends GitWorkTreeAssetUrlResolvers<Identity> {
    readonly workTreeAsset: GitWorkTreeAssetResolver;
    readonly cicdBuildStatusHTML?: (...args: unknown[]) => string;
}
export declare const workspaceEditorTargetResolvers: readonly ["vscode", "vscode-wsl", "vscode-ssh-remote", "vscode-windows", "vscode-linux", "vscode-mac"];
export declare function workspaceEditorResolver(type: typeof workspaceEditorTargetResolvers[number], options?: {
    readonly vscodeWslRemoteDistro?: () => string;
    readonly vscodeSsshRemoteHostname?: () => string;
}): WorkspaceEditorTargetResolver<WorkspaceEditorTarget>;
export interface VsCodeWslWorkspaceEditorTarget extends WorkspaceEditorTarget {
    readonly wslDistroName: string;
}
export interface VsCodeSshWorkspaceEditorTarget extends WorkspaceEditorTarget {
    readonly sshHostName: string;
}
export declare function vscodeWslRemoteEditorResolver(wslDistroName: string): WorkspaceEditorTargetResolver<VsCodeWslWorkspaceEditorTarget>;
export declare function vscodeSshRemoteEditorResolver(sshHostName: string): WorkspaceEditorTargetResolver<VsCodeSshWorkspaceEditorTarget>;
export declare function vscodeWindowsRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget>;
export declare function vscodeLinuxRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget>;
export declare function vscodeMacRemoteEditorResolver(): WorkspaceEditorTargetResolver<WorkspaceEditorTarget>;
export declare const gitLabRemoteID: "gitLab-remote";
export declare const vsCodeLocalID: "vscode-local";
export type GitAssetUrlResolverIdentity = typeof gitLabRemoteID | typeof vsCodeLocalID;
export declare function gitLabAssetUrlResolver(glEndpoint: string): GitWorkTreeAssetUrlResolver<GitAssetUrlResolverIdentity>;
export declare function gitLabWorkTreeAssetVsCodeURL(_glEndpoint: string): GitWorkTreeAssetUrlResolver<GitAssetUrlResolverIdentity>;
export declare function typicalGitWorkTreeAssetUrlResolvers<Identity extends string>(...defaults: GitWorkTreeAssetUrlResolver<Identity>[]): GitWorkTreeAssetUrlResolvers<Identity>;
export declare const typicalGitWorkTreeAssetResolver: GitWorkTreeAssetResolver;
export declare function gitLabResolvers(gitLabRemoteUrlPrefix: string, remoteServerHumanName: string): {
    mGitResolvers: ManagedGitResolvers<string>;
    routeGitRemoteResolver: RouteGitRemoteResolver<GitRemoteAnchor>;
};
