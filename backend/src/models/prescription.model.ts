import sql from "../db/db.ts";

export interface Prescription {
  appointment_id: number;
  consultation_note: string;
  prescription_items_details: string;
  prescribed_at: string;
  is_active: boolean;
}

export interface TreatmentRecord {
  service_code: number;
  name: string;
  fee: number;
  description: string;
}

// Create or update prescription
export const createPrescription = async (
  appointment_id: number,
  consultation_note: string,
  prescription_items: string
): Promise<Prescription> => {
  try {
    const [rows] = await sql.query(
      "CALL create_prescription(?, ?, ?)",
      [appointment_id, consultation_note, prescription_items]
    );
    return (rows as any)[0][0] as Prescription;
  } catch (error) {
    console.error("Error creating prescription:", error);
    throw error;
  }
};

// Get prescription by appointment
export const getPrescriptionByAppointment = async (
  appointment_id: number
): Promise<Prescription | null> => {
  try {
    const [rows] = await sql.query(
      "CALL get_prescription_by_appointment(?)",
      [appointment_id]
    );
    const prescriptions = (rows as any)[0] as Prescription[];
    return prescriptions && prescriptions.length > 0 ? prescriptions[0] : null;
  } catch (error) {
    console.error("Error fetching prescription:", error);
    throw error;
  }
};

// Record treatment for appointment
export const recordTreatment = async (
  appointment_id: number,
  service_code: number
): Promise<void> => {
  try {
    await sql.query(
      "CALL record_treatment(?, ?)",
      [appointment_id, service_code]
    );
  } catch (error) {
    console.error("Error recording treatment:", error);
    throw error;
  }
};

// Get treatments for appointment
export const getTreatmentsByAppointment = async (
  appointment_id: number
): Promise<TreatmentRecord[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_treatments_by_appointment(?)",
      [appointment_id]
    );
    return (rows as any)[0] as TreatmentRecord[];
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw error;
  }
};
