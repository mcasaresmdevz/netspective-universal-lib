import path from 'node:path';
import postgres from 'postgres';
import { z } from 'zod';
import * as m from './memoize';
export const PostgreSqlDefaultConnID = 'DEFAULT';
// to test this RegExp, you can use https://regex101.com/ REPL
export const pgConnUrlPattern = /^postgres.*?:\/\/[^:]*(:[^@]*)?@[^:]*:[^\/]*\/.*/;
export const dbConnsEnvConfigSchema = z.object({
    defaultConnID: z.string(),
    URLs: z.record(z.string(), z.string().regex(pgConnUrlPattern)),
});
export const dbConfigureFromText = (configSupplier) => {
    // see: https://docs.astro.build/en/guides/environment-variables/ (can't use process.env)
    const configTextSupplied = configSupplier();
    const simpleTextConn = (text) => {
        return {
            isConfigured: true,
            configTextSupplied,
            connURLs: {
                defaultConnID: PostgreSqlDefaultConnID,
                URLs: { [PostgreSqlDefaultConnID]: text },
            },
            defaultConnURL: text,
        };
    };
    if (configTextSupplied) {
        if (configTextSupplied.match(pgConnUrlPattern)) {
            return simpleTextConn(configTextSupplied);
        }
        else {
            try {
                const parsed = JSON.parse(configTextSupplied);
                if (typeof parsed === 'string' && parsed.match(pgConnUrlPattern)) {
                    return simpleTextConn(parsed);
                }
                else {
                    if (typeof parsed == 'object') {
                        const conns = dbConnsEnvConfigSchema.parse(parsed);
                        return {
                            isConfigured: true,
                            configTextSupplied,
                            connURLs: conns,
                            defaultConnURL: parsed.conns[parsed.defaultConnID],
                        };
                    }
                    else {
                        return {
                            isConfigured: false,
                            configTextSupplied,
                            configTextParseError: new Error('Expected single JSON object, got ' + typeof parsed),
                        };
                    }
                }
            }
            catch (err) {
                return { isConfigured: false, configTextSupplied, configTextParseError: err };
            }
        }
    }
    else {
        return { isConfigured: false };
    }
};
export const mssFactory = ({ isDbAvailable, mssStatsInstances = new Map(), }) => {
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
    const mssFileNameSupplier = (key) => (_value) => path.join(process.cwd(), 'src', 'cache', 'memoized-sql-results', key.replace(invalidChars, '-')) + '.memoized.json';
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
                        if (isDbAvailable()) {
                            // if we're running "production" (or "build") mode, only read from cache if not more than a few minutes old
                            const ageInMS = Date.now() - stats.mtime.valueOf();
                            if (ageInMS > 1000 * 60 * 3)
                                return new Error('time expired');
                            return true;
                        }
                        else {
                            // if there's no database, we always accept the cache
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
export const memoizableSqlResults = (options) => {
    const instances = new Map();
    return (queryFn, key) => {
        let instance = instances.get(key);
        if (!instance) {
            instance = m.memoize(queryFn, mssFactory(options)(key));
            instances.set(key, instance);
        }
        return instance;
    };
};
/**
 * Construct a function that will allow connections to be created by ID.
 * Should be used like `dbConnsFactory.conn(ID)` or dbConnsFactory.conn()
 * for default connection. dbConnsFactory.conn().SQL can be used safely
 * for idempotent calls.
 *
 * @returns a function that can be called idempotently to create or open the database
 */
export const prepareConnsFactory = (configure) => {
    let connSqlInstances = new Map();
    let factory;
    return () => {
        if (factory)
            return factory;
        const dbConfig = configure();
        factory = {
            dbConfig,
            connSqlInstances,
            conn: async (connID = PostgreSqlDefaultConnID) => {
                var _a;
                const connURL = (dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.isConfigured) ? (_a = dbConfig.connURLs) === null || _a === void 0 ? void 0 : _a.URLs[connID] : undefined;
                if (!connURL) {
                    const SQL = postgres();
                    return {
                        connID,
                        state: 'invalid connection ID',
                        SQL,
                        memoizableSqlResults: memoizableSqlResults({ isDbAvailable: () => false }),
                    };
                }
                let connState = connSqlInstances.get(connURL);
                if (!connState) {
                    try {
                        const SQL = postgres(connURL ? connURL : 'postgres://localhost/unknown_db', {
                            connection: { application_name: `postgres.js::astro` },
                        });
                        const testResult = await SQL `select 1`;
                        if (testResult && testResult.length == 1) {
                            const connection = {
                                host: SQL.options.host,
                                port: SQL.options.port,
                                database: SQL.options.database,
                                user: SQL.options.user,
                                ...SQL.options.connection,
                            };
                            connState = {
                                connID,
                                state: 'valid',
                                connection,
                                connUrlInfo: `postgres://${connection.user}@${connection.host.join(',')}:${connection.host.join(',')}/${connection.database}`,
                                SQL,
                                memoizableSqlResults: memoizableSqlResults({ isDbAvailable: () => true }),
                            };
                        }
                        else {
                            const SQL = postgres();
                            connState = {
                                connID,
                                state: 'unknown',
                                SQL,
                                memoizableSqlResults: memoizableSqlResults({ isDbAvailable: () => false }),
                            };
                        }
                    }
                    catch (err) {
                        // TODO: check every few minutes or just give up after first try?
                        if (err instanceof Error) {
                            console.warn(`[${err.name}] Database is not available:`, err.message);
                            console.dir(dbConfig);
                        }
                        const SQL = postgres();
                        connState = {
                            connID,
                            state: 'invalid connection',
                            SQL,
                            memoizableSqlResults: memoizableSqlResults({ isDbAvailable: () => false }),
                        };
                    }
                    connSqlInstances.set(connID, connState);
                }
                return connState;
            },
            end: async () => {
                var _a;
                for await (const csi of connSqlInstances.values()) {
                    if (csi.state === 'valid')
                        await ((_a = csi.SQL) === null || _a === void 0 ? void 0 : _a.end());
                }
            },
        };
        return factory;
    };
};
/**
 * Construct a function that will allow connections to be created by ID.
 * Should be used like `dbConnsFactory.conn(ID)` or dbConnsFactory.conn()
 * for default connection. dbConnsFactory.conn().SQL can be used safely
 * for idempotent calls.
 *
 * @returns a function that can be called idempotently to create or open the database
 */
export const dbConnsFactory = (() => {
    const cf = prepareConnsFactory(() => {
        const result = dbConfigureFromText(() => { var _a; return (_a = process.env.SERVICE_DB_CONN_URLS) !== null && _a !== void 0 ? _a : import.meta.env.SERVICE_DB_CONN_URLS; });
        if (!result)
            return { isConfigured: false };
        return result;
    });
    return () => cf();
})();
process.on('SIGINT', async () => {
    dbConnsFactory().end();
    process.exit();
});
//# sourceMappingURL=pg-conn.js.map