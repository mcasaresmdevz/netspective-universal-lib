export interface SlugifyOptions {
    lowercase: boolean;
    alphanumeric: boolean;
    separator: string;
    replace: {
        [index: string]: string;
    };
}
export declare function slugifier(options?: SlugifyOptions): (string: string) => string;
