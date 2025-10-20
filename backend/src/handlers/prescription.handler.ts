import type { Request, Response } from "express";
import {
  createPrescription,
  getPrescriptionByAppointment,
  recordTreatment,
  getTreatmentsByAppointment,
} from "../models/prescription.model.ts";

// Create or update prescription
export const createPrescriptionHandler = async (req: Request, res: Response) => {
  const { appointment_id, consultation_note, prescription_items } = req.body;

  try {
    if (!appointment_id || !consultation_note) {
      return res.status(400).json({ 
        error: "appointment_id and consultation_note are required" 
      });
    }

    const prescription = await createPrescription(
      Number(appointment_id),
      consultation_note,
      prescription_items || ""
    );

    res.status(201).json({ prescription });
  } catch (error) {
    console.error("Error in createPrescriptionHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get prescription by appointment
export const getPrescriptionHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    const prescription = await getPrescriptionByAppointment(Number(appointment_id));
    
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json({ prescription });
  } catch (error) {
    console.error("Error in getPrescriptionHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Record treatment for appointment
export const recordTreatmentHandler = async (req: Request, res: Response) => {
  const { appointment_id, service_code } = req.body;

  try {
    if (!appointment_id || !service_code) {
      return res.status(400).json({ error: "appointment_id and service_code are required" });
    }

    await recordTreatment(Number(appointment_id), Number(service_code));
    res.status(201).json({ message: "Treatment recorded successfully" });
  } catch (error) {
    console.error("Error in recordTreatmentHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get treatments for appointment
export const getTreatmentsHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    const treatments = await getTreatmentsByAppointment(Number(appointment_id));
    res.status(200).json({ treatments });
  } catch (error) {
    console.error("Error in getTreatmentsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
