import express from "express";

import {createUser, loginUser} from "../controllers/userControllers.js";

const usersRouter = express.Router();

usersRouter.post("/signup", createUser);
usersRouter.post("/signin", loginUser);

export default usersRouter;