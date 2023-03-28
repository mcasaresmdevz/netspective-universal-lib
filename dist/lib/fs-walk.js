import * as fs from 'node:fs';
import * as path from 'node:path';
export async function walkFsEntries(startDir, options, parentRelPath, level = 0) {
    var _a;
    const { onFile, onDirectory } = options !== null && options !== void 0 ? options : {};
    const sdStat = fs.statSync(startDir);
    if (!sdStat.isDirectory)
        throw Error("startDir is not a directory");
    const entries = fs.readdirSync(startDir);
    WALK: for (const entry of entries) {
        const absPath = path.join(startDir, entry);
        const relPath = path.join(parentRelPath !== null && parentRelPath !== void 0 ? parentRelPath : "", entry);
        const stat = fs.statSync(absPath);
        if (stat.isDirectory()) {
            const instruction = onDirectory ? await ((_a = onDirectory === null || onDirectory === void 0 ? void 0 : onDirectory({ parentRelPath, absPath, relPath, stat, level })) !== null && _a !== void 0 ? _a : "enter") : "enter";
            switch (instruction) {
                case "enter":
                    await walkFsEntries(absPath, options, relPath, level + 1);
                    break;
                case "stop":
                    break WALK;
            }
        }
        else {
            const instruction = onFile ? await onFile({ parentRelPath, absPath, relPath, stat, level }) : "continue";
            if (instruction === "stop")
                break WALK;
        }
    }
}
//# sourceMappingURL=fs-walk.js.map