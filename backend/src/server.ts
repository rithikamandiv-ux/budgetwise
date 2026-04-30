import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import summaryRoutes from "./routes/summaryRoutes";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "BudgetWise backend is running" });
});

app.use("/expenses", expenseRoutes);
app.use("/income", incomeRoutes);
app.use("/budgets", budgetRoutes);
app.use("/summary", summaryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});