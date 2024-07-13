import express from "express";
import auth from "../middleware/auth.js";

import {getGroups, getSingleGroup, joinGroup, getGroupEvents} from "../controllers/groupsControllers.js";

const groupsRouter = express.Router();

groupsRouter.get("/", auth, getGroups);
groupsRouter.get("/:id", auth, getSingleGroup);
groupsRouter.post("/:id/members", auth, joinGroup);
groupsRouter.get("/:id/events", getGroupEvents);

export default groupsRouter;