import axiosInstance from "../axiosConfig";

export interface medicalHistory {
    medical_history_id: number;
    appointment_id: number;
    visit_date: string;
    diagnosis: string;
    symptoms: string;
    allergies: string;
    notes: string;
    follow_up_date: string;
    created_at: string;
    updated_at: string;
}

export const getallmedicalhistories = async () => {
    try {
        const resp = await axiosInstance.get<{ histories: Array<medicalHistory> }>("/medical-histories");
        return resp.data.histories;
    } catch (error) {
        console.error("Error fetching medical histories:", error);
        throw error;
    }
};

