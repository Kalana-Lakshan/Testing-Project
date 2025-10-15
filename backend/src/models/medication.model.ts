import sql from "../db/db.ts";

export interface medication{
    appointment_id: number;
    patient_id: number;
    name: string;
    consultation_note: string;
    prescription_items_details: string;
    prescribed_at: string;
    is_active: boolean;
} 

export const getAllMedications = async (): Promise<medication[]> => {
    try {
        const [rows] = await sql.query("CALL get_all_medications()");
        return (rows as any)[0] as medication[];
    } catch (error) {
        console.error("Error fetching medications:", error);
        throw error;
    }
};

export const getMedicationsByPatientId = async (patientId: number): Promise<medication[]> => {
  try {
    const [rows] = await sql.query("CALL get_medications_by_patient_id(?)", [patientId]);
    return (rows as any)[0] as medication[];
  } catch (error) {
    console.error("Error fetching medications by patient id:", error);
    throw error;
  }
};
