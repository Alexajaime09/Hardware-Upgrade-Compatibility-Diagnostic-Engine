import { Router } from "express";
import { getSystems } from "../controllers/systemController";
import { runDiagnosticController } from "../controllers/diagnostic.controller";

const router = Router();

router.get("/", getSystems);

export default router;
