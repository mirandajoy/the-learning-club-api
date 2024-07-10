import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getEvents = async (req, res) => {
  try {
    const events = await knex
      .select("id", "location", "time")
      .from("events")
      .where({ group_id: groupId })
      .first();
    res.status(200).send(events);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
