import express from "express";

import {getProfile} from "../controllers/profileControllers.js";

const profilesRouter = express.Router();

profilesRouter.get("/", getProfile);

export default profilesRouter;