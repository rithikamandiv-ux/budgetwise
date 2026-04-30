import { Router } from "express";
import { getSummary } from "../controllers/summaryController";

const router = Router();

router.get("/", getSummary);

export default router;