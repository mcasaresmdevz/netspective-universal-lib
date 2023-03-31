/**
 * Given POSIX-style path see if it's a file-sys style route. This function is
 * useful in browsers to detect a server route based on document.location.
 * For example, if you have a navigation utility that needs to set the active
 * path you could run this function to get the component parts (such as name,
 * directory, modifiers, etc.) and find the active page. If there are any extra
 * extensions in the file they are returned as "modifiers".
 * @param text the string to detect and see if it's POSIX-style path
 * returns undefined if it doesn't match a path or components.
 */
export declare function detectFileSysStyleRoute(text: string): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
    modifiers: string[];
} | undefined;
