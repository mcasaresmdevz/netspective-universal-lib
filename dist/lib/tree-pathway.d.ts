import * as t from './tree';
export type TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit> = (node: t.PathTreeNode<Terminal, Intermediary>) => PathwayUnit;
export interface TreePathwaysSupplier<Terminal, Intermediary, PathwayUnit> {
    intermediaryUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
    terminalUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
    byNodeKey: (indexKey: string, options?: {
        refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
        includeTerminal?: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
    }) => PathwayUnit[] | undefined;
    byNode: (node: t.PathTreeNode<Terminal, Intermediary>, options?: {
        refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
        includeTerminal?: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
    }) => PathwayUnit[];
}
/**
 * Prepare an function which, when called, will compute a node's "pathway" (breadcrumbs)
 * @param tree is the tree for which pathway should be computed
 * @param intermediaryUnit a function which computes what a non-terminal breadcrumb contains
 * @param terminalUnit a function which computes what a terminal breadcrumb contains
 * @param defaultOptions the options that will be passed into the byNodeKey and byNode functions
 * @returns an object which provides breadcrumbs preparation by node key or node
 */
export declare function treePathwaysPreparer<Terminal, Intermediary, PathwayUnit>(tree: t.PathTree<Terminal, Intermediary>, intermediaryUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>, terminalUnit: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>, defaultOptions?: {
    index?: Map<string, t.PathTreeNode<Terminal, Intermediary>>;
    refine?: ((suggested: PathwayUnit[]) => PathwayUnit[]) | undefined;
    includeTerminal?: TreePathwayUnitSupplier<Terminal, Intermediary, PathwayUnit>;
}): TreePathwaysSupplier<Terminal, Intermediary, PathwayUnit>;
