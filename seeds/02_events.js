import eventsData from "../seed-data/events.js";

export async function seed(knex) {
  await knex("events").del();
  await knex("events").insert(eventsData);
}