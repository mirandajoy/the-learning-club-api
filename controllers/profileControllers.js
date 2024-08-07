import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getProfile = async (req, res) => {
  const payload = req.tokenPayload;

  try {
    const profile = await knex("user_profiles").where({ id: payload.id }).select("name").first();
    res.status(200).send(profile);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getProfileGroups = async (req, res) => {
  const payload = req.tokenPayload;

  try {
    const profileGroups = await knex
      .select(
        "groups.id",
        "city",
        "region_id",
        "regions.region_name",
        "groups.country_id",
        "countries.country_name",
        "remote",
        "name",
        "group_id as joined",
        "role"
      )
      .from("group_members")
      .join("groups", "groups.id", "group_members.group_id")
      .leftJoin("countries", "countries.id", "groups.country_id")
      .leftJoin("regions", "regions.id", "groups.region_id")
      .where({ user_id: payload.id })
      .orderBy("city");

    return res.status(200).send(profileGroups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getProfileEvents = async (req, res) => {
  const payload = req.tokenPayload;

  try {
    const profileEvents = await knex
      .with("rsvp", (qb) => {
        qb.select("id", "event_id", "status").from("event_rsvps").where({ user_id: payload.id });
      })
      .select(
        "events.id",
        "time",
        "location",
        "remote_link",
        "status",
        "events.group_id as joined",
        "rsvp.id as rsvp_id"
      )
      .from("rsvp")
      .rightJoin("events", "events.id", "rsvp.event_id")
      .leftJoin("group_members", "group_members.group_id", "events.group_id")
      .where({ user_id: payload.id })
      .orderBy("time");

    res.status(200).send(profileEvents);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
