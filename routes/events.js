import express from "express";
import auth from "../middleware/auth.js";

import { getEvents, getSingleEvent, eventRSVP, updateRSVP } from "../controllers/eventsController.js";

const eventsRouter = express.Router();

eventsRouter.get("/", auth, getEvents);
eventsRouter.get("/:id", auth, getSingleEvent);
eventsRouter.post("/:id/rsvps", auth, eventRSVP);
eventsRouter.put("/:id/rsvps/:rsvpId", auth, updateRSVP);

export default eventsRouter;
