import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");
dayjs.extend(customParseFormat);

const knex = initKnex(configuration);

export const getGroups = async (req, res) => {
  if (!req.tokenPayload) {
    try {
      const groups = await knex
        .select(
          "groups.id",
          "city",
          "region_id",
          "regions.region_name",
          "groups.country_id",
          "countries.country_name",
          "remote",
          "name"
        )
        .from("groups")
        .join("countries", "countries.id", "groups.country_id")
        .join("regions", "regions.id", "groups.region_id")
        .orderBy("name");
      return res.status(200).send(groups);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const payload = req.tokenPayload;

  try {
    const groups = await knex
      .with("groups_joined", (qb) => {
        qb.select("group_id", "role").from("group_members").where({ user_id: payload.id });
      })
      .select(
        "groups.id",
        "city",
        "region_id",
        "regions.region_name",
        "groups.country_id",
        "countries.country_name",
        "remote",
        "name",
        "role",
        "group_id as joined"
      )
      .from("groups_joined")
      .rightJoin("groups", "groups.id", "groups_joined.group_id")
      .join("countries", "countries.id", "groups.country_id")
      .join("regions", "regions.id", "groups.region_id")
      .orderBy("city");
    return res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getSingleGroup = async (req, res) => {
  const { id } = req.params;

  if (!req.tokenPayload) {
    try {
      const groups = await knex
        .select(
          "groups.id",
          "city",
          "region_id",
          "regions.region_name",
          "groups.country_id",
          "countries.country_name",
          "remote",
          "name"
        )
        .from("groups")
        .join("countries", "countries.id", "groups.country_id")
        .join("regions", "regions.id", "groups.region_id")
        .andWhere({ "groups.id": id })
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
      .select(
        "groups.id",
        "city",
        "region_id",
        "regions.region_name",
        "groups.country_id",
        "countries.country_name",
        "remote",
        "name",
        "group_id as joined"
      )
      .from("groups_joined")
      .rightJoin("groups", "groups.id", "groups_joined.group_id")
      .join("countries", "countries.id", "groups.country_id")
      .join("regions", "regions.id", "groups.region_id")
      .andWhere({ "groups.id": id })
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
      const events = await knex("events")
        .select("id", "time", "location", "address", "group_id", "remote_link", "user_tz")
        .where({ group_id: id });

      const eventTimeUTC = events.map((row) => {
        return {
          ...row,
          time: dayjs.tz(row.time, row.user_tz).format("YYYY-MM-DD HH:mm:ss Z"),
        };
      });

      return res.status(200).send(eventTimeUTC);
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
      .select("events.id", "location", "time", "status", "group_id as joined", "remote_link", "rsvp.id as rsvp_id")
      .from("events")
      .leftJoin("rsvp", "events.id", "rsvp.event_id")
      .where({ group_id: id });
    res.status(200).send(eventList);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const createGroup = async (req, res) => {
  const { groupName, city, region_id, country_id, remote } = req.body;

  const payload = req.tokenPayload;

  const newGroup = {
    name: groupName,
    city: city || null,
    region_id: region_id || null,
    country_id: country_id || null,
    remote: parseInt(remote),
  };

  const newOwner = {
    user_id: payload.id,
    role: "owner",
  };

  const mkGroup = await knex.transaction();
  const mkOwner = await knex.transaction();

  try {
    const [groupId] = await mkGroup("groups").insert(newGroup);

    const ownerWithForeignKey = {
      ...newOwner,
      group_id: groupId,
    };

    await mkGroup.commit();

    await mkOwner("group_members").insert(ownerWithForeignKey);
    await mkOwner.commit();

    return res.status(201).send({ message: groupId });
  } catch (err) {
    await mkGroup.rollback();
    await mkOwner.rollback();

    return res.sendStatus(500).send({ message: "An error occurred on the server" });
  }
};

export const editGroup = async (req, res) => {
  const { id } = req.params;
  const { groupName, city, region_id, country_id, remote } = req.body;

  const payload = req.tokenPayload;

  const updatedGroup = {
    name: groupName,
    city: city,
    region_id: region_id,
    country_id: country_id,
    remote: remote,
  };

  try {
    const result = await knex("groups").where({ id: id }).update(updatedGroup);

    return res.status(201).send({ message: "Group updated" });
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  const payload = req.tokenPayload;

  try {
    await knex("groups").where({ id: id }).del();
    return res.status(201).send({ message: "Group deleted" });
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
