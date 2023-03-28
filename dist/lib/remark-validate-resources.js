import { visit } from 'unist-util-visit';
/**
 * We want to be able to validate resources that links, images and other tags
 * reference.
 *
 * TODO: need to implement this function, with unit tests
 *
 * @returns a remark plugin function which validates URLs
 */
export function remarkValidateResources() {
    return function remarkContentRelImageError() {
        return async (tree, vfile) => {
            if (typeof (vfile === null || vfile === void 0 ? void 0 : vfile.path) !== 'string')
                return;
            visit(tree, (node) => {
                switch (node.type) {
                    case 'image':
                        // TODO: implement
                        break;
                    case 'link':
                        // TODO: implement
                        break;
                }
            });
        };
    };
}
//# sourceMappingURL=remark-validate-resources.js.map