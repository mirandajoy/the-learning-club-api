import countryData from "../seed-data/countries.js";

export async function seed(knex) {
  await knex("countries").del();
  await knex("countries").insert(countryData);
}