import sql from "../db/db.ts";

// Report 1: Branch-wise appointment summary
export interface BranchAppointmentSummary {
  branch_name: string;
  date: string;
  status: string;
  appointment_count: number;
}

export const getBranchAppointmentsSummary = async (
  date: string,
  branch_id: number
): Promise<BranchAppointmentSummary[]> => {
  try {
    const [rows] = await sql.query(
      "CALL report_branch_appointments_daily(?, ?)",
      [date, branch_id]
    );
    return (rows as any)[0] as BranchAppointmentSummary[];
  } catch (error) {
    console.error("Error fetching branch appointments summary:", error);
    throw error;
  }
};

// Report 2: Doctor-wise revenue
export interface DoctorRevenue {
  doctor_id: number;
  doctor_name: string;
  total_appointments: number;
  total_revenue: number;
  total_collected: number;
  total_outstanding: number;
}

export const getDoctorRevenueReport = async (
  start_date: string,
  end_date: string,
  doctor_id: number
): Promise<DoctorRevenue[]> => {
  try {
    const [rows] = await sql.query(
      "CALL report_doctor_revenue(?, ?, ?)",
      [start_date, end_date, doctor_id]
    );
    return (rows as any)[0] as DoctorRevenue[];
  } catch (error) {
    console.error("Error fetching doctor revenue report:", error);
    throw error;
  }
};

// Report 3: Patients with outstanding balances
export interface PatientOutstanding {
  patient_id: number;
  patient_name: string;
  emergency_contact_no: string;
  branch_name: string;
  total_outstanding: number;
  unpaid_invoices: number;
}

export const getPatientsWithOutstandingBalances = async (): Promise<PatientOutstanding[]> => {
  try {
    const [rows] = await sql.query("CALL report_patients_outstanding_balances()");
    return (rows as any)[0] as PatientOutstanding[];
  } catch (error) {
    console.error("Error fetching patients with outstanding balances:", error);
    throw error;
  }
};

// Report 4: Treatments by category
export interface TreatmentByCategory {
  category: string;
  treatment_name: string;
  treatment_count: number;
  total_revenue: number;
}

export const getTreatmentsByCategory = async (
  start_date: string,
  end_date: string
): Promise<TreatmentByCategory[]> => {
  try {
    const [rows] = await sql.query(
      "CALL report_treatments_by_category(?, ?)",
      [start_date, end_date]
    );
    return (rows as any)[0] as TreatmentByCategory[];
  } catch (error) {
    console.error("Error fetching treatments by category:", error);
    throw error;
  }
};

// Report 5: Insurance coverage vs out-of-pocket
export interface InsuranceVsOutOfPocket {
  month: string;
  total_appointments: number;
  total_fees: number;
  insurance_covered: number;
  out_of_pocket_payments: number;
  insurance_coverage_percentage: number;
}

export const getInsuranceVsOutOfPocket = async (
  start_date: string,
  end_date: string
): Promise<InsuranceVsOutOfPocket[]> => {
  try {
    const [rows] = await sql.query(
      "CALL report_insurance_vs_outofpocket(?, ?)",
      [start_date, end_date]
    );
    return (rows as any)[0] as InsuranceVsOutOfPocket[];
  } catch (error) {
    console.error("Error fetching insurance vs out-of-pocket report:", error);
    throw error;
  }
};
