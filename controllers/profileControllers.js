import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getProfile = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Please login");
  }

  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(authToken, process.env.JWT_KEY);
    const profile = await knex("user_profiles").where({ id: payload.id }).select("name").first();
    res.status(200).send(profile);
  } catch (err) {
    console.log(err);
  }
};
