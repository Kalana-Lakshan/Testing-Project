import type { Request, Response } from "express";
import { getAllMedications, getMedicationsByPatientId } from "../models/medication.model.ts";

export const getAllMedicationsHandler = async (_req: Request, res: Response) => {
    try {
        const medications = await getAllMedications();
        return res.status(200).json({ medications });
    }   catch (error) {
        console.error("Error in getAllMedicationsHandler:", error);
        return res.status(500).json({ message: "Failed to fetch medications" });
    }
};



export const getMedicationsByPatientHandler = async (req: Request, res: Response) => {
  try {
    // /patients/:patientId/medications 
    const raw = (req.params.patientId ?? req.query.patientId) as string | undefined;
    const patientId = Number(raw);

    if (!raw || !Number.isInteger(patientId)) {
      return res.status(400).json({ message: "patientId must be an integer" });
    }

    const medications = await getMedicationsByPatientId(patientId);
    return res.status(200).json({ medications });
  } catch (error) {
    console.error("Error in getMedicationsByPatientHandler:", error);
    return res.status(500).json({ message: "Failed to fetch medications for the given patient" });
  }
};