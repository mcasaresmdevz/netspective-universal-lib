/**
 * Rewrite the URL in a Markdown node.
 * @param options
 * @returns {function(*): Promise<*>}
 */
export function remarkRewriteLinks(options?: {
    replacer: (url: any) => Promise<any>;
}): (arg0: any) => Promise<any>;
export function replaceAsync(str: any, regex: any, asyncFn: any): Promise<any>;
export function rewriteJSXURL(value: any, replacer: any): Promise<any>;
