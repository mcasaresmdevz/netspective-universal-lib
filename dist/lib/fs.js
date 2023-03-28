import * as fs from "node:fs";
import * as path from "node:path";
export function copyFileIfNewerMemoizeEffects() {
    const destDirErrors = new Map();
    const memoized = new Map();
    const memoizedEntry = (key) => {
        let result = memoized.get(key);
        if (result)
            return result;
        result = {
            copied: [],
            notRequired: [],
            statError: []
        };
        memoized.set(key, result);
        return result;
    };
    return {
        destDirErrors,
        memoized,
        onEnsureDestDirError: (err, destPath) => {
            destDirErrors.set(destPath, err);
        },
        onStatError: (err, srcPath) => {
            var _a;
            (_a = memoizedEntry(srcPath)) === null || _a === void 0 ? void 0 : _a.statError.push(err);
        },
        onCopyNotRequired: (srcPath, destPath) => {
            var _a;
            (_a = memoizedEntry(srcPath)) === null || _a === void 0 ? void 0 : _a.notRequired.push(destPath);
        },
        onCopied: (srcPath, destPath) => {
            var _a;
            (_a = memoizedEntry(srcPath)) === null || _a === void 0 ? void 0 : _a.copied.push(destPath);
        },
    };
}
export function copyFileIfNewer(srcPath, destPath, effects) {
    return fs.stat(srcPath, (err, srcStats) => {
        var _a;
        if (err) {
            return (_a = effects === null || effects === void 0 ? void 0 : effects.onStatError) === null || _a === void 0 ? void 0 : _a.call(effects, err, srcPath, destPath);
        }
        fs.stat(destPath, (err, destStats) => {
            var _a;
            if (!err && srcStats.mtime <= destStats.mtime) {
                // Source file is not newer than the destination file, so don't copy it
                return (_a = effects === null || effects === void 0 ? void 0 : effects.onCopyNotRequired) === null || _a === void 0 ? void 0 : _a.call(effects, srcPath, destPath);
            }
            const destDir = path.dirname(destPath);
            fs.mkdir(destDir, { recursive: true }, (err) => {
                var _a;
                if (err && err.code !== 'EEXIST') {
                    return (_a = effects === null || effects === void 0 ? void 0 : effects.onEnsureDestDirError) === null || _a === void 0 ? void 0 : _a.call(effects, err, srcPath, destPath);
                }
                const srcStream = fs.createReadStream(srcPath);
                const destStream = fs.createWriteStream(destPath);
                srcStream.pipe(destStream);
                destStream.on('close', () => {
                    var _a;
                    (_a = effects === null || effects === void 0 ? void 0 : effects.onCopied) === null || _a === void 0 ? void 0 : _a.call(effects, srcPath, destPath);
                });
            });
        });
    });
}
//# sourceMappingURL=fs.js.map