import type { Request, Response } from "express";
import { getAllMedicalHistories } from "../models/medicalhistory.model.ts";



export const getMedicalHistoryHandler = async (req: Request, res: Response) => {
    try {
        const histories = await getAllMedicalHistories();
        return res.status(200).json({ histories });
    } catch (error) {
        console.error("Error in getMedicalHistoryHandler:", error);
        return res.status(500).json({ message: "Failed to fetch medical histories" });
    }
};