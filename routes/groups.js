import express from "express";

import { createGroup, deleteGroup, editGroup, getGroupEvents, getGroups, getSingleGroup, joinGroup } from "../controllers/groupsControllers.js";
import auth from "../middleware/auth.js";

const groupsRouter = express.Router();

groupsRouter.get("/", auth, getGroups);
groupsRouter.post("/", auth, createGroup);
groupsRouter.put("/:id", auth, editGroup);
groupsRouter.delete("/:id", auth, deleteGroup);
groupsRouter.get("/:id", auth, getSingleGroup);
groupsRouter.post("/:id/members", auth, joinGroup);
groupsRouter.get("/:id/events", auth, getGroupEvents);

export default groupsRouter;