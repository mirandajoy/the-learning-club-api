import express from "express";

import {getGroups, joinGroup, getGroupEvents} from "../controllers/groupsControllers.js";

const groupsRouter = express.Router();

groupsRouter.get("/", getGroups);
groupsRouter.post("/:id/members", joinGroup);
groupsRouter.get("/:id/events", getGroupEvents);

export default groupsRouter;