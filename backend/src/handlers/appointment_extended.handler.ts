import type { Request, Response } from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentById,
  getAvailableTimeSlots,
  createWalkInAppointment,
  getBranchAppointmentsByDate,
} from "../models/appointment_extended.model.ts";

// Create new appointment
export const createAppointmentHandler = async (req: Request, res: Response) => {
  const { appointment_id, patient_id, doctor_id, patient_note, date, time_slot, status } = req.body;

  try {
    if (!appointment_id || !patient_id || !doctor_id || !date || !time_slot) {
      return res.status(400).json({ 
        error: "appointment_id, patient_id, doctor_id, date, and time_slot are required" 
      });
    }

    const appointment = await createAppointment(
      Number(appointment_id),
      Number(patient_id),
      Number(doctor_id),
      patient_note || "",
      date,
      time_slot,
      status || "Scheduled"
    );

    res.status(201).json({ appointment });
  } catch (error: any) {
    console.error("Error in createAppointmentHandler:", error);
    if (error.message && error.message.includes("overlapping")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// Update appointment status
export const updateAppointmentStatusHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const appointment = await updateAppointmentStatus(Number(appointment_id), status);
    res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error in updateAppointmentStatusHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reschedule appointment
export const rescheduleAppointmentHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;
  const { new_date, new_time_slot } = req.body;

  try {
    if (!new_date || !new_time_slot) {
      return res.status(400).json({ error: "new_date and new_time_slot are required" });
    }

    const appointment = await rescheduleAppointment(
      Number(appointment_id),
      new_date,
      new_time_slot
    );

    res.status(200).json({ appointment });
  } catch (error: any) {
    console.error("Error in rescheduleAppointmentHandler:", error);
    if (error.message && error.message.includes("overlapping")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// Get appointment by ID
export const getAppointmentByIdHandler = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    const appointment = await getAppointmentById(Number(appointment_id));
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error in getAppointmentByIdHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get available time slots
export const getAvailableTimeSlotsHandler = async (req: Request, res: Response) => {
  const { doctor_id, date } = req.query;

  try {
    if (!doctor_id || !date) {
      return res.status(400).json({ error: "doctor_id and date are required" });
    }

    const bookedSlots = await getAvailableTimeSlots(Number(doctor_id), String(date));
    
    // Define all possible time slots
    const allSlots = [
      "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
      "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    ];
    
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ available_slots: availableSlots, booked_slots: bookedSlots });
  } catch (error) {
    console.error("Error in getAvailableTimeSlotsHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create walk-in appointment
export const createWalkInAppointmentHandler = async (req: Request, res: Response) => {
  const { appointment_id, patient_id, doctor_id, patient_note } = req.body;

  try {
    if (!appointment_id || !patient_id || !doctor_id) {
      return res.status(400).json({ 
        error: "appointment_id, patient_id, and doctor_id are required" 
      });
    }

    const appointment = await createWalkInAppointment(
      Number(appointment_id),
      Number(patient_id),
      Number(doctor_id),
      patient_note || ""
    );

    res.status(201).json({ appointment });
  } catch (error) {
    console.error("Error in createWalkInAppointmentHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get branch appointments by date
export const getBranchAppointmentsByDateHandler = async (req: Request, res: Response) => {
  const { branch_id, date } = req.query;

  try {
    if (!branch_id || !date) {
      return res.status(400).json({ error: "branch_id and date are required" });
    }

    const appointments = await getBranchAppointmentsByDate(Number(branch_id), String(date));
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error in getBranchAppointmentsByDateHandler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
