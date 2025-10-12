import type { Request, Response } from "express";
import { checkServiceCodeExists, createTreatment, getAllTreatments, type CreateTreatmentInput } from "../models/treatment.model.ts";


export const getAllTreatmentsHandler = async (_req: Request, res: Response) => {
  try {
    const treatments = await getAllTreatments();
    return res.status(200).json({ treatments });
  } catch (error) {
    console.error("Error in getAllTreatmentsHandler:", error);
    return res.status(500).json({ message: "Failed to fetch treatments" });
  }
};

export const checkServiceCodeHandler = async (req: Request, res: Response) => {
  try {
    
    const raw = req.query.code;
    const code = Number(raw);

    if (raw === undefined || !Number.isInteger(code)) {
      return res.status(400).json({ error: "code is required and must be an integer" });
    }

    const exists = await checkServiceCodeExists(code);
    return res.json({ exists });
  } catch (err: any) {
   
    console.error("checkServiceCodeHandler error:", {
      message: err?.message,
      code: err?.code,
      stack: err?.stack,
    });
    return res.status(500).json({ message: "Failed to check service code" });
  }
};
export const createTreatmentHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreateTreatmentInput>;
    const service_code = Number(body.service_code);
    const fee = Number(body.fee);
    const speciality_id = Number(body.speciality_id);

    if (!Number.isInteger(service_code)) return res.status(400).json({ error: "service_code required (int)" });
    if (typeof body.name !== "string" || !body.name.trim()) return res.status(400).json({ error: "name required" });
    if (!Number.isFinite(fee) || fee < 0) return res.status(400).json({ error: "fee must be a non-negative number" });
    if (!Number.isInteger(speciality_id)) return res.status(400).json({ error: "speciality_id must be an integer" });

    // pre-check (fast UX); DB PK is the real guard
    if (await checkServiceCodeExists(service_code)) {
      return res.status(409).json({ error: "SERVICE_CODE_EXISTS", message: "Service code already exists" });
    }

    const created = await createTreatment({
      service_code,
      name: body.name.trim(),
      fee,
      description: (body.description ?? null) as string | null,
      speciality_id,
    });

    return res.status(201).json({ treatment: created });
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "SERVICE_CODE_EXISTS", message: "Service code already exists" });
    }
    console.error("Error in createTreatmentHandler:", e);
    return res.status(500).json({ message: "Failed to create treatment" });
  }
};
