export function up(knex) {
  return knex.schema.createTable("events", (table) => {
    table.increments("id").primary();
    table.integer("group_id").unsigned().references("groups.id").onUpdate("CASCADE").onDelete("CASCADE");
    table.datetime("time").notNullable();
    table.string("location");
    table.string("address");
    table.string("remote_link");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("events");
}
