export function up(knex) {
  return knex.schema.createTable("event_rsvps", (table) => {
    table.increments("id").primary();
    table.integer("event_id").unsigned().references("events.id").onUpdate("CASCADE").onDelete("CASCADE");
    table.integer("user_id").unsigned().references("user_profiles.id").onUpdate("CASCADE").onDelete("CASCADE");
    table.string("status").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("event_rsvps");
}
