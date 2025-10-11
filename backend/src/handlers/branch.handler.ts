import pool from "../db/db.ts";
import type { Request, Response } from 'express';

export const getAllBranches = async (req: Request, res: Response) => {
    try {
        const query = `SELECT branch_id, name, location FROM branch ORDER BY name ASC`;
        const [rows] = await pool.execute(query);
        
        res.status(200).json({
            success: true,
            message: 'Branches fetched successfully',
            data: rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branches',
            data: []
        });
    }
};