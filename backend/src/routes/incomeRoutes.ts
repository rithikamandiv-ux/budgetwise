import { Router } from "express";
import {
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome
} from "../controllers/incomeController";

const router = Router();

router.get("/", getIncome);
router.post("/", createIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;