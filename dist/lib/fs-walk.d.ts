/// <reference types="node" />
import * as fs from 'node:fs';
export interface WalkEntry {
    readonly parentRelPath?: string | undefined;
    readonly absPath: string;
    readonly relPath: string;
    readonly level: number;
    readonly stat: fs.Stats;
}
export declare function walkFsEntries(startDir: string, options?: {
    readonly onFile?: (we: WalkEntry) => Promise<"continue" | "stop" | void>;
    readonly onDirectory?: (we: WalkEntry) => Promise<"enter" | "stop">;
}, parentRelPath?: string, level?: number): Promise<void>;
