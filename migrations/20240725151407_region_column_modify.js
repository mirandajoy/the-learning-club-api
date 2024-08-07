export function up(knex) {
  return knex.schema.table("regions", function (table) {
    table.dropForeign("country_id");
    table.foreign("country_id").references("countries.id").onUpdate("CASCADE").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.table("regions", function (table) {
    table.dropForeign("country_id");
    table.foreign("country_id").references("countries.id");
  });
}
