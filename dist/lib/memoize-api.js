import path from 'node:path';
import * as m from './memoize';
export const apiMssFactory = ({ isApiAvailable, mssStatsInstances = new Map(), }) => {
    const mssStatsFactory = (key) => {
        let msssInstance = mssStatsInstances.get(key);
        if (!msssInstance) {
            msssInstance = { key, gets: 0, sets: 0, reject: [] };
            mssStatsInstances.set(key, msssInstance);
        }
        return msssInstance;
    };
    // Rationale: <valid-url-path-chars> minus <invalid-file-system-chars>
    // [1] valid url path chars: https://tools.ietf.org/html/rfc3986
    // [2] invalid file system chars: https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    const invalidChars = /[^a-zA-Z0-9\-._~!$&'()+,;=@]/g;
    // provide a fileName supplier for a given key
    const mssFileNameSupplier = (key) => (_value) => path.join(process.cwd(), 'src', 'cache', 'memoized-api-responses', key.replace(invalidChars, '-').replaceAll(/\-+/g, '-')) + '.memoized.json';
    const instances = new Map();
    return (key) => {
        let instance = instances.get(key);
        if (!instance) {
            const fsMSS = m.fsJsonMemoizeStoreStrategy({
                fileNameSupplier: mssFileNameSupplier(key),
                acceptPersistedFile: (stats, fn) => {
                    const accept = () => {
                        // if we're running in dev mode, always read from fs cache
                        if (import.meta.env.DEV)
                            return true;
                        if (isApiAvailable()) {
                            // if we're running "production" (or "build") mode, only read from cache if not more than a few minutes old
                            const ageInMS = Date.now() - stats.mtime.valueOf();
                            if (ageInMS > 1000 * 60 * 3)
                                return new Error('time expired');
                            return true;
                        }
                        else {
                            // if there's no API token available, we always accept the cache
                            return true;
                        }
                    };
                    const result = accept();
                    if (typeof result !== 'boolean' || !result) {
                        mssStatsFactory(fn).reject.push(result);
                    }
                    return result;
                },
            });
            // wrap the instance in an instrumentation layer so we can capture stats
            instance = {
                get: (key) => {
                    mssStatsFactory(key).gets++;
                    return fsMSS.get(key);
                },
                set: (key, value) => {
                    mssStatsFactory(key).sets++;
                    return fsMSS.set(key, value);
                },
                toKey: fsMSS.toKey,
            };
        }
        return instance;
    };
};
export const memoizableApiResponse = (options) => {
    const instances = new Map();
    return (apiCallFn, key) => {
        let instance = instances.get(key);
        if (!instance) {
            instance = m.memoize(apiCallFn, apiMssFactory(options)(key));
            instances.set(key, instance);
        }
        return instance;
    };
};
//# sourceMappingURL=memoize-api.js.map