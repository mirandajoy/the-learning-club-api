export function up(knex) {
    return knex.schema
    .createTable('countries', (table) => {
      table.increments('id').primary();
      table.string('country_name').notNullable();
    })
};

export function down(knex) {
    return knex.schema.dropTable('countries');
};
