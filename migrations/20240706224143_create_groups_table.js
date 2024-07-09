export function up(knex) {
    return knex.schema
    .createTable('groups', (table) => {
      table.increments('id').unsigned().primary();
      table.string('city');
      table.string('state');
      table.string('country');
      table.boolean('remote').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

export function down(knex) {
    return knex.schema.dropTable('groups');
};
