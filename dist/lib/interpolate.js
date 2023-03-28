/**
 * Create a function which, when executed, will "interpolate" (replace) typed
 * tokens using custom function(s). Javascript string template literals are
 * much more powerful and be the first choice but sometimes we have a need where
 * a few, basic and a priori-known, text tokens need to be replaced at runtime.
 * @param strategy the replacers, regExp and token style (e.g. `${xyz}` or `{xyz}` or `{{xyz}}`) to use
 * @returns (text: string) => string
 */
export function textInterpolator(strategy) {
    const { replace, regExp = /\${([^\${}]*)}/g, // matches ${xyz}
    ignore = (token) => token, // return as-is if we're ignoring
    unwrap = (wrapped) => wrapped.slice(2, wrapped.length - 1), // extract 'xyz' from '${xyz}'
     } = strategy;
    const interpolateObservable = typeof replace === 'function'
        ? (text) => {
            const interpolated = {};
            const transformedText = text.replace(regExp, wrappedToken => {
                const token = unwrap(wrappedToken);
                const result = replace(token, wrappedToken);
                if (result) {
                    interpolated[token] = result;
                    return result;
                }
                return ignore(wrappedToken);
            });
            return {
                interpolated,
                transformedText,
            };
        }
        : (text) => {
            const interpolated = {};
            const transformedText = text.replace(regExp, wrappedToken => {
                const token = unwrap(wrappedToken);
                if (token in replace) {
                    const result = replace[token](token, wrappedToken);
                    interpolated[token] = result;
                    return result;
                }
                return ignore(wrappedToken);
            });
            return {
                interpolated,
                transformedText,
            };
        };
    const interpolate = (text) => {
        const ioResult = interpolateObservable(text);
        return ioResult.transformedText;
    };
    return {
        interpolateObservable,
        interpolate,
    };
}
//# sourceMappingURL=interpolate.js.map