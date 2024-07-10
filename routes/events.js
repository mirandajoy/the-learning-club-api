import express from "express";
import auth from "../middleware/auth.js";

import { getEvents, eventRSVP } from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/", auth, getEvents);
eventsRouter.post("/:id/rsvps", auth, eventRSVP);

export default eventsRouter;
