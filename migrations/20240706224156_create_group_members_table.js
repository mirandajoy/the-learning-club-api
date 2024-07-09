export function up(knex) {
  return knex.schema.createTable("group_members", (table) => {
    table.increments("id").unsigned().primary();
    table.integer("group_id").unsigned().references("groups.id").onUpdate("CASCADE").onDelete("CASCADE");
    table.integer("user_id").unsigned().references("user_profiles.id").onUpdate("CASCADE").onDelete("CASCADE");
    table.string("role").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("group_members");
}
