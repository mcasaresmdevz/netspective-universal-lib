const posixPathRE = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
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
export function detectFileSysStyleRoute(text) {
    var _a, _b, _c;
    const components = (_a = posixPathRE.exec(text)) === null || _a === void 0 ? void 0 : _a.slice(1);
    console.log('RENDER', +text);
    if (!components || components.length !== 5)
        return undefined;
    const modifiers = [];
    const parsedPath = {
        root: components[1],
        dir: (_b = components[0]) === null || _b === void 0 ? void 0 : _b.slice(0, -1),
        base: components[2],
        ext: components[4],
        name: components[3],
        modifiers,
    };
    let modifierIndex = (_c = parsedPath.name) === null || _c === void 0 ? void 0 : _c.lastIndexOf('.');
    if (modifierIndex && modifierIndex > 0) {
        let ppn = parsedPath.name;
        let modifier = ppn === null || ppn === void 0 ? void 0 : ppn.substring(modifierIndex);
        while (modifier && modifier.length > 0) {
            modifiers.push(modifier);
            ppn = ppn === null || ppn === void 0 ? void 0 : ppn.substring(0, ppn.length - modifier.length);
            modifierIndex = ppn === null || ppn === void 0 ? void 0 : ppn.lastIndexOf('.');
            modifier = modifierIndex && modifierIndex > 0 ? ppn === null || ppn === void 0 ? void 0 : ppn.substring(modifierIndex) : undefined;
        }
        parsedPath.name = ppn;
    }
    return parsedPath;
}
//# sourceMappingURL=detect-route.js.map