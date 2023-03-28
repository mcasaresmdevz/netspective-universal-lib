import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core/columns/common';
import type { AnySQLiteTable } from 'drizzle-orm/sqlite-core/table';
export declare const snakeToCamelCase: (text: string) => string;
export declare const primaryKeyFK: (column: AnySQLiteColumn) => import("drizzle-orm/sqlite-core").SQLiteTextBuilder<string>;
export declare const atTimestamp: (name: string) => import("drizzle-orm/sqlite-core").SQLiteTimestampBuilder<{
    notNull: false;
    hasDefault: false;
}>;
/**
 * TODO for linting:
 * - [ ] Review https://azimutt.app/ to see the kinds of schema analysis it does:
 * 	     - All tables should have a primary key
 *       - Check if there are potential missing relations (using naming conventions?)
 *       - No heterogeous types (especially for FKs)
 *       - Large tables should be discouraged
 * - [ ] FK names in a table should be same as their referenced keys not arbitrary;
 *       e.g. hostId: integer('build_host_id').references(() => host.id).notNull() _NOT_
 *            hostId: integer('host_id').references(() => host.id).notNull()
 *       use getTableForeignKeys() and do cross-table checks across all tables.
 * - [ ] FK types in a table should be same type as their referenced keys
 * - [ ] index names can be duplicated without notice (until it breaks at migration), use getTableIndexes(table)
 * - [ ] how can we make lint rules type-safe like in SQLa instead of after the fact?
 */
/**
 * A typed object with props and functions that help build tables consistently.
 * - Primary keys have same name as table with _id
 * - Convenience types like dateTime are provided
 * - Index naming functions are provided
 * - Table linting is provided
 * @param tableName identity of the table that will be used to derive all other entity components
 * @returns a typed object with utility properties for naming and preparing
 */
export declare function tableBuilderAide<Principal extends string, PrimaryKeyColName extends string = `${Principal}_id`>(tableName: Principal): {
    tableName: Principal;
    primaryKeyColName: PrimaryKeyColName;
    primaryKey: () => import("drizzle-orm/sqlite-core/columns/common").SQLiteColumnBuilder<{
        data: string;
        driverParam: string;
        hasDefault: false;
        notNull: true;
    }, {}>;
    primaryKeyFK: (column: AnySQLiteColumn) => import("drizzle-orm/sqlite-core").SQLiteTextBuilder<string>;
    atTimestamp: (name: string) => import("drizzle-orm/sqlite-core").SQLiteTimestampBuilder<{
        notNull: false;
        hasDefault: false;
    }>;
    indexName: (...columns: AnySQLiteColumn[]) => string;
    uniqueIndexName: (...columns: AnySQLiteColumn[]) => string;
    lintTable: (table: AnySQLiteTable, helpers: {
        encounterIssue: (...i: {
            issue: string;
        }[]) => void;
        snakeToCamelCase: (text: string) => string;
        ignore?: {
            primaryKeyNameConsistency?: ((column: AnySQLiteColumn) => boolean) | undefined;
            propNameConsistency?: ((column: AnySQLiteColumn) => boolean) | undefined;
        } | undefined;
    }) => void;
};
