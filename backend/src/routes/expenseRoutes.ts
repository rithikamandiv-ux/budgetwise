import { Router } from "express";
import {
    getExpenses,
    createExpense,
    deleteExpense,
    updateExpense
} from "../controllers/expenseController";

const router = Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

export default router;