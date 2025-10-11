import pool from "../db/db.ts";
import type { Request, Response } from 'express';

export const getAllSpecialties = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT speciality_id, speciality_name, description
            FROM speciality
            ORDER BY speciality_name ASC;
        `;
        const [rows] = await pool.execute(query);
        
        res.status(200).json({
            success: true,
            message: 'Specialties fetched successfully',
            data: rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch specialties',
            data: []
        });
    }
};