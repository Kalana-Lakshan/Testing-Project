import sql from "../db/db.ts";

export interface Insurance {
  insurance_id: number;
  insurance_type: string;
  insurance_period: string;
  claim_percentage: number;
  created_at: string;
}

export interface PatientInsurance {
  insurance_id: number;
  insurance_type: string;
  insurance_period: string;
  claim_percentage: number;
  policy_start_date: string;
  is_expired: boolean;
}

export interface InsuranceClaim {
  claim_id: number;
  service_code: number;
  patient_id: number;
  approved_by: number;
  claimed_amount: number;
  claimed_at: string;
  insurance_id: number;
  treatment_name?: string;
  insurance_type?: string;
  approved_by_name?: string;
}

// Create new insurance policy
export const createInsurance = async (
  insurance_id: number,
  insurance_type: string,
  insurance_period: string,
  claim_percentage: number
): Promise<Insurance> => {
  try {
    const [rows] = await sql.query(
      "CALL create_insurance(?, ?, ?, ?)",
      [insurance_id, insurance_type, insurance_period, claim_percentage]
    );
    return (rows as any)[0][0] as Insurance;
  } catch (error) {
    console.error("Error creating insurance:", error);
    throw error;
  }
};

// Link patient to insurance policy
export const linkPatientInsurance = async (
  patient_id: number,
  insurance_id: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL link_patient_insurance(?, ?)",
      [patient_id, insurance_id]
    );
  } catch (error) {
    console.error("Error linking patient insurance:", error);
    throw error;
  }
};

// Get patient's insurance policies
export const getPatientInsurance = async (
  patient_id: number
): Promise<PatientInsurance[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_patient_insurance(?)",
      [patient_id]
    );
    return (rows as any)[0] as PatientInsurance[];
  } catch (error) {
    console.error("Error fetching patient insurance:", error);
    throw error;
  }
};

// Create insurance claim
export const createInsuranceClaim = async (
  claim_id: number,
  service_code: number,
  patient_id: number,
  approved_by: number,
  insurance_id: number
): Promise<InsuranceClaim> => {
  try {
    const [rows] = await sql.query(
      "CALL create_insurance_claim(?, ?, ?, ?, ?)",
      [claim_id, service_code, patient_id, approved_by, insurance_id]
    );
    return (rows as any)[0][0] as InsuranceClaim;
  } catch (error) {
    console.error("Error creating insurance claim:", error);
    throw error;
  }
};

// Get patient's insurance claims
export const getPatientInsuranceClaims = async (
  patient_id: number
): Promise<InsuranceClaim[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_patient_insurance_claims(?)",
      [patient_id]
    );
    return (rows as any)[0] as InsuranceClaim[];
  } catch (error) {
    console.error("Error fetching insurance claims:", error);
    throw error;
  }
};

// Get all insurance policies
export const getAllInsurance = async (): Promise<Insurance[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_insurance()");
    return (rows as any)[0] as Insurance[];
  } catch (error) {
    console.error("Error fetching all insurance:", error);
    throw error;
  }
};
