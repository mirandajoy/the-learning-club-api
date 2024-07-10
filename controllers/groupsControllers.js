import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getGroups = async (req, res) => {
  if (!req.headers.authorization) {
    try {
      const groups = await knex
        .select("id", "city", "state", "country", "remote")
        .from("groups")
        .where({ remote: 0 })
        .orderBy("city");
      return res.status(200).send(groups);
    } catch (err) {
      return res.status(500).send({ message: "An error occurred on the server" });
    }
  }

  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];
  const payload = jwt.verify(authToken, process.env.JWT_KEY);

  try {
    const groups = await knex
      .with("groups_joined", (qb) => {
        qb.select("group_id").from("group_members").where({ user_id: payload.id }).groupBy("group_id");
      })
      .select("*")
      .from("groups_joined")
      .rightJoin("groups", "groups.id", "groups_joined.group_id")
      .where({ remote: 0 });
    res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const joinGroup = async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];

  const payload = jwt.verify(authToken, process.env.JWT_KEY);

  const newMember = {
    group_id: id,
    user_id: payload.id,
    role: "member",
  };

  try {
    const memberId = await knex("group_members").insert(newMember);
    const addedMember = { id: memberId[0], group_id: id, role: "member" };
    res.status(201).send(addedMember);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getGroupEvents = async (req, res) => {
  const { id } = req.params;

  try {
    const events = await knex.select("id", "location", "time").from("events").where({ group_id: id }).orderBy("time");
    res.status(200).send(events);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
