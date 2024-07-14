import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getGroups = async (req, res) => {
  if (!req.tokenPayload) {
    try {
      const groups = await knex
        .select("id", "city", "state", "country", "remote", "name")
        .from("groups")
        .orderBy("city");
      return res.status(200).send(groups);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const payload = req.tokenPayload;

  try {
    const groups = await knex
      .with("groups_joined", (qb) => {
        qb.select("group_id").from("group_members").where({ user_id: payload.id }).groupBy("group_id");
      })
      .select("*")
      .from("groups_joined")
      .rightJoin("groups", "groups.id", "groups_joined.group_id")
      .orderBy("city");
    res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getSingleGroup = async (req, res) => {
  const { id } = req.params;

  if (!req.tokenPayload) {
    try {
      const groups = await knex
        .select("id", "city", "state", "country", "remote", "name")
        .from("groups")
        .andWhere({ id: id })
        .first();
      return res.status(200).send(groups);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const payload = req.tokenPayload;

  try {
    const groups = await knex
      .with("groups_joined", (qb) => {
        qb.select("group_id").from("group_members").where({ user_id: payload.id }).groupBy("group_id");
      })
      .select("*")
      .from("groups_joined")
      .rightJoin("groups", "groups.id", "groups_joined.group_id")
      .andWhere({ id: id })
      .first();
    return res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const joinGroup = async (req, res) => {
  const { id } = req.params;

  const payload = req.tokenPayload;

  const newMember = {
    group_id: id,
    user_id: payload.id,
    role: "member",
  };

  try {
    const memberId = await knex("group_members").insert(newMember);
    const addedMember = { id: memberId[0], group_id: id, role: "member" };
    return res.status(201).send(addedMember);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getGroupEvents = async (req, res) => {
  const { id } = req.params;

  if (!req.tokenPayload) {
    try {
      const events = await knex("events").select("*").where({ group_id: id });

      return res.status(200).send(events);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const payload = req.tokenPayload;

  try {
    const eventList = await knex
      .with("rsvp", (qb) => {
        qb.select("id", "event_id", "status").from("event_rsvps").where({ user_id: payload.id });
      })
      .select("events.id", "location", "time", "status", "group_id", "remote_link")
      .from("events")
      .leftJoin("rsvp", "events.id", "rsvp.event_id")
      .where({ group_id: id });
    res.status(200).send(eventList);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
