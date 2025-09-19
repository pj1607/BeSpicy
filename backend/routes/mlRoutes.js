import express from 'express';
import { getRecommendations } from "../controllers/mlController.js";

const router = express.Router();

// GET /api/recommend?ingredients=tomato,onion&top_n=50&max_time=30
router.get("/recommend", getRecommendations);

export default router;
