import express from "express";
import { nearbyRestaurants } from "../controllers/resController.js";

const router = express.Router();

router.post("/nearby", nearbyRestaurants);

export default router;
