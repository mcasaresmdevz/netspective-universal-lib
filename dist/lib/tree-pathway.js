import * as t from './tree';
/**
 * Prepare an function which, when called, will compute a node's "pathway" (breadcrumbs)
 * @param tree is the tree for which pathway should be computed
 * @param intermediaryUnit a function which computes what a non-terminal breadcrumb contains
 * @param terminalUnit a function which computes what a terminal breadcrumb contains
 * @param defaultOptions the options that will be passed into the byNodeKey and byNode functions
 * @returns an object which provides breadcrumbs preparation by node key or node
 */
export function treePathwaysPreparer(tree, intermediaryUnit, terminalUnit, defaultOptions) {
    var _a;
    const index = (_a = defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.index) !== null && _a !== void 0 ? _a : t.pathTreeIndex(tree);
    const cachedNodeKeys = new Map();
    const cachedNodeQPs = new Map();
    return {
        intermediaryUnit,
        terminalUnit,
        byNodeKey: (indexKey, options) => {
            var _a, _b;
            let result = cachedNodeKeys.get(indexKey);
            if (!result) {
                const refine = (_a = options === null || options === void 0 ? void 0 : options.refine) !== null && _a !== void 0 ? _a : defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.refine;
                const includeTerminal = (_b = options === null || options === void 0 ? void 0 : options.includeTerminal) !== null && _b !== void 0 ? _b : defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.includeTerminal;
                const node = index.get(indexKey);
                if (!node)
                    return undefined;
                // we use slice().reverse() because reverse() mutates original
                result = node.ancestors.slice().reverse().map(intermediaryUnit);
                if (includeTerminal)
                    result.push(terminalUnit(node));
                result = refine ? refine(result) : result;
                cachedNodeKeys.set(indexKey, result);
            }
            return result;
        },
        byNode: (node, options) => {
            var _a, _b;
            let result = cachedNodeQPs.get(node.qualifiedPath);
            if (!result) {
                const refine = (_a = options === null || options === void 0 ? void 0 : options.refine) !== null && _a !== void 0 ? _a : defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.refine;
                const includeTerminal = (_b = options === null || options === void 0 ? void 0 : options.includeTerminal) !== null && _b !== void 0 ? _b : defaultOptions === null || defaultOptions === void 0 ? void 0 : defaultOptions.includeTerminal;
                // we use slice().reverse() because reverse() mutates original
                result = node.ancestors.slice().reverse().map(intermediaryUnit);
                if (includeTerminal)
                    result.push(terminalUnit(node));
                result = refine ? refine(result) : result;
                cachedNodeQPs.set(node.qualifiedPath, result);
            }
            return result;
        }
    };
}
//# sourceMappingURL=tree-pathway.js.map