import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";


export interface appointment{
    appointment_id:number;
    patient_id:number;
    doctor_id:number;
    patient_note:string;
    date:string;
    time_slot:string;
    status:string;
    name?:string; // doctor's name
}

export interface DoctorAppointment {
  appointment_id: number;
  doctor_id: number;
  name: string;           // doctor name
  date: string;
  time_slot: string;
  status: string;
}

export const getAppointmentsByPatientId = async (patientId: number): Promise<appointment[]> => {
  const resp = await axiosInstance.get(`/patient/appointments/${patientId}`);
  const data = resp.data;
  // Normalize: accept either an array or { appointments: [...] }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.appointments)) return data.appointments;
  return [];
};



export const getDoctorsAppointments = async (
  count: number,
  offset: number
) => {
  try {
    const response = await axiosInstance.get<{
      appointments_count: number;
      appointments: DoctorAppointment[];
    }>(`/doctors/appointments?count=${count}&offset=${offset}`);

    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all appointments data:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }

    throw "Unknown error occurred";
  }
};