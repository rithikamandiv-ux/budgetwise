import { Request, Response } from "express";
import { pool } from "../db";
import {
    getBudgetSuggestion,
    getOverspendingPrediction
} from "../services/forecastService";

type BudgetRow = {
    id: number;
    category: string;
    budget_limit: number;
    month: number;
    year: number;
};

type ExpenseRow = {
    category: string;
    spent: number;
};

const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
};

const getDaysPassed = (month: number, year: number) => {
    const now = new Date();

    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (month === currentMonth && year === currentYear) {
        return now.getDate();
    }

    return getDaysInMonth(month, year);
};

export const getForecast = async (req: Request, res: Response) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        if (!month || !year) {
            return res.status(400).json({
                error: "Month and year are required"
            });
        }

        if (month < 1 || month > 12) {
            return res.status(400).json({
                error: "Month must be between 1 and 12"
            });
        }

        const totalDaysInMonth = getDaysInMonth(month, year);
        const daysPassed = getDaysPassed(month, year);

        const budgetsResult = await pool.query(
            `
      SELECT id, category, budget_limit, month, year
      FROM budgets
      WHERE month = $1 AND year = $2
      ORDER BY id ASC
      `,
            [month, year]
        );

        const expensesResult = await pool.query(
            `
      SELECT category, SUM(amount)::float AS spent
      FROM expenses
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
      GROUP BY category
      `,
            [month, year]
        );

        const budgets: BudgetRow[] = budgetsResult.rows;
        const expenses: ExpenseRow[] = expensesResult.rows;

        const forecastResults = await Promise.all(
            budgets.map(async (budget) => {
                const matchingExpense = expenses.find(
                    (expense) =>
                        expense.category.toLowerCase() === budget.category.toLowerCase()
                );

                const spentSoFar = matchingExpense ? Number(matchingExpense.spent) : 0;

                const overspendingPrediction = await getOverspendingPrediction({
                    category: budget.category,
                    budget_limit: Number(budget.budget_limit),
                    spent_so_far: spentSoFar,
                    days_passed: daysPassed,
                    total_days_in_month: totalDaysInMonth
                });

                const pastSpendingResult = await pool.query(
                    `
          SELECT COALESCE(SUM(amount), 0)::float AS monthly_spending
          FROM expenses
          WHERE category ILIKE $1
            AND date >= DATE_TRUNC('month', MAKE_DATE($2, $3, 1)) - INTERVAL '3 months'
            AND date < DATE_TRUNC('month', MAKE_DATE($2, $3, 1))
          GROUP BY DATE_TRUNC('month', date)
          ORDER BY DATE_TRUNC('month', date) ASC
          `,
                    [budget.category, year, month]
                );

                const pastMonthlySpending = pastSpendingResult.rows.map((row) =>
                    Number(row.monthly_spending)
                );

                const budgetSuggestion = await getBudgetSuggestion({
                    category: budget.category,
                    current_budget: Number(budget.budget_limit),
                    past_monthly_spending:
                        pastMonthlySpending.length > 0
                            ? pastMonthlySpending
                            : [spentSoFar],
                    safety_margin_percentage: 10
                });

                return {
                    category: budget.category,
                    currentBudget: Number(budget.budget_limit),
                    spentSoFar,
                    overspendingPrediction,
                    budgetSuggestion
                };
            })
        );

        res.json({
            month,
            year,
            daysPassed,
            totalDaysInMonth,
            forecasts: forecastResults
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to generate forecast"
        });
    }
};