export function up(knex) {
    return knex.schema
    .table('groups', (table) => {
      table.string('name').notNullable();
    })
};

export function down(knex) {
    return knex.schema.table('groups', (table) => {
      table.dropColumn('name');
    })
};
