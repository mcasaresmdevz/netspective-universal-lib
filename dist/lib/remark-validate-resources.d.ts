import type { VFile } from 'vfile';
/**
 * We want to be able to validate resources that links, images and other tags
 * reference.
 *
 * TODO: need to implement this function, with unit tests
 *
 * @returns a remark plugin function which validates URLs
 */
export declare function remarkValidateResources(): () => (tree: any, vfile: VFile) => Promise<void>;
