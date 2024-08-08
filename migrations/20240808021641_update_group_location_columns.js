export function up(knex) {
  return knex.schema.table("groups", function (table) {
    table.renameColumn("country", "country_id");
    table.renameColumn("state", "region_id");
  });
}

export function down(knex) {
  return knex.schema.table("groups", function (table) {
    table.renameColumn("country_id", "country");
    table.renameColumn("region_id", "state");
  });
}
