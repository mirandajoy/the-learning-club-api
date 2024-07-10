import express from "express";
import auth from "../middleware/auth.js";

import {getGroups, joinGroup, getGroupEvents} from "../controllers/groupsControllers.js";

const groupsRouter = express.Router();

groupsRouter.get("/", auth, getGroups);
groupsRouter.post("/:id/members", auth, joinGroup);
groupsRouter.get("/:id/events", getGroupEvents);

export default groupsRouter;