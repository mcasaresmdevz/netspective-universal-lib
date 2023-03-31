export interface TextInterpolateStrategy<InterpolateProps extends Record<string, string>, InterpolatePropKey extends keyof InterpolateProps = keyof InterpolateProps> {
    readonly replace: ((unwrappedToken: InterpolatePropKey, wrappedToken: string) => string | false) | {
        [Token in InterpolatePropKey]: (token: InterpolatePropKey, wrappedToken: string) => string;
    };
    readonly regExp?: RegExp;
    readonly ignore?: (token: string) => string;
    readonly unwrap?: (wrapped: string) => string;
}
export type TextInterpolator = (text: string) => string;
/**
 * Create a function which, when executed, will "interpolate" (replace) typed
 * tokens using custom function(s). Javascript string template literals are
 * much more powerful and be the first choice but sometimes we have a need where
 * a few, basic and a priori-known, text tokens need to be replaced at runtime.
 * @param strategy the replacers, regExp and token style (e.g. `${xyz}` or `{xyz}` or `{{xyz}}`) to use
 * @returns (text: string) => string
 */
export declare function textInterpolator<InterpolateProps extends Record<string, string>, InterpolatePropKey extends keyof InterpolateProps = keyof InterpolateProps>(strategy: TextInterpolateStrategy<InterpolateProps, InterpolatePropKey>): {
    interpolateObservable: (text: string) => {
        interpolated: InterpolateProps;
        transformedText: string;
    };
    interpolate: (text: string) => string;
};
