/// <reference types="node" />
/// <reference types="node" />
import { z } from 'zod';
import * as fs from 'fs';
export declare const memoizeSchema: z.ZodObject<{
    key: z.ZodOptional<z.ZodString>;
    expireMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    key?: string | undefined;
    expireMs?: number | undefined;
}, {
    key?: string | undefined;
    expireMs?: number | undefined;
}>;
/**
 * Memoizes an asynchronous function `fn` by returning a new function with the
 * same signature that caches function calls and gurantees a `singleton` pattern
 * behavior.
 *
 * @param fn an arbitrary function or lambda expression
 * @returns a new function that has the same signature like fn
 */
export declare function singleton<A extends unknown[], V>(fn: (...args: A) => Promise<V>): typeof fn;
/**
 * Memoizes a function `fn` by returning a new function with the
 * same signature that caches function calls and gurantees a `singleton` pattern
 * behavior.
 *
 * @param fn an arbitrary function or lambda expression
 * @returns a new function that has the same signature like fn
 */
export declare function singletonSync<A extends unknown[], V>(fn: (...args: A) => V): typeof fn;
export type MemoizeStoreStrategy<K, V> = {
    get(key: K): Promise<V>;
    set(key: K, value: V): Promise<void>;
    toKey(args: unknown[]): Promise<K>;
};
/**
 * Memoizes an asynchronous function `fn` by returning a new function with the same signature that caches function calls.
 *
 * A memoized function behaves like the original function in the way that:
 * - if a cached value of a previous function call exists, it is returned
 * - the original function is called at most once per memoize() call
 * - if a memoization store (read: cache) operation produces an exception, it is not exposed to the outside
 * - only results of an original function call are exposed to the outside
 *
 * That way memoize() keeps the semantics of the original function (modulo caching).
 *
 * The memoize() function takes a second, optional parameter `store`.
 * A store tells memoize how to produce cache keys from an argument list,
 * how to set values and how to get them.
 *
 * A default store can be creating by calling memMemoizeStoreStrategy() with an optional cache parameter.
 * The injection of a cache allows it to inverse the control of cache invalidation.
 * Namely, a cache is cleared outside of the memoize() function.
 *
 * @param fn an arbitrary function or lambda expression
 * @param store an option key-value store, default: memoize.memStore
 * @returns a new function that has the same signature like fn
 */
export declare function memoize<A extends unknown[], K, V>(fn: (...args: A) => Promise<V>, store?: MemoizeStoreStrategy<K, V>): typeof fn;
/**
 * Memoize store strategy which provides an idSupplier function to allow more
 * flexible naming of key.
 * @param keySupplier receives the function arguments and returns the cache key
 * @param cache the map we should store the values in
 * @returns a MemoizeStoreStrategy instance
 */
export declare function memIdMemoizeStoreStrategy<V>(keySupplier: (args: unknown[]) => string, cache?: Map<string, V>): MemoizeStoreStrategy<string, V>;
/**
 * Memoize store strategy which stores values in memory with a key that is
 * computed from the arguments of the function.
 * @param cache the map we should store the values in
 * @returns a MemoizeStoreStrategy instance
 */
export declare function memMemoizeStoreStrategy<V>(cache?: Map<string, V>): MemoizeStoreStrategy<string, V>;
export declare function ensureFsPathExists(dir: string, cb: (err: NodeJS.ErrnoException | null) => void): void;
export interface FileSysMemoizeStoreStrategyFactory<V> {
    readonly fileNameSupplier: (value?: V) => string;
    readonly ensureFsPathExists?: (dir: string, cb: (err: NodeJS.ErrnoException | null) => void) => void;
    readonly acceptPersistedFile?: (stats: fs.Stats, fn: string) => true | any;
}
/**
 * A store which persists memoize() results as text files in the file system.
 * Only a single instance may be used per file which means file system can
 * hold only the last memoization and acceptPersistedFile option can decide
 * whether to expire the cache or keep it.
 *
 * @param options fileNameSupplier, ensureFsPathExists, acceptPersistedFile
 * @returns a new file store factory that takes a unique `id` and returns a new file store.
 *          Valid id characters are `a-z A-Z 0-9 - . _ ~ ! $ & ' ( ) + , ; = @`.
 *          Invalid characters will be replaced with dash `-`.
 */
export declare function fsTextMemoizeStoreStrategy(options: FileSysMemoizeStoreStrategyFactory<string>): MemoizeStoreStrategy<string, string>;
/**
 * A store which persists memoize() results as JSON files in the file system.
 * Only a single instance may be used per file which means file system can
 * hold only the last memoization and acceptPersistedFile option can decide
 * whether to expire the cache or keep it.
 *
 * @param options fileNameSupplier, ensureFsPathExists, acceptPersistedFile
 * @returns a new file store factory that takes a unique `id` and returns a new file store.
 *          Valid id characters are `a-z A-Z 0-9 - . _ ~ ! $ & ' ( ) + , ; = @`.
 *          Invalid characters will be replaced with dash `-`.
 */
export declare function fsJsonMemoizeStoreStrategy<V>(options: FileSysMemoizeStoreStrategyFactory<V>): MemoizeStoreStrategy<string, V>;
