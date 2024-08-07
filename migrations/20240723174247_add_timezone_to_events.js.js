export function up(knex) {
    return knex.schema
    .table('events', (table) => {
      table.string('user_tz').notNullable();
    })
};

export function down(knex) {
    return knex.schema.table('events', (table) => {
      table.dropColumn('user_tz');
    })
};
