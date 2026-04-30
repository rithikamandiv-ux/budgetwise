import { Request, Response } from "express";
import { pool } from "../db";

type ExpenseRow = {
    id: number;
    category: string;
    amount: number;
    date: string;
};

type IncomeRow = {
    id: number;
    source: string;
    amount: number;
    date: string;
};

type BudgetRow = {
    id: number;
    category: string;
    budget_limit: number;
    month: number;
    year: number;
};

export const getSummary = async (req: Request, res: Response) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        if (!month || !year) {
            return res.status(400).json({
                error: "Month and year are required"
            });
        }

        const expensesResult = await pool.query(
            `
      SELECT id, category, amount, date
      FROM expenses
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
      ORDER BY id ASC
      `,
            [month, year]
        );

        const incomeResult = await pool.query(
            `
      SELECT id, source, amount, date
      FROM income
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
      ORDER BY id ASC
      `,
            [month, year]
        );

        const budgetsResult = await pool.query(
            `
      SELECT id, category, budget_limit, month, year
      FROM budgets
      WHERE month = $1 AND year = $2
      ORDER BY id ASC
      `,
            [month, year]
        );

        const expenses: ExpenseRow[] = expensesResult.rows;
        const incomeList: IncomeRow[] = incomeResult.rows;
        const budgets: BudgetRow[] = budgetsResult.rows;

        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
        const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
        const totalBudgets = budgets.reduce(
            (sum, item) => sum + item.budget_limit,
            0
        );
        const remainingBalance = totalIncome - totalExpenses;

        const categorySummary = budgets.map((budgetItem) => {
            const spent = expenses
                .filter(
                    (expense) =>
                        expense.category.toLowerCase() ===
                        budgetItem.category.toLowerCase()
                )
                .reduce((sum, expense) => sum + expense.amount, 0);

            const remaining = budgetItem.budget_limit - spent;
            const isOverBudget = spent > budgetItem.budget_limit;

            const progressPercentage =
                budgetItem.budget_limit > 0
                    ? Math.round((spent / budgetItem.budget_limit) * 100)
                    : 0;

            return {
                category: budgetItem.category,
                budget: budgetItem.budget_limit,
                spent,
                remaining,
                isOverBudget,
                progressPercentage
            };
        });

        res.json({
            month,
            year,
            totalExpenses,
            totalIncome,
            totalBudgets,
            remainingBalance,
            categorySummary
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch summary" });
    }
};