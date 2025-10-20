import type { Request, Response } from "express";
import {
  getBranchAppointmentsSummary,
  getDoctorRevenueReport,
  getPatientsWithOutstandingBalances,
  getTreatmentsByCategory,
  getInsuranceVsOutOfPocket,
} from "../models/reports.model.ts";

// Report 1: Branch-wise appointment summary per day
export const getBranchAppointmentsSummaryHandler = async (req: Request, res: Response) => {
  const { date, branch_id } = req.query;

  try {
    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    const summary = await getBranchAppointmentsSummary(
      String(date),
      branch_id ? Number(branch_id) : -1
    );

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in getBranchAppointmentsSummaryHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Report 2: Doctor-wise revenue report
export const getDoctorRevenueReportHandler = async (req: Request, res: Response) => {
  const { start_date, end_date, doctor_id } = req.query;

  try {
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const report = await getDoctorRevenueReport(
      String(start_date),
      String(end_date),
      doctor_id ? Number(doctor_id) : -1
    );

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error in getDoctorRevenueReportHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Report 3: List of patients with outstanding balances
export const getPatientsWithOutstandingBalancesHandler = async (_req: Request, res: Response) => {
  try {
    const patients = await getPatientsWithOutstandingBalances();
    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error in getPatientsWithOutstandingBalancesHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Report 4: Number of treatments per category over a given period
export const getTreatmentsByCategoryHandler = async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  try {
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const treatments = await getTreatmentsByCategory(String(start_date), String(end_date));
    res.status(200).json({ treatments });
  } catch (error) {
    console.error("Error in getTreatmentsByCategoryHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Report 5: Insurance coverage vs. out-of-pocket payments
export const getInsuranceVsOutOfPocketHandler = async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  try {
    if (!start_date || !end_date) {
      return res.status(400).json({ error: "start_date and end_date are required" });
    }

    const report = await getInsuranceVsOutOfPocket(String(start_date), String(end_date));
    res.status(200).json({ report });
  } catch (error) {
    console.error("Error in getInsuranceVsOutOfPocketHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
