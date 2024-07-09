import initKnex from "knex";
import configuration from "../knexfile.js";
import bcrypt from "bcrypt";

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
      return res.status(404).send({ message: "This user already exists" });
    } else {
      await knex("user_profiles").insert(newUser);
      return res.status(201).json("New user successfully created");
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
      return res.status(400).send("Invalid email");
    }
    const passwordCheck = bcrypt.compareSync(password, existingUser.password);
    if (!passwordCheck) {
      return res.status(400).send("Invalid password");
    }
    res.status(200).json("Logged In");;
  } catch (error) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
};
