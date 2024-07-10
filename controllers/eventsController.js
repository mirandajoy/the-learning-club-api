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

export const eventRSVP = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  const payload = req.tokenPayload;

  const eventRSVP = {
    user_id: payload.id,
    event_id: id,
    status: response
  }

  try {
    const rsvpId = await knex("event_rsvps").insert(eventRSVP);
    const addedRsvp = { id: rsvpId[0], event_id: id, response: response };
    res.status(201).send(addedRsvp);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};