import express from "express";

import { getProfile, getProfileEvents, getProfileGroups } from "../controllers/profileControllers.js";
import auth from "../middleware/auth.js";

const profilesRouter = express.Router();

profilesRouter.get("/", auth, getProfile);
profilesRouter.get("/groups", auth, getProfileGroups);
profilesRouter.get("/events", auth, getProfileEvents);

export default profilesRouter;
