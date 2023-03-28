import type { VFile } from 'vfile';
export declare const typicalTransformRelativePublicSrcAbsUrlWithoutPublicFn: () => (url: string) => string | false;
export declare const typicalTransformRelativePublicSrcAbsUrlWithoutPublic: (url: string) => string | false;
export interface RelocationPaths {
    readonly colocatedNodeUrlAbsFileName: string;
    readonly relocatableFsPublicNodeUrlAbsPath: string;
    readonly relocatableFsPublicNodeUrlAbsFileName: string;
    readonly relocatableFsPublicNodeUrlRelFileName: string;
    readonly relocatedPublicNodeURL: string;
}
/**
 * We want to be able to co-locate images with Markdown during editing so that
 * they are previewable and convenient to manage. However, during builds of
 * static sites or apps we want the same images to be available in the `public`
 * directory so that they can be served as web assets without worrying about
 * pretty URLs or locations. For example, this should be possible in Markdown:
 *
 * ![I'm a Colocated Link](colocated-file-name.jpg)
 * [Click Colocated Link](colocated-file-name.jpg)
 *
 * We we process remark and publish as SSG (e.g. Astro) we automatically figure
 * out the location of markdown source file to copy `colocated-file-name.jpg`
 * into `~/public/x/y/z/colocated-file-name.jpg` where x/y/z is the relative
 * path of the source.
 *
 * We also want to be able to store images directly in ~/public but our Markdown
 * files in `src/*` to be preview-friendly in the CLI and VS Code. For example,
 * this should be possible in Markdown:
 *
 * ![test](../../../public/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 * ![try](../../../public/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 *
 * When we process using remark and publish as SSG (e.g. Astro) we don't include
 * the path `/public` because that's just the `dist` folder (in any SSG). So, we
 * rewrite them dynamically to:
 *
 * ![test](/assets-natural/brand/netspective/knowledge-center/knowledge-center-logo-full-161x35.png)
 *
 * TODO: also consider the following features:
 * - A bare-word (something without a path) URL is searched automatically in the
 *   file system (like a $PATH) or looked-up using dictionary-backed function.
 *   Similar to how [[wiki]] links or zoxide file system navigator work.
 * - Support relative resources for reloctable resources such that an image or
 *   link could be above or below a Markdown file and still be found (currently
 *   we only support bare-word relocatable resources which are co-located).
 * - [embed local images as data URIs](https://github.com/remarkjs/remark-embed-images)
 * - [inlines SVG images](https://github.com/alvinometric/remark-inline-svg)
 *
 * @returns a remark plugin function which rewrites previewable image URLs to publish-friendly
 */
export declare function remarkRewritePreviewableURLs(options?: {
    readonly transformURLs?: {
        readonly isEnabled: boolean;
        readonly rewrittenURL: (url: string, vfile: VFile) => [url: string, terminate: boolean] | false;
    }[];
    readonly relocateResources?: {
        readonly isEnabled: boolean;
        readonly isColocated: (url: string, vfile: VFile) => boolean;
        readonly relocationPaths: (url: string, vfile: VFile) => RelocationPaths;
        readonly relocate: (rp: RelocationPaths) => Promise<void>;
    };
}): () => (tree: any, vfile: VFile) => Promise<void>;
