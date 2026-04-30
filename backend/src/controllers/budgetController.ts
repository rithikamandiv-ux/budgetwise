import { Request, Response } from "express";
import { pool } from "../db";

export const getBudgets = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT id, category, budget_limit AS limit, month, year FROM budgets ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch budgets" });
    }
};

export const createBudget = async (req: Request, res: Response) => {
    const { category, limit, month, year } = req.body;

    if (!category || limit === undefined || !month || !year) {
        return res.status(400).json({
            error: "Category, limit, month, and year are required"
        });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            error: "Category must be a non-empty string"
        });
    }

    if (typeof limit !== "number" || isNaN(limit)) {
        return res.status(400).json({
            error: "Limit must be a valid number"
        });
    }

    if (limit <= 0) {
        return res.status(400).json({
            error: "Limit must be greater than 0"
        });
    }

    if (typeof month !== "number" || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({
            error: "Month must be a valid number between 1 and 12"
        });
    }

    if (typeof year !== "number" || isNaN(year) || year <= 0) {
        return res.status(400).json({
            error: "Year must be a valid positive number"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO budgets (category, budget_limit, month, year) VALUES ($1, $2, $3, $4) RETURNING id, category, budget_limit AS limit, month, year",
            [category.trim(), limit, month, year]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create budget" });
    }
};

export const updateBudget = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { category, limit, month, year } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Budget id must be a valid number"
        });
    }

    if (!category || limit === undefined || !month || !year) {
        return res.status(400).json({
            error: "Category, limit, month, and year are required"
        });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            error: "Category must be a non-empty string"
        });
    }

    if (typeof limit !== "number" || isNaN(limit)) {
        return res.status(400).json({
            error: "Limit must be a valid number"
        });
    }

    if (limit <= 0) {
        return res.status(400).json({
            error: "Limit must be greater than 0"
        });
    }

    if (typeof month !== "number" || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({
            error: "Month must be a valid number between 1 and 12"
        });
    }

    if (typeof year !== "number" || isNaN(year) || year <= 0) {
        return res.status(400).json({
            error: "Year must be a valid positive number"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE budgets SET category = $1, budget_limit = $2, month = $3, year = $4 WHERE id = $5 RETURNING id, category, budget_limit AS limit, month, year",
            [category.trim(), limit, month, year, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Budget not found"
            });
        }

        res.json({
            message: "Budget updated successfully",
            updatedBudget: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update budget" });
    }
};

export const deleteBudget = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Budget id must be a valid number"
        });
    }

    try {
        const result = await pool.query(
            "DELETE FROM budgets WHERE id = $1 RETURNING id, category, budget_limit AS limit, month, year",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Budget not found"
            });
        }

        res.json({
            message: "Budget deleted successfully",
            deletedBudget: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete budget" });
    }
};