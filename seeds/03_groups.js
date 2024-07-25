import groupsData from "../seed-data/groups.js";

export async function seed(knex) {
  await knex("groups").del();
  await knex("groups").insert(groupsData);
}