/**
 * The "content" or "schema" of the terminal nodes in the path.
 */
export interface PathTreeTerminalSupplier<Terminal> {
    readonly terminal: Terminal;
}
/**
 * The "content" or "schema" of the intermediate nodes in the path.
 */
export interface PathTreeItermediarySupplier<Intermediary> {
    readonly intermediary: Intermediary;
}
/**
 * The nodes (children and descendants) of all nodes in the tree.
 */
export interface PathTree<Terminal, Intermediary> {
    readonly children: PathTreeNode<Terminal, Intermediary>[];
}
/**
 * A single 'unit' of a path tree's route.
 */
export interface PathTreeNode<Terminal, Intermediary> extends PathTree<Terminal, Intermediary>, Partial<PathTreeItermediarySupplier<Intermediary>>, Partial<PathTreeTerminalSupplier<Terminal>> {
    readonly unit: string;
    readonly qualifiedPath: string;
    readonly level: number;
    readonly parent?: PathTreeNode<Terminal, Intermediary> | undefined;
    readonly ancestors: PathTreeNode<Terminal, Intermediary>[];
    readonly children: PathTreeNode<Terminal, Intermediary>[];
}
/**
 * Given a path separator, provide a function that will determine the fully
 * qualified path of a given unit based on its parent and ancestors.
 * @param pathSep how path units are separated (default '/')
 * @returns a function that can be called like qp('/a/b/c', parent)
 */
export declare const qualifiedPathPreparer: <Terminal, Intermediary>(pathSep?: string) => (unit: string, parent?: PathTreeNode<Terminal, Intermediary> | undefined) => string;
/**
 * Start at the current parent node and provide all children and their children.
 * @param parent the starting node
 */
export declare function pathTreeDescendants<Terminal, Intermediary>(parent: PathTree<Terminal, Intermediary>): Generator<PathTreeNode<Terminal, Intermediary>>;
/**
   * Take the given terminal (leaf) unit instructions and create a hierarchy of
   * nodes to populate into owner
   * @param ts the instance which contains the "terminal" or leaf object (the "content" or "schema")
   * @param tree the root where the new node will be inserted
   * @param unitsSupplier function which prepares a list of units for the given ts
   * @returns
   */
export declare function populatePathTree<Terminal, Intermediary>(ts: PathTreeTerminalSupplier<Terminal>, tree: PathTree<Terminal, Intermediary>, unitsSupplier: (ts: PathTreeTerminalSupplier<Terminal>) => string[], intermediarySupplier: (ptn: Omit<PathTreeNode<Terminal, Intermediary>, "intermediary">, units: string[]) => PathTreeNode<Terminal, Intermediary>, options?: {
    readonly qualifiedPathPreparer?: (unit: string, parent?: PathTreeNode<Terminal, Intermediary>) => string;
    readonly nodeExists?: (prospect: string, siblings: PathTreeNode<Terminal, Intermediary>[], ts: PathTreeTerminalSupplier<Terminal>) => PathTreeNode<Terminal, Intermediary> | undefined;
    readonly refineConstructed?: (suggested: PathTreeNode<Terminal, Intermediary>, ts: PathTreeTerminalSupplier<Terminal>, tree: PathTree<Terminal, Intermediary>) => PathTreeNode<Terminal, Intermediary>;
}): PathTreeNode<Terminal, Intermediary> | undefined;
/**
   * Convert relative path to absolute
   * @param base the path that `relative` is relative to
   * @param relative the path relative to `base` (can be ./, ../.., etc.)
   * @returns
   */
export declare function absolutePath(base: string, relative: string, pathSep?: string): string;
/**
 * Find the tree node matching 'query' in node and its children
 * @param node the node and children to search
 * @param query the path relative to `base` (can be ./, ../.., etc.)
 * @returns
 */
export declare function selectTreeNode<Terminal, Intermediary>(node: PathTreeNode<Terminal, Intermediary>, query: string | string[], options?: {
    readonly delim?: string;
    noMatch?: (endIndex: number, parseError?: boolean) => PathTreeNode<Terminal, Intermediary>;
}): PathTreeNode<Terminal, Intermediary> | undefined;
/**
 * Find the tree node matching 'query' in tree and its descendants
 * @param tree the node and children to search
 * @param query the path relative to `base` (can be ./, ../.., etc.)
 * @returns
 */
export declare function selectTreePath<Terminal, Intermediary>(tree: PathTree<Terminal, Intermediary>, query: string, options?: {
    readonly delim?: string;
    noMatch?: (endIndex: number, parseError?: boolean) => PathTreeNode<Terminal, Intermediary>;
}): PathTreeNode<Terminal, Intermediary> | undefined;
/**
 * Traverse the tree and populate a flat array of all matching nodes
 * @param nodes The tree nodes to traverse
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param populate The array to fill with nodes that inspector agrees to populate
 * @param level The current level being inspected
 * @param maxLevel Stop populating once the level reaches this maximum
 */
export declare function populatePathTreeNodes<Terminal, Intermediary>(nodes: {
    children: PathTreeNode<Terminal, Intermediary>[];
}, populate: PathTreeNode<Terminal, Intermediary>[], inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean, level?: number, maxLevel?: number): void;
/**
 * Traverse the tree and populate a flat array of all matching nodes
 * @param root the source tree
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param maxLevel Stop populating once the level reaches this maximum
 * @returns a list of matching nodes
 */
export declare function pathTreeNodesList<Terminal, Intermediary>(root: PathTree<Terminal, Intermediary>, inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean, maxLevel?: number): PathTreeNode<Terminal, Intermediary>[];
/**
 * Traverse the tree and return a map of nodes
 * @param root the source tree
 * @param keySupplier The function to call for each node's key (defaults to qualifiedPath)
 * @param inspector The function to call for each node, return true to populate or false to skip node
 * @param maxLevel Stop populating once the level reaches this maximum
 * @returns a list of matching nodes
 */
export declare function pathTreeIndex<Terminal, Intermediary, Key = string>(root: PathTree<Terminal, Intermediary>, keySupplier?: (entry: PathTreeNode<Terminal, Intermediary>) => Key, inspector?: (entry: PathTreeNode<Terminal, Intermediary>) => boolean, maxLevel?: number): Map<Key, PathTreeNode<Terminal, Intermediary>>;
/**
 * Prepare a path tree from a list of flat terminal entries.
 * @param entries is a collection of entries in which one of the fields supplies the path
 * @param unitsSupplier function which prepares the list of 'units' that comprise a path for a given entry
 * @returns the tree version fo the flat entries array
 */
export declare function pathTree<Terminal, Intermediary>(entries: Terminal[] | (() => Generator<Terminal>), unitsSupplier: (ts: PathTreeTerminalSupplier<Terminal>) => string[], intermediarySupplier: (ptn: Omit<PathTreeNode<Terminal, Intermediary>, "intermediary">, units: string[]) => PathTreeNode<Terminal, Intermediary>, options?: {
    readonly tree?: PathTree<Terminal, Intermediary>;
}): PathTree<Terminal, Intermediary>;
/**
 * Transform an array of relational rows with ID and parent ID into a tree
 * @param rows flat array of rows with 'id' and 'parentId' complements
 * @returns a new tree-based array with "children" transformed
 */
export declare const treeOf: (rows: {
    id: string;
    parentId?: string | undefined;
}[], id?: string) => {
    id: string;
    parentId?: string | undefined;
    children?: {
        id: string;
        parentId?: string | undefined;
    }[] | undefined;
}[];
