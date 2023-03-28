import { z } from 'zod';
import { JSDOM } from 'jsdom';
export declare const foreignContentSchema: z.ZodObject<{
    url: z.ZodString;
    content: z.ZodOptional<z.ZodObject<{
        selectAll: z.ZodOptional<z.ZodString>;
        selectFirst: z.ZodOptional<z.ZodString>;
        onSelectFail: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        unsanitized: z.ZodOptional<z.ZodBoolean>;
        readable: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        selectAll?: string | undefined;
        selectFirst?: string | undefined;
        onSelectFail?: string | undefined;
        unsanitized?: boolean | undefined;
        readable?: boolean | undefined;
    }, {
        selectAll?: string | undefined;
        selectFirst?: string | undefined;
        onSelectFail?: string | undefined;
        unsanitized?: boolean | undefined;
        readable?: boolean | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    url: string;
    content?: {
        selectAll?: string | undefined;
        selectFirst?: string | undefined;
        onSelectFail?: string | undefined;
        unsanitized?: boolean | undefined;
        readable?: boolean | undefined;
    } | undefined;
}, {
    url: string;
    content?: {
        selectAll?: string | undefined;
        selectFirst?: string | undefined;
        onSelectFail?: string | undefined;
        unsanitized?: boolean | undefined;
        readable?: boolean | undefined;
    } | undefined;
}>;
export type ForeignContent = z.infer<typeof foreignContentSchema>;
/**
 * Given a URL, create a JSDOM instance that allows querying of HTML as it would
 * be done in a browser. No sanitization is done.
 * @param url the URL to load
 * @returns JSDOM instance
 */
export declare function queryableContent(url: string): Promise<JSDOM>;
/**
 * Given a URL, create a JSDOM instance that allows querying of HTML as it would
 * be done in a browser. Potential XSS/JS is stripped using DOMPurify library.
 * @param url the URL to load
 * @returns JSDOM instance with sanitized HTML
 */
export declare function queryableSanitizedContent(url: string): Promise<JSDOM>;
export declare function readableContent(url: string): Promise<{
    title: string;
    content: string;
    textContent: string;
    length: number;
    excerpt: string;
    byline: string;
    dir: string;
    siteName: string;
    lang: string;
} | null>;
