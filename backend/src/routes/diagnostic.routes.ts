import { Router } from "express";
import { runDiagnosticController } from "../controllers/diagnostic.controller";

const router = Router();
router.post("/diagnose", runDiagnosticController);
export default router;
