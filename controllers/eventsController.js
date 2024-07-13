import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getEvents = async (req, res) => {
  try {
    const events = await knex.select("id", "location", "time").from("events").where({ group_id: groupId }).first();
    res.status(200).send(events);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  const payload = req.tokenPayload;

  try {
    const singleEvent = await knex
      .with("rsvp", (qb) => {
        qb.select("id", "event_id", "status")
          .from("event_rsvps")
          .where({ user_id: payload.id });
      })
      .select("events.id", "location", "address", "time", "status", "rsvp.id as rsvp_id")
      .from("events")
      .leftJoin("rsvp", "events.id", "rsvp.event_id")
      .where({"events.id": id })
      .first();

    console.log(singleEvent);
    res.status(200).send(singleEvent);
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
    status: response,
  };

  try {
    const rsvpId = await knex("event_rsvps").insert(eventRSVP);
    const addedRsvp = { id: rsvpId[0], event_id: id, response: response };
    res.status(201).send(addedRsvp);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const updateRSVP = async (req, res) => {
  const { id, rsvpId } = req.params;
  const { response } = req.body;

  const payload = req.tokenPayload;

  const eventRSVP = {
    user_id: payload.id,
    event_id: id,
    status: response,
  };

  try {
    const rsvpDBId = await knex("event_rsvps").where({ id: rsvpId }).update(eventRSVP);
    const updatedRsvp = { id: rsvpDBId[0], event_id: id, response: response };
    res.status(201).send(updatedRsvp);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
