import type { Request, Response } from "express";
import {
  createInsurance,
  linkPatientInsurance,
  getPatientInsurance,
  createInsuranceClaim,
  getPatientInsuranceClaims,
  getAllInsurance,
} from "../models/insurance.model.ts";

// Create new insurance policy
export const createInsuranceHandler = async (req: Request, res: Response) => {
  const { insurance_id, insurance_type, insurance_period, claim_percentage } = req.body;

  try {
    if (!insurance_id || !insurance_type || !insurance_period || claim_percentage === undefined) {
      return res.status(400).json({ 
        error: "insurance_id, insurance_type, insurance_period, and claim_percentage are required" 
      });
    }

    const insurance = await createInsurance(
      Number(insurance_id),
      insurance_type,
      insurance_period,
      Number(claim_percentage)
    );

    res.status(201).json({ insurance });
  } catch (error) {
    console.error("Error in createInsuranceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Link patient to insurance
export const linkPatientInsuranceHandler = async (req: Request, res: Response) => {
  const { patient_id, insurance_id } = req.body;

  try {
    if (!patient_id || !insurance_id) {
      return res.status(400).json({ error: "patient_id and insurance_id are required" });
    }

    await linkPatientInsurance(Number(patient_id), Number(insurance_id));
    res.status(201).json({ message: "Patient linked to insurance successfully" });
  } catch (error) {
    console.error("Error in linkPatientInsuranceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get patient's insurance policies
export const getPatientInsuranceHandler = async (req: Request, res: Response) => {
  const { patient_id } = req.params;

  try {
    const policies = await getPatientInsurance(Number(patient_id));
    res.status(200).json({ policies });
  } catch (error) {
    console.error("Error in getPatientInsuranceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create insurance claim
export const createInsuranceClaimHandler = async (req: Request, res: Response) => {
  const { claim_id, service_code, patient_id, approved_by, insurance_id } = req.body;

  try {
    if (!claim_id || !service_code || !patient_id || !approved_by || !insurance_id) {
      return res.status(400).json({ 
        error: "claim_id, service_code, patient_id, approved_by, and insurance_id are required" 
      });
    }

    const claim = await createInsuranceClaim(
      Number(claim_id),
      Number(service_code),
      Number(patient_id),
      Number(approved_by),
      Number(insurance_id)
    );

    res.status(201).json({ claim });
  } catch (error) {
    console.error("Error in createInsuranceClaimHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get patient's insurance claims
export const getPatientInsuranceClaimsHandler = async (req: Request, res: Response) => {
  const { patient_id } = req.params;

  try {
    const claims = await getPatientInsuranceClaims(Number(patient_id));
    res.status(200).json({ claims });
  } catch (error) {
    console.error("Error in getPatientInsuranceClaimsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all insurance policies
export const getAllInsuranceHandler = async (_req: Request, res: Response) => {
  try {
    const insurance = await getAllInsurance();
    res.status(200).json({ insurance });
  } catch (error) {
    console.error("Error in getAllInsuranceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
