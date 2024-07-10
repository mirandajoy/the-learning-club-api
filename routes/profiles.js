import express from "express";
import auth from "../middleware/auth.js";

import { getProfile, getProfileEvents } from "../controllers/profileControllers.js";

const profilesRouter = express.Router();

profilesRouter.get("/", auth, getProfile);
profilesRouter.get("/events", auth, getProfileEvents);

export default profilesRouter;
