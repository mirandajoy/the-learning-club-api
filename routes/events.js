import express from "express";

import { createEvent, deleteEvent, editEvent, eventRSVP, getEvents, getSingleEvent, updateRSVP } from "../controllers/eventsController.js";
import auth from "../middleware/auth.js";

const eventsRouter = express.Router();

eventsRouter.get("/", auth, getEvents);
eventsRouter.get("/:id", auth, getSingleEvent);
eventsRouter.post("/", auth, createEvent);
eventsRouter.put("/:id", auth, editEvent);
eventsRouter.delete("/:id", auth, deleteEvent);
eventsRouter.post("/:id/rsvps", auth, eventRSVP);
eventsRouter.put("/:id/rsvps/:rsvpId", auth, updateRSVP);

export default eventsRouter;
