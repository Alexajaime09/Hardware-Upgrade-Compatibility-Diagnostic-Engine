import { Router } from "express";
import { getSystems } from "../controllers/systemController";

const router = Router();

router.get("/", getSystems);

export default router;
