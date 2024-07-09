export function up(knex) {
    return knex.schema
    .createTable('user_profiles', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();;
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

export function down(knex) {
    return knex.schema.dropTable('user_profiles');
};
