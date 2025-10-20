import sql from "../db/db.ts";

export interface AppointmentDetailed {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_note: string;
  date: string;
  time_slot: string;
  status: string;
  time_stamp: string;
  patient_name?: string;
  doctor_name?: string;
  branch_name?: string;
}

export interface TimeSlot {
  time_slot: string;
}

// Create new appointment
export const createAppointment = async (
  appointment_id: number,
  patient_id: number,
  doctor_id: number,
  patient_note: string,
  date: string,
  time_slot: string,
  status: string
): Promise<AppointmentDetailed> => {
  try {
    const [rows] = await sql.query(
      "CALL create_appointment(?, ?, ?, ?, ?, ?, ?)",
      [appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status]
    );
    return (rows as any)[0][0] as AppointmentDetailed;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update appointment status (complete/cancel)
export const updateAppointmentStatus = async (
  appointment_id: number,
  status: string
): Promise<AppointmentDetailed> => {
  try {
    const [rows] = await sql.query(
      "CALL update_appointment_status(?, ?)",
      [appointment_id, status]
    );
    return (rows as any)[0][0] as AppointmentDetailed;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (
  appointment_id: number,
  new_date: string,
  new_time_slot: string
): Promise<AppointmentDetailed> => {
  try {
    const [rows] = await sql.query(
      "CALL reschedule_appointment(?, ?, ?)",
      [appointment_id, new_date, new_time_slot]
    );
    return (rows as any)[0][0] as AppointmentDetailed;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (
  appointment_id: number
): Promise<AppointmentDetailed | null> => {
  try {
    const [rows] = await sql.query(
      "CALL get_appointment_by_id(?)",
      [appointment_id]
    );
    const appointments = (rows as any)[0] as AppointmentDetailed[];
    return appointments && appointments.length > 0 ? appointments[0] : null;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// Get available time slots for a doctor on a date
export const getAvailableTimeSlots = async (
  doctor_id: number,
  date: string
): Promise<string[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_available_time_slots(?, ?)",
      [doctor_id, date]
    );
    const bookedSlots = (rows as any)[0] as TimeSlot[];
    return bookedSlots.map(slot => slot.time_slot);
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};

// Create walk-in appointment
export const createWalkInAppointment = async (
  appointment_id: number,
  patient_id: number,
  doctor_id: number,
  patient_note: string
): Promise<AppointmentDetailed> => {
  try {
    const [rows] = await sql.query(
      "CALL create_walkin_appointment(?, ?, ?, ?)",
      [appointment_id, patient_id, doctor_id, patient_note]
    );
    return (rows as any)[0][0] as AppointmentDetailed;
  } catch (error) {
    console.error("Error creating walk-in appointment:", error);
    throw error;
  }
};

// Get branch appointments by date
export const getBranchAppointmentsByDate = async (
  branch_id: number,
  date: string
): Promise<AppointmentDetailed[]> => {
  try {
    const [rows] = await sql.query(
      "CALL get_branch_appointments_by_date(?, ?)",
      [branch_id, date]
    );
    return (rows as any)[0] as AppointmentDetailed[];
  } catch (error) {
    console.error("Error fetching branch appointments:", error);
    throw error;
  }
};
