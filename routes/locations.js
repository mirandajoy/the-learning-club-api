import express from "express";

import { getCountries, getRegions } from "../controllers/locationsControllers.js";

const locationsRouter = express.Router();

locationsRouter.get("/countries", getCountries);
locationsRouter.get("/regions", getRegions);

export default locationsRouter;