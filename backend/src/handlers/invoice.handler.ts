import type { Request, Response } from "express";
import {
  createInvoice,
  recordPayment,
  getInvoiceByAppointment,
  getPaymentsByInvoice,
  getPatientOutstandingBalance,
} from "../models/invoice.model.ts";

// Create invoice for completed appointment
export const createInvoiceHandler = async (req: Request, res: Response) => {
  const { appointment_id, additional_fee, claim_id } = req.body;
  
  try {
    if (!appointment_id) {
      return res.status(400).json({ error: "appointment_id is required" });
    }

    const invoice = await createInvoice(
      Number(appointment_id),
      Number(additional_fee) || 0,
      claim_id ? Number(claim_id) : null
    );

    res.status(201).json({ invoice });
  } catch (error) {
    console.error("Error in createInvoiceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Record payment (full or partial)
export const recordPaymentHandler = async (req: Request, res: Response) => {
  const { payment_id, invoice_id, branch_id, paid_amount, cashier_id } = req.body;

  try {
    if (!payment_id || !invoice_id || !branch_id || !paid_amount || !cashier_id) {
      return res.status(400).json({ 
        error: "payment_id, invoice_id, branch_id, paid_amount, and cashier_id are required" 
      });
    }

    const payment = await recordPayment(
      Number(payment_id),
      Number(invoice_id),
      Number(branch_id),
      Number(paid_amount),
      Number(cashier_id)
    );

    res.status(201).json({ payment });
  } catch (error) {
    console.error("Error in recordPaymentHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get invoice by appointment ID
export const getInvoiceHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    const invoice = await getInvoiceByAppointment(Number(appointment_id));
    
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    console.error("Error in getInvoiceHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get payments for an invoice
export const getPaymentsHandler = async (req: Request, res: Response) => {
  const { invoice_id } = req.params;

  try {
    const payments = await getPaymentsByInvoice(Number(invoice_id));
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error in getPaymentsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get patient's outstanding balance
export const getPatientOutstandingHandler = async (req: Request, res: Response) => {
  const { patient_id } = req.params;

  try {
    const outstanding = await getPatientOutstandingBalance(Number(patient_id));
    res.status(200).json({ outstanding });
  } catch (error) {
    console.error("Error in getPatientOutstandingHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
