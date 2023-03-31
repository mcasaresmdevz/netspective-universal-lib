import postgres from 'postgres';
import { z } from 'zod';
import * as m from './memoize';
export declare const PostgreSqlDefaultConnID: "DEFAULT";
export type PostgreSqlConnID = string | typeof PostgreSqlDefaultConnID;
export type PostgreSqlConnURL = string;
export declare const pgConnUrlPattern: RegExp;
export declare const dbConnsEnvConfigSchema: z.ZodObject<{
    defaultConnID: z.ZodString;
    URLs: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    defaultConnID: string;
    URLs: Record<string, string>;
}, {
    defaultConnID: string;
    URLs: Record<string, string>;
}>;
export interface DatabasesConfiguration {
    readonly isConfigured: boolean;
    readonly connURLs?: z.infer<typeof dbConnsEnvConfigSchema>;
    readonly defaultConnURL?: PostgreSqlConnURL;
    readonly configTextSupplied?: string | undefined;
    readonly configTextParseError?: Error | undefined;
}
export declare const dbConfigureFromText: (configSupplier: () => string | undefined) => DatabasesConfiguration;
export type SqlConnState = {
    readonly connID: PostgreSqlConnID;
    readonly state: 'unknown' | 'valid' | 'invalid connection' | 'invalid connection ID';
    readonly connection?: {
        [key: string]: any;
        host: string[];
        port: number[];
        database: string;
        user: string;
    };
    readonly connUrlInfo?: string | undefined;
    readonly SQL: postgres.Sql;
    readonly memoizableSqlResults: <A extends unknown[], V>(queryFn: (...args: A) => Promise<V>, key: string) => (...args: A) => Promise<V>;
};
export declare const mssFactory: ({ isDbAvailable, mssStatsInstances, }: {
    readonly isDbAvailable: () => boolean;
    readonly mssStatsInstances?: Map<string, {
        readonly key: string;
        gets: number;
        sets: number;
        readonly reject: Error[];
    }> | undefined;
}) => <V>(key: string) => m.MemoizeStoreStrategy<string, V>;
export declare const memoizableSqlResults: (options: {
    readonly isDbAvailable: () => boolean;
}) => <A extends unknown[], V>(queryFn: (...args: A) => Promise<V>, key: string) => (...args: A) => Promise<V>;
/**
 * Construct a function that will allow connections to be created by ID.
 * Should be used like `dbConnsFactory.conn(ID)` or dbConnsFactory.conn()
 * for default connection. dbConnsFactory.conn().SQL can be used safely
 * for idempotent calls.
 *
 * @returns a function that can be called idempotently to create or open the database
 */
export declare const prepareConnsFactory: (configure: () => DatabasesConfiguration) => () => {
    dbConfig: DatabasesConfiguration;
    connSqlInstances: Map<PostgreSqlConnID, SqlConnState>;
    conn: (connID?: string) => Promise<SqlConnState>;
    end: () => Promise<void>;
};
/**
 * Construct a function that will allow connections to be created by ID.
 * Should be used like `dbConnsFactory.conn(ID)` or dbConnsFactory.conn()
 * for default connection. dbConnsFactory.conn().SQL can be used safely
 * for idempotent calls.
 *
 * @returns a function that can be called idempotently to create or open the database
 */
export declare const dbConnsFactory: () => {
    dbConfig: DatabasesConfiguration;
    connSqlInstances: Map<PostgreSqlConnID, SqlConnState>;
    conn: (connID?: string) => Promise<SqlConnState>;
    end: () => Promise<void>;
};
