import express from "express";

import {getGroups} from "../controllers/groupsControllers.js";

const groupsRouter = express.Router();

groupsRouter.get("/", getGroups);

export default groupsRouter;