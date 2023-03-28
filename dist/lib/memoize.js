import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
export const memoizeSchema = z.object({
    key: z.string().optional(),
    expireMs: z.number().optional(),
});
/**
 * Memoizes an asynchronous function `fn` by returning a new function with the
 * same signature that caches function calls and gurantees a `singleton` pattern
 * behavior.
 *
 * @param fn an arbitrary function or lambda expression
 * @returns a new function that has the same signature like fn
 */
// DEV-NOTE from original author: we cannot use async/await because of the ES6 target
export function singleton(fn) {
    let cached = undefined;
    return (...args) => new Promise((resolve, reject) => {
        return cached ? resolve(cached) : (fn(...args).then(value => {
            cached = value;
            resolve(value);
        }).catch(reason => reject(reason)));
    });
}
/**
 * Memoizes a function `fn` by returning a new function with the
 * same signature that caches function calls and gurantees a `singleton` pattern
 * behavior.
 *
 * @param fn an arbitrary function or lambda expression
 * @returns a new function that has the same signature like fn
 */
// DEV-NOTE from original author: we cannot use async/await because of the ES6 target
export function singletonSync(fn) {
    let cached = undefined;
    return (...args) => {
        if (!cached) {
            cached = fn(...args);
        }
        return cached;
    };
}
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
// DEV-NOTE from original author: we cannot use async/await because of the ES6 target
export function memoize(fn, store) {
    const { get, set, toKey } = store !== null && store !== void 0 ? store : memMemoizeStoreStrategy();
    return (...args) => toKey(args)
        .catch(() => undefined)
        .then(key => (key === undefined)
        ? fn(...args)
        : get(key).catch(() => fn(...args).then(value => set(key, value).then(() => value).catch(() => value))));
}
/**
 * Memoize store strategy which provides an idSupplier function to allow more
 * flexible naming of key.
 * @param keySupplier receives the function arguments and returns the cache key
 * @param cache the map we should store the values in
 * @returns a MemoizeStoreStrategy instance
 */
export function memIdMemoizeStoreStrategy(keySupplier, cache = new Map()) {
    return {
        get: (key) => new Promise((resolve, reject) => {
            const value = cache.get(key);
            (value === undefined) ? reject() : resolve(value);
        }),
        set: (key, value) => new Promise((resolve) => {
            cache.set(key, value);
            resolve();
        }),
        toKey: (args) => new Promise((resolve) => {
            return resolve(keySupplier(args));
        }),
    };
}
/**
 * Memoize store strategy which stores values in memory with a key that is
 * computed from the arguments of the function.
 * @param cache the map we should store the values in
 * @returns a MemoizeStoreStrategy instance
 */
export function memMemoizeStoreStrategy(cache = new Map()) {
    return memIdMemoizeStoreStrategy((args) => JSON.stringify(args), cache);
}
export function ensureFsPathExists(dir, cb) {
    fs.access(dir, (accessErr) => {
        if (accessErr !== null) {
            fs.mkdir(dir, { recursive: true }, cb);
        }
        else {
            cb(null);
        }
    });
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
export function fsTextMemoizeStoreStrategy(options) {
    var _a;
    const fnSupplier = options.fileNameSupplier;
    const ensureFSP = (_a = options === null || options === void 0 ? void 0 : options.ensureFsPathExists) !== null && _a !== void 0 ? _a : ensureFsPathExists;
    const acceptPersistedFile = options === null || options === void 0 ? void 0 : options.acceptPersistedFile;
    return {
        get: () => new Promise((resolve, reject) => {
            const fn = fnSupplier();
            if (acceptPersistedFile) {
                const stats = fs.statSync(fn, { throwIfNoEntry: false });
                if (stats) {
                    const reason = acceptPersistedFile(stats, fn);
                    if (typeof reason !== "boolean" || !reason) {
                        reject(reason);
                        return;
                    }
                }
            }
            fs.readFile(fn, (err, data) => {
                (err === null) ? resolve(data.toString('utf8')) : reject();
            });
        }),
        set: (_, value) => new Promise((resolve, reject) => {
            const fn = fnSupplier(value);
            const dir = path.dirname(fn);
            ensureFSP(dir, (dirErr) => {
                if (dirErr !== null) {
                    reject(dirErr);
                }
                else {
                    const data = Buffer.from(value, 'utf8');
                    fs.writeFile(fn, data, (fileErr) => {
                        (fileErr === null) ? resolve() : reject(fileErr);
                    });
                }
            });
        }),
        toKey: () => new Promise((resolve) => {
            resolve(fnSupplier());
        }),
    };
}
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
export function fsJsonMemoizeStoreStrategy(options) {
    var _a;
    const fnSupplier = options.fileNameSupplier;
    const ensureFSP = (_a = options === null || options === void 0 ? void 0 : options.ensureFsPathExists) !== null && _a !== void 0 ? _a : ensureFsPathExists;
    const acceptPersistedFile = options === null || options === void 0 ? void 0 : options.acceptPersistedFile;
    return {
        get: () => new Promise((resolve, reject) => {
            const fn = fnSupplier();
            if (acceptPersistedFile) {
                const stats = fs.statSync(fn, { throwIfNoEntry: false });
                if (stats) {
                    const reason = acceptPersistedFile(stats, fn);
                    if (typeof reason !== "boolean" || !reason) {
                        reject(reason);
                        return;
                    }
                }
            }
            fs.readFile(fn, (err, data) => {
                (err === null) ? resolve(JSON.parse(data.toString('utf8'))) : reject();
            });
        }),
        set: (_, value) => new Promise((resolve, reject) => {
            const fn = fnSupplier(value);
            const dir = path.dirname(fn);
            ensureFSP(dir, (dirErr) => {
                if (dirErr !== null) {
                    reject(dirErr);
                }
                else {
                    const data = Buffer.from(JSON.stringify(value), 'utf8');
                    fs.writeFile(fn, data, (fileErr) => {
                        (fileErr === null) ? resolve() : reject(fileErr);
                    });
                }
            });
        }),
        toKey: () => new Promise((resolve) => {
            resolve(fnSupplier());
        }),
    };
}
//# sourceMappingURL=memoize.js.map