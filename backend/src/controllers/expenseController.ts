import { Request, Response } from "express";
import { pool } from "../db";

export const getExpenses = async (req: Request, res: Response) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    try {
        let result;

        if (month && year) {
            result = await pool.query(
                `
        SELECT id, category, amount, date
        FROM expenses
        WHERE EXTRACT(MONTH FROM date) = $1
          AND EXTRACT(YEAR FROM date) = $2
        ORDER BY id ASC
        `,
                [month, year]
            );
        } else {
            result = await pool.query(
                "SELECT id, category, amount, date FROM expenses ORDER BY id ASC"
            );
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};

export const createExpense = async (req: Request, res: Response) => {
    const { category, amount, date } = req.body;

    if (!category || amount === undefined || !date) {
        return res.status(400).json({
            error: "Category, amount, and date are required"
        });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            error: "Category must be a non-empty string"
        });
    }

    if (typeof amount !== "number" || isNaN(amount)) {
        return res.status(400).json({
            error: "Amount must be a valid number"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            error: "Amount must be greater than 0"
        });
    }

    if (typeof date !== "string" || date.trim() === "") {
        return res.status(400).json({
            error: "Date must be a valid string"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO expenses (category, amount, date) VALUES ($1, $2, $3) RETURNING id, category, amount, date",
            [category.trim(), amount, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create expense" });
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { category, amount, date } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Expense id must be a valid number"
        });
    }

    if (!category || amount === undefined || !date) {
        return res.status(400).json({
            error: "Category, amount, and date are required"
        });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            error: "Category must be a non-empty string"
        });
    }

    if (typeof amount !== "number" || isNaN(amount)) {
        return res.status(400).json({
            error: "Amount must be a valid number"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            error: "Amount must be greater than 0"
        });
    }

    if (typeof date !== "string" || date.trim() === "") {
        return res.status(400).json({
            error: "Date must be a valid string"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE expenses SET category = $1, amount = $2, date = $3 WHERE id = $4 RETURNING id, category, amount, date",
            [category.trim(), amount, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.json({
            message: "Expense updated successfully",
            updatedExpense: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update expense" });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Expense id must be a valid number"
        });
    }

    try {
        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 RETURNING id, category, amount, date",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully",
            deletedExpense: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
};