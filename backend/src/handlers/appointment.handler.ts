import type { Request, Response } from "express";
import { getAppointmentsbyPatientId, getMonthlyAppointmentCounts } from "../models/appointment.model.ts";

export const getAppointmentsbyPatientIdHandler = async (req: Request, res: Response) => {
    try {
        // /patients/appointments/:patientId
        const { patientId } = req.params;
        const appointments = await getAppointmentsbyPatientId(Number(patientId));
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getAppointmentsbyPatientIdHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAppointmentsCountByMonthHandler = async (req: Request, res: Response) => {
    try {
        const appointmentCounts = await getMonthlyAppointmentCounts('2025-01-01', '2025-12-31', 'null');
        res.status(200).json(appointmentCounts);
    } catch (error) {
        console.error("Error in getAppointmentsCountByMonthHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};