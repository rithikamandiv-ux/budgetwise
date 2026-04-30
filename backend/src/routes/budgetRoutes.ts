import { Router } from "express";
import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget
} from "../controllers/budgetController";

const router = Router();

router.get("/", getBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;