import { text, integer } from 'drizzle-orm/sqlite-core';
import { getTableColumns /* getTableIndexes, getTableForeignKeys, getTableCompositePrimaryKeys, getTableChecks */, } from 'drizzle-orm/sqlite-core/utils';
export const snakeToCamelCase = (text) => text
    .toLowerCase()
    .replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
// column consistency helpers for cases when the table name is not involved;
// if table name is involved in column descriptor, put in tableBuilderAide
export const primaryKeyFK = (column) => text(column.name).references(() => column);
export const atTimestamp = (name) => integer(`${name}_at`, { mode: 'timestamp' });
// TODO: build SQLa-like utilities, see https://github.com/opsfolio/core/blob/main/governance.ts
// port netspective-labs/aide/sql/render/ddl/enum-table.ts
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
export function tableBuilderAide(tableName) {
    const TBA = {
        tableName,
        primaryKeyColName: `${tableName}_id`,
        primaryKey: () => text(TBA.primaryKeyColName).primaryKey(),
        primaryKeyFK,
        atTimestamp,
        indexName: (...columns) => `${tableName}_${columns.map(c => c.name).join('_')}_idx`,
        uniqueIndexName: (...columns) => `${tableName}_${columns.map(c => c.name).join('_')}_unq_idx`,
        lintTable: (table, helpers) => {
            var _a, _b;
            const { encounterIssue, ignore } = helpers;
            const columns = getTableColumns(table);
            for (const colEntry of Object.entries(columns)) {
                const [propName, column] = colEntry;
                // make sure the table has a properly-named primary key
                if (column.primary &&
                    column.name != TBA.primaryKeyColName &&
                    column.name != 'id' &&
                    !((_a = ignore === null || ignore === void 0 ? void 0 : ignore.primaryKeyNameConsistency) === null || _a === void 0 ? void 0 : _a.call(ignore, column))) {
                    encounterIssue({
                        issue: `${tableName}.${column.name} is a primary key, it should be named ${tableName}.${TBA.primaryKeyColName} NOT ${column.name}`,
                    });
                }
                if (!column.primary && !((_b = ignore === null || ignore === void 0 ? void 0 : ignore.propNameConsistency) === null || _b === void 0 ? void 0 : _b.call(ignore, column))) {
                    const shouldBe = snakeToCamelCase(column.name);
                    if (propName != shouldBe) {
                        encounterIssue({
                            issue: `${table}.${propName} property should be named ${table}.${shouldBe} NOT ${propName}`,
                        });
                    }
                }
            }
        },
    };
    return TBA;
}
//# sourceMappingURL=drizzle-aide.js.map