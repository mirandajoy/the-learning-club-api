import regionData from "../seed-data/regions.js";

export async function seed(knex) {
  await knex("regions").del();
  await knex("regions").insert(regionData);
}