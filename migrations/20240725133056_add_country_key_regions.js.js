export function up(knex) {
    return knex.schema
    .table('regions', (table) => {
      table.integer("country_id").unsigned().references("countries.id").onUpdate("CASCADE");
    })
};

export function down(knex) {
    return knex.schema.table('regions', (table) => {
      table.dropColumn('country_id');
    })
};