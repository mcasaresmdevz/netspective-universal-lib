import * as m from './memoize';
export declare const apiMssFactory: ({ isApiAvailable, mssStatsInstances, }: {
    readonly isApiAvailable: () => boolean;
    readonly mssStatsInstances?: Map<string, {
        readonly key: string;
        gets: number;
        sets: number;
        readonly reject: Error[];
    }> | undefined;
}) => <V>(key: string) => m.MemoizeStoreStrategy<string, V>;
export declare const memoizableApiResponse: (options: {
    readonly isApiAvailable: () => boolean;
}) => <A extends unknown[], V>(apiCallFn: (...args: A) => Promise<V>, key: string) => (...args: A) => Promise<V>;
