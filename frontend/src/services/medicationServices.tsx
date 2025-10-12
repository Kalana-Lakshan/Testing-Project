
import axiosInstance from "../axiosConfig";

export interface medication{
    appointment_id: number;
    patient_id: number;
    name: string;
    consultation_note: string;
    prescription_items_details: string;
    prescribed_at: string;
    is_active: boolean;
} 

export const getAllMedications = async () => {
    try {
        const resp = await axiosInstance.get<{ medications: Array<medication> }>("/medications");
        return resp.data.medications;
    } catch (error) {
        console.error("Error fetching medications:", error);
        throw error;
    }
};  


export const getMedicationsByPatientId = async (patientId: number) => {
  try {
    
    const resp = await axiosInstance.get<{ medications: Array<medication> }>(`/medications/${patientId}`);

    return resp.data.medications;
  } catch (error) {
    console.error(`Error fetching medications for patient ${patientId}:`, error);
    throw error;
  }
};