import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getEvents = async (req, res) => {
  try {
    const events = await knex
      .select("id", "location", "time", "group_id", "remote_link")
      .from("events")
      .where({ group_id: groupId })
      .first();
    return res.status(200).send(events);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getSingleEvent = async (req, res) => {
  const { id } = req.params;

  if (!req.tokenPayload) {
  
    try {
      const events = await knex("events")
        .select("events.id", "location", "time", "group_id", "remote_link")
        .where({ id: id })
        .first();
      return res.status(200).send(events);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const payload = req.tokenPayload;
  
  try {
    const singleEvent = await knex
      .with("rsvp", (qb) => {
        qb.select("id", "event_id", "status").from("event_rsvps").where({ user_id: payload.id });
      })
      .select("events.id", "location", "address", "time", "status", "group_id", "rsvp.id as rsvp_id", "remote_link")
      .from("events")
      .leftJoin("rsvp", "events.id", "rsvp.event_id")
      .where({ "events.id": id })
      .first();
    return res.status(200).send(singleEvent);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const createEvent = async (req, res) => {
  const { location, address, time, group_id, remote_link, user_tz } = req.body;

  const payload = req.tokenPayload;

  const newEvent = {
    location: location,
    address: address,
    time: time,
    user_tz: user_tz,
    group_id: group_id,
    remote_link: remote_link,
  };

  const ownerRSVP = {
    user_id: payload.id,
    status: "attending",
  };

  const mkEvent = await knex.transaction();
  const mkRSVP = await knex.transaction();

  try {
    const [eventId] = await mkEvent("events").insert(newEvent);

    const rsvpWithForeignKey = {
      ...ownerRSVP,
      event_id: eventId,
    };

    await mkEvent.commit();

    await mkRSVP("event_rsvps").insert(rsvpWithForeignKey);
    await mkRSVP.commit();

    return res.status(201).send({ message: "New event created" });
  } catch (err) {
    await mkEvent.rollback();
    await mkRSVP.rollback();

    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { location, address, time, group_id, remote_link } = req.body;

  const payload = req.tokenPayload;

  const updatedEvent = {
    location: location,
    address: address,
    time: time,
    group_id: group_id,
    remote_link: remote_link,
  };

  try {
    await knex("events").where({ id: id }).update(updatedEvent);

    return res.status(201).send({ message: "Event updated" });
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const payload = req.tokenPayload;

  try {
    await knex("events").where({ id: id }).del();
    return res.status(201).send({ message: "Event deleted" });
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
    const addedRsvp = { id: rsvpId[0], event_id: id, status: response };
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
    const updatedRsvp = { id: rsvpDBId[0], event_id: id, status: response };
    return res.status(201).send(updatedRsvp);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
