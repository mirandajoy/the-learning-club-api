import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getGroups = async (req, res) => {
  try {
    const groups = await knex.select("id", "city", "state", "country", "remote").from("groups").orderBy("city");
    res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
