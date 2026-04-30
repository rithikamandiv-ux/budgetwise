import { Request, Response } from "express";
import { pool } from "../db";

export const getIncome = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT id, source, amount, date FROM income ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch income" });
    }
};

export const createIncome = async (req: Request, res: Response) => {
    const { source, amount, date } = req.body;

    if (!source || amount === undefined || !date) {
        return res.status(400).json({
            error: "Source, amount, and date are required"
        });
    }

    if (typeof source !== "string" || source.trim() === "") {
        return res.status(400).json({
            error: "Source must be a non-empty string"
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
            "INSERT INTO income (source, amount, date) VALUES ($1, $2, $3) RETURNING id, source, amount, date",
            [source.trim(), amount, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create income" });
    }
};

export const updateIncome = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { source, amount, date } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Income id must be a valid number"
        });
    }

    if (!source || amount === undefined || !date) {
        return res.status(400).json({
            error: "Source, amount, and date are required"
        });
    }

    if (typeof source !== "string" || source.trim() === "") {
        return res.status(400).json({
            error: "Source must be a non-empty string"
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
            "UPDATE income SET source = $1, amount = $2, date = $3 WHERE id = $4 RETURNING id, source, amount, date",
            [source.trim(), amount, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Income not found"
            });
        }

        res.json({
            message: "Income updated successfully",
            updatedIncome: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update income" });
    }
};

export const deleteIncome = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Income id must be a valid number"
        });
    }

    try {
        const result = await pool.query(
            "DELETE FROM income WHERE id = $1 RETURNING id, source, amount, date",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Income not found"
            });
        }

        res.json({
            message: "Income deleted successfully",
            deletedIncome: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete income" });
    }
};