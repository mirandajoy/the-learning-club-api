export function up(knex) {
    return knex.schema
    .createTable('regions', (table) => {
      table.increments('id').primary();
      table.string('region_name').notNullable();
    })
};

export function down(knex) {
    return knex.schema.dropTable('regions');
};
