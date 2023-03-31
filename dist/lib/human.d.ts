/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export declare function humanFriendlyBytes(bytes: number, si?: boolean, dp?: number): string;
/**
 * Replace all special characters (non-letters/numbers) with space and
 * capitalize the first character of each word.
 * @param text string with special characters (like a filename or slug)
 */
export declare function humanFriendlyPhrase(text: string): string;
/**
 * humanPath shortens a potentially long slash-delimited path into a short one
 * by keeping as much of the starting and ending paths (which are important
 * for humans).
 * @param original the text we want to humanize
 * @param maxLength the number of characters to keep at start + end
 * @param formatBasename an optional function which should be called to format the basename
 * @returns the string shortened to maxLength and formatted with
 */
export declare const humanPath: (original: string, maxLength?: number, formatBasename?: ((basename: string) => string) | undefined) => string;
