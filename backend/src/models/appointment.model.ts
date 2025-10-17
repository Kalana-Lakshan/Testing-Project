import sql from "../db/db.ts";

export interface appointment{
    appointment_id:number;
    patient_id:number;
    doctor_id:number;
    date:string;
    time_slot:string;
    name?:string; // doctor's name
}

export const getAppointmentsbyPatientId = async (patientId: number): Promise<appointment[]> => {
    try {
        const [rows] = await sql.query("CALL get_appointments_by_patient_id(?)", [patientId]);
        return (rows as any)[0] as appointment[];
    } catch (error) {
        console.error("Error fetching appointments by patient id:", error);
        throw error;
    }
};

export const getMonthlyAppointmentCounts = async (startDate: string, endDate: string, status: string): Promise<{ month: string; count: number }[]> => {
    try {
        const [rows] = await sql.query("CALL get_monthly_appointment_counts(?, ?, ?)", ['2025-01-01', '2025-12-31', null]);
        return (rows as any)[0] as { month: string; count: number }[];
    } catch (error) {
        console.error("Error fetching monthly appointment counts:", error);
        throw error;
    }
};
