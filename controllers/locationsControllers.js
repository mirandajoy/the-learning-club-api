import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getCountries = async (_req, res) => {
  try {
    const countries = await knex("countries");
    return res.status(200).send(countries);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const getRegions = async (_req, res) => {
  try {
    const regions = await knex("regions");
    return res.status(200).send(regions);
  } catch (err) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
