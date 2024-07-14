import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import initKnex from "knex";

import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
  };

  try {
    const existingUsers = await knex("user_profiles").where({ email: email });
    if (existingUsers.length > 0) {
      return res.status(404).send({ message: "This email has already been used to create an account" });
    } else {
      const user = await knex("user_profiles").insert(newUser);
      const userid = user[0];

      const token = jwt.sign({ id: userid }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });
      return res.status(201).json(token);
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await knex("user_profiles").where({ email: email }).first();
    if (!existingUser) {
      return res.status(400).send({ message: "This email and password combination doesn't match"});
    }
    const passwordCheck = bcrypt.compareSync(password, existingUser.password);
    if (!passwordCheck) {
      return res.status(400).send({ message: "This email and password combination doesn't match"});
    }

    const token = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (error) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
