import sql from "../db/db.ts";

export interface Invoice {
  appointment_id: number;
  additional_fee: number;
  total_fee: number;
  claim_id: number | null;
  net_amount: number;
  remaining_payment_amount: number;
  time_stamp: string;
  patient_id?: number;
  patient_name?: string;
  doctor_id?: number;
  doctor_name?: string;
  appointment_date?: string;
}

export interface Payment {
  payment_id: number;
  invoice_id: number;
  branch_id: number;
  paid_amount: number;
  time_stamp: string;
  cashier_id: number;
  cashier_name?: string;
  branch_name?: string;
}

// Create invoice for an appointment
export const createInvoice = async (
  appointment_id: number,
  additional_fee: number,
  claim_id: number | null
): Promise<Invoice> => {
  try {
    const [rows] = await sql.query(
      "CALL create_invoice(?, ?, ?)",
      [appointment_id, additional_fee, claim_id]
    );
    return (rows as any)[0][0] as Invoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Record a payment (full or partial)
export const recordPayment = async (
  payment_id: number,
  invoice_id: number,
  branch_id: number,
  paid_amount: number,
  cashier_id: number
): Promise<Payment> => {
  try {
    const [rows] = await sql.query(
      "CALL record_payment(?, ?, ?, ?, ?)",
      [payment_id, invoice_id, branch_id, paid_amount, cashier_id]
    );
    return (rows as any)[0][0] as Payment;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

// Get invoice by appointment ID
export const getInvoiceByAppointment = async (
  appointment_id: number
): Promise<Invoice | null> => {
  try {
    const [rows] = await sql.query(
      "CALL get_invoice_by_appointment(?)",
      [appointment_id]
    );
    const invoices = (rows as any)[0] as Invoice[];
    return invoices.length > 0 ? invoices[0] : null;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

// Get all payments for an invoice
export const getPaymentsByInvoice = async (
  invoice_id: number
): Promise<Payment[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_payments_by_invoice(?)",
      [invoice_id]
    );
    return (rows as any)[0] as Payment[];
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Get patient's outstanding balance
export const getPatientOutstandingBalance = async (
  patient_id: number
): Promise<number> => {
  try {
    const [rows]: any = await sql.query(
      "CALL get_patient_outstanding_balance(?)",
      [patient_id]
    );
    return rows[0][0]?.total_outstanding || 0;
  } catch (error) {
    console.error("Error fetching outstanding balance:", error);
    throw error;
  }
};
