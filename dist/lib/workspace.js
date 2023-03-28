/**
 * Converts a file URL to a path string.
 * @param url of a file URL
 */
export function fromFileUrl(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != 'file:') {
        throw new TypeError('Must be a file URL.');
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, '%25'));
}
export const workspaceEditorTargetResolvers = [
    'vscode',
    'vscode-wsl',
    'vscode-ssh-remote',
    'vscode-windows',
    'vscode-linux',
    'vscode-mac',
];
export function workspaceEditorResolver(type, options) {
    var _a, _b, _c, _d;
    switch (type) {
        case 'vscode': // @deprecated: non-specific "vscode" is depracated, use specific vscode-* below
        case 'vscode-wsl':
            return vscodeWslRemoteEditorResolver((_b = (_a = options === null || options === void 0 ? void 0 : options.vscodeWslRemoteDistro) === null || _a === void 0 ? void 0 : _a.call(options)) !== null && _b !== void 0 ? _b : 'Debian');
        case 'vscode-ssh-remote':
            return vscodeSshRemoteEditorResolver((_d = (_c = options === null || options === void 0 ? void 0 : options.vscodeSsshRemoteHostname) === null || _c === void 0 ? void 0 : _c.call(options)) !== null && _d !== void 0 ? _d : `${type}'s vscodeSsshRemoteHostname() supplier not supplied`);
        case 'vscode-windows':
            return vscodeWindowsRemoteEditorResolver();
        case 'vscode-linux':
            return vscodeLinuxRemoteEditorResolver();
        case 'vscode-mac':
            return vscodeMacRemoteEditorResolver();
    }
    return () => undefined;
}
export function vscodeWslRemoteEditorResolver(wslDistroName) {
    return (src, line) => {
        if (src.startsWith('file:')) {
            src = fromFileUrl(src);
        }
        if (!src.startsWith('/'))
            src = `/${src}`;
        const editableTargetURI = `vscode://vscode-remote/wsl+${wslDistroName}${src}:${line || 1}`;
        return {
            identity: 'vscode',
            wslDistroName,
            editableTargetURI,
            // deno-fmt-ignore
            openInWorkspaceHTML: classes => `<a href="${editableTargetURI}" ${classes ? ` class="${classes}"` : ''} title="${editableTargetURI}">Open in VS Code</a>`,
        };
    };
}
export function vscodeSshRemoteEditorResolver(sshHostName) {
    return (src, line) => {
        if (src.startsWith('file:')) {
            src = fromFileUrl(src);
        }
        if (!src.startsWith('/'))
            src = `/${src}`;
        const editableTargetURI = `vscode://vscode-remote/ssh-remote+${sshHostName}${src}:${line || 1}`;
        return {
            identity: 'vscode',
            sshHostName,
            editableTargetURI,
            // deno-fmt-ignore
            openInWorkspaceHTML: classes => `<a href="${editableTargetURI}" ${classes ? ` class="${classes}"` : ''} title="${editableTargetURI}">Open in VS Code</a>`,
        };
    };
}
export function vscodeWindowsRemoteEditorResolver() {
    return (src, line) => {
        if (src.startsWith('file:')) {
            src = fromFileUrl(src);
        }
        if (!src.startsWith('/'))
            src = `/${src}`;
        const editableTargetURI = `vscode://file${src}:${line || 1}`;
        return {
            identity: 'vscode-windows',
            editableTargetURI,
            // deno-fmt-ignore
            openInWorkspaceHTML: classes => `<a href="${editableTargetURI}" ${classes ? ` class="${classes}"` : ''} title="${editableTargetURI}">Open in VS Code</a>`,
        };
    };
}
export function vscodeLinuxRemoteEditorResolver() {
    return (src, line) => {
        if (src.startsWith('file:')) {
            src = fromFileUrl(src);
        }
        if (!src.startsWith('/'))
            src = `/${src}`;
        const editableTargetURI = `vscode://file${src}:${line || 1}`;
        return {
            identity: 'vscode-linux',
            editableTargetURI,
            // deno-fmt-ignore
            openInWorkspaceHTML: classes => `<a href="${editableTargetURI}" ${classes ? ` class="${classes}"` : ''} title="${editableTargetURI}">Open in VS Code</a>`,
        };
    };
}
export function vscodeMacRemoteEditorResolver() {
    return (src, line) => {
        if (src.startsWith('file:')) {
            src = fromFileUrl(src);
        }
        if (!src.startsWith('/'))
            src = `/${src}`;
        const editableTargetURI = `vscode://file${src}:${line || 1}`;
        return {
            identity: 'vscode-mac',
            editableTargetURI,
            // deno-fmt-ignore
            openInWorkspaceHTML: classes => `<a href="${editableTargetURI}" ${classes ? ` class="${classes}"` : ''} title="${editableTargetURI}">Open in VS Code</a>`,
        };
    };
}
export const gitLabRemoteID = 'gitLab-remote';
export const vsCodeLocalID = 'vscode-local';
export function gitLabAssetUrlResolver(glEndpoint) {
    return {
        identity: gitLabRemoteID,
        gitAssetUrl: asset => {
            return `${glEndpoint}/-/tree/${asset.gitBranchOrTag}/${asset.assetPathRelToWorkTree}`;
        },
    };
}
export function gitLabWorkTreeAssetVsCodeURL(_glEndpoint) {
    return {
        identity: vsCodeLocalID,
        gitAssetUrl: () => `TODO`,
    };
}
export function typicalGitWorkTreeAssetUrlResolvers(...defaults) {
    const gitAssetUrlResolvers = new Map();
    defaults.forEach(resolver => gitAssetUrlResolvers.set(resolver.identity, resolver));
    return {
        gitAssetUrlResolver: identity => gitAssetUrlResolvers.get(identity),
        gitAssetUrlResolvers: gitAssetUrlResolvers.values(),
        registerResolver: resolver => gitAssetUrlResolvers.set(resolver.identity, resolver),
    };
}
export const typicalGitWorkTreeAssetResolver = (entry, gitBranchOrTag, paths) => {
    const workTreePath = paths.workTreePath;
    if (entry.startsWith('/')) {
        if (entry.startsWith(workTreePath)) {
            return {
                assetPathRelToWorkTree: entry.substring(workTreePath.length + 1),
                gitAssetWorkTreeAbsPath: entry,
                gitBranchOrTag,
                paths,
            };
        }
        // the entry doesn't belong to paths.workTreePath
        return undefined;
    }
    return {
        assetPathRelToWorkTree: entry,
        gitAssetWorkTreeAbsPath: paths.workTreePath + '/' + entry,
        gitBranchOrTag,
        paths,
    };
};
export function gitLabResolvers(gitLabRemoteUrlPrefix, remoteServerHumanName) {
    const assetUrlResolver = gitLabAssetUrlResolver(gitLabRemoteUrlPrefix);
    const gitWorkTreeAssetVsCodeURL = gitLabWorkTreeAssetVsCodeURL(gitLabRemoteUrlPrefix);
    const mGitResolvers = {
        ...typicalGitWorkTreeAssetUrlResolvers(assetUrlResolver, gitWorkTreeAssetVsCodeURL),
        workTreeAsset: typicalGitWorkTreeAssetResolver,
        cicdBuildStatusHTML: () => `<a href="${gitLabRemoteUrlPrefix}/-/commits/master"><img alt="pipeline status" src="${gitLabRemoteUrlPrefix}/badges/master/pipeline.svg"/></a>`,
    };
    const routeGitRemoteResolver = (fileSysPath, branch, paths) => {
        const asset = mGitResolvers.workTreeAsset(fileSysPath, branch, paths);
        if (asset) {
            const href = assetUrlResolver.gitAssetUrl(asset);
            if (href) {
                const result = {
                    ...asset,
                    href,
                    textContent: `${fileSysPath.slice(fileSysPath.lastIndexOf('/') + 1)} on ${remoteServerHumanName}`,
                };
                return result;
            }
        }
        return undefined;
    };
    return {
        mGitResolvers,
        routeGitRemoteResolver,
    };
}
//# sourceMappingURL=workspace.js.map