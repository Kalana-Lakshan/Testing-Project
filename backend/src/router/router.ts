import type { Express } from "express";
import authorizeRoles from "../auth/auth.js";
import { addNewDoctor, getAllDoctorsForPagination, getAllDoctorSpecialities, getDoctorDetailsByID } from "../handlers/doctor.handler.js"
import { deleteUser, getDeletedUsers, getUsers, restoreUser, updateUser } from "../handlers/user.handler.ts";
import { patientSignup, staffSignup, userLogin, validateUser } from "../handlers/auth.handler.ts";
import { createNewBranch, fetchTotalBranchesCount, getAllBranchNames, getBranches, updateBranchByID } from "../handlers/branch.handler.ts";
import { getLogsForPagination } from "../handlers/log.handler.ts";
import { dischargePatientByID, fetchTotalPatientsCount, getPatientDetailsByID, getPatients, getPatientsCountPerBranchHandler, updateCurrentPatientDetails } from "../handlers/patient.handler.ts";
import { fetchTotalStaffsCount, getAllStaff, updateStaffByID } from "../handlers/staff.handler.ts";
import { addNewSpecialty, getAllSpecialties } from "../handlers/speciality.handler.ts";

import { checkServiceCodeHandler, createTreatmentHandler, getAllTreatmentsHandler } from "../handlers/treatment.handler.ts";
import { getMedicalHistoriesByPatientHandler, getMedicalHistoryHandler } from "../handlers/medicalhistory.handler.ts";
import { getAllMedicationsHandler, getMedicationsByPatientHandler } from "../handlers/medication.handlers.ts";
import {  getAppointmentsByDoctorIdCountHandler, getAppointmentsByDoctorIdHandler, getAppointmentsbyPatientIdHandler, getAppointmentsCountByMonthHandler, getDoctorsAppointmentsForPagination } from "../handlers/appointment.handler.ts";
import { getPatientsCount } from "../models/patient.model.ts";
import { getMonthlyRevenueHandler } from "../handlers/billingpayment.handlers.ts";

// New imports for extended functionality
import { 
  createAppointmentHandler, 
  updateAppointmentStatusHandler, 
  rescheduleAppointmentHandler, 
  getAppointmentByIdHandler, 
  getAvailableTimeSlotsHandler, 
  createWalkInAppointmentHandler, 
  getBranchAppointmentsByDateHandler 
} from "../handlers/appointment_extended.handler.ts";
import { 
  createInvoiceHandler, 
  recordPaymentHandler, 
  getInvoiceHandler, 
  getPaymentsHandler, 
  getPatientOutstandingHandler 
} from "../handlers/invoice.handler.ts";
import { 
  createInsuranceHandler, 
  linkPatientInsuranceHandler, 
  getPatientInsuranceHandler, 
  createInsuranceClaimHandler, 
  getPatientInsuranceClaimsHandler, 
  getAllInsuranceHandler 
} from "../handlers/insurance.handler.ts";
import { 
  createPrescriptionHandler, 
  getPrescriptionHandler, 
  recordTreatmentHandler, 
  getTreatmentsHandler 
} from "../handlers/prescription.handler.ts";
import { 
  getBranchAppointmentsSummaryHandler, 
  getDoctorRevenueReportHandler, 
  getPatientsWithOutstandingBalancesHandler, 
  getTreatmentsByCategoryHandler, 
  getInsuranceVsOutOfPocketHandler 
} from "../handlers/reports.handler.ts";

export const HttpMethod = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};

export const Role = {
	SUPER_ADMIN: "Super_Admin",
	BRANCH_MANAGER: "Branch_Manager",
	DOCTOR: "Doctor",
	ADMIN_STAFF: "Admin_Staff",
	NURSE: "Nurse",
	RECEPTIONIST: "Receptionist",
	BILLING_STAFF: "Billing_Staff",
	INSURANCE_AGENT: "Insurance_Agent",
	PATIENT: "Patient",
	PUBLIC: "Public",

	// special roles to group the common roles
	USER: "User",
	MEDICAL_STAFF: "Medical_Staff",
};

interface Route {
	path: string;
	AccessibleBy: string[];
	method: string;
	handler: Function;
}

var routes: Route[] = [
	// authentication router
	{ path: "/auth/sign-in", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: userLogin },
	{ path: "/auth/sign-up/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: staffSignup },
	{ path: "/auth/sign-up/patient", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: patientSignup },
	{ path: "/auth/validate", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: validateUser },

	// users router
	{ path: "/users/active", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getUsers },
	{ path: "/users/inactive", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDeletedUsers },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateUser },
	{ path: "/user/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.DELETE, handler: deleteUser },
	{ path: "/user/restore/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: restoreUser },

	//doctors router
	{ path: "/doctors", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllDoctorsForPagination },
	{ path: "/doctors/appointments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDoctorsAppointmentsForPagination },
	{ path: "/doctors/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getDoctorDetailsByID },
	{ path: "/doctors/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: addNewDoctor },
	{ path: "/doctors/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllDoctorSpecialities },

	// speciality router
	{ path: "/specialities", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllSpecialties },
	{ path: "/specialities/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: addNewSpecialty },

	// branches router
	{ path: "/all-branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllBranchNames },
	{ path: "/branches", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getBranches },
	{ path: "/branch/count", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: fetchTotalBranchesCount },
	{ path: "/branchs/add", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createNewBranch },
	{ path: "/branchs/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateBranchByID },

	// patients router
	{ path: "/patients", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatients },
	{ path: "/patient/count", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: fetchTotalPatientsCount },
	{ path: "/patient/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateCurrentPatientDetails },
	{ path: "/patient/discharge/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: dischargePatientByID },
	{ path: "/patient/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientDetailsByID },
	{ path: "/patient/count/per-branch", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientsCountPerBranchHandler },

	// staff router
	{ path: "/staff", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllStaff },
	{ path: "/staff/count", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: fetchTotalStaffsCount },
	{ path: "/staff/:id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.PUT, handler: updateStaffByID },

	// logs router
	{ path: "/logs", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getLogsForPagination },

	//treatments router
	{ path: "/treatments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllTreatmentsHandler },
	{ path: "/treatments/check-service-code", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: checkServiceCodeHandler },
	{ path: "/treatments", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: createTreatmentHandler },

	//medical history router
	{ path: "/medical-histories", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicalHistoryHandler },
	{ path: "/medical-histories/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicalHistoriesByPatientHandler },
	//medication router
	{ path: "/medications", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllMedicationsHandler },
	{ path: "/medications/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMedicationsByPatientHandler },

	//appointment router
	{ path: "/appointments/monthly-counts", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentsCountByMonthHandler },
	{ path: "/patient/appointments/:patientId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentsbyPatientIdHandler },
	{ path: "/doctors/appointments/:doctorId", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentsByDoctorIdHandler },
	{ path: "/doctors/appointments/:doctorId/count", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentsByDoctorIdCountHandler },
	
	//billing and payment router
	{ path: "/billing/monthly-revenue", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getMonthlyRevenueHandler },

	// Extended appointment management routes
	{ path: "/appointments/create", AccessibleBy: availableForRoles([Role.MEDICAL_STAFF]), method: HttpMethod.POST, handler: createAppointmentHandler },
	{ path: "/appointments/:appointment_id/status", AccessibleBy: availableForRoles([Role.MEDICAL_STAFF]), method: HttpMethod.PUT, handler: updateAppointmentStatusHandler },
	{ path: "/appointments/:appointment_id/reschedule", AccessibleBy: availableForRoles([Role.MEDICAL_STAFF]), method: HttpMethod.PUT, handler: rescheduleAppointmentHandler },
	{ path: "/appointments/:appointment_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAppointmentByIdHandler },
	{ path: "/appointments/available-slots", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAvailableTimeSlotsHandler },
	{ path: "/appointments/walk-in", AccessibleBy: availableForRoles([Role.MEDICAL_STAFF]), method: HttpMethod.POST, handler: createWalkInAppointmentHandler },
	{ path: "/appointments/branch/by-date", AccessibleBy: availableForRoles([Role.MEDICAL_STAFF]), method: HttpMethod.GET, handler: getBranchAppointmentsByDateHandler },

	// Invoice and payment routes
	{ path: "/invoices/create", AccessibleBy: availableForRoles([Role.BILLING_STAFF]), method: HttpMethod.POST, handler: createInvoiceHandler },
	{ path: "/invoices/:appointment_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getInvoiceHandler },
	{ path: "/payments/record", AccessibleBy: availableForRoles([Role.BILLING_STAFF]), method: HttpMethod.POST, handler: recordPaymentHandler },
	{ path: "/payments/invoice/:invoice_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPaymentsHandler },
	{ path: "/patients/:patient_id/outstanding", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientOutstandingHandler },

	// Insurance routes
	{ path: "/insurance/create", AccessibleBy: availableForRoles([Role.SUPER_ADMIN]), method: HttpMethod.POST, handler: createInsuranceHandler },
	{ path: "/insurance/all", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getAllInsuranceHandler },
	{ path: "/insurance/link-patient", AccessibleBy: availableForRoles([Role.INSURANCE_AGENT]), method: HttpMethod.POST, handler: linkPatientInsuranceHandler },
	{ path: "/insurance/patient/:patient_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientInsuranceHandler },
	{ path: "/insurance/claims/create", AccessibleBy: availableForRoles([Role.INSURANCE_AGENT]), method: HttpMethod.POST, handler: createInsuranceClaimHandler },
	{ path: "/insurance/claims/patient/:patient_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPatientInsuranceClaimsHandler },

	// Prescription and treatment routes
	{ path: "/prescriptions/create", AccessibleBy: availableForRoles([Role.DOCTOR]), method: HttpMethod.POST, handler: createPrescriptionHandler },
	{ path: "/prescriptions/:appointment_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getPrescriptionHandler },
	{ path: "/treatments/record", AccessibleBy: availableForRoles([Role.DOCTOR]), method: HttpMethod.POST, handler: recordTreatmentHandler },
	{ path: "/treatments/appointment/:appointment_id", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getTreatmentsHandler },

	// Management reports routes
	{ path: "/reports/branch-appointments", AccessibleBy: availableForRoles([Role.BRANCH_MANAGER]), method: HttpMethod.GET, handler: getBranchAppointmentsSummaryHandler },
	{ path: "/reports/doctor-revenue", AccessibleBy: availableForRoles([Role.BRANCH_MANAGER]), method: HttpMethod.GET, handler: getDoctorRevenueReportHandler },
	{ path: "/reports/outstanding-balances", AccessibleBy: availableForRoles([Role.BRANCH_MANAGER]), method: HttpMethod.GET, handler: getPatientsWithOutstandingBalancesHandler },
	{ path: "/reports/treatments-by-category", AccessibleBy: availableForRoles([Role.BRANCH_MANAGER]), method: HttpMethod.GET, handler: getTreatmentsByCategoryHandler },
	{ path: "/reports/insurance-vs-outofpocket", AccessibleBy: availableForRoles([Role.BRANCH_MANAGER]), method: HttpMethod.GET, handler: getInsuranceVsOutOfPocketHandler }
];


export const MapRouters = (app: Express) => {
	for (const route of routes) {
		switch (route.method) {
			case HttpMethod.GET:
				app.get(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.POST:
				app.post(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.PUT:
				app.put(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
			case HttpMethod.DELETE:
				app.delete(route.path, authorizeRoles(route.AccessibleBy), (req, res) => {
					route.handler(req, res);
				});
				break;
		}
	}
};


function availableForRoles(roles: string[]): string[] {
	const allRoles = Object.values(Role);
	let result: Set<string> = new Set();

	for (const role of roles) {
		if (role === Role.USER) {
			for (const r of allRoles) {
				if (r !== Role.USER || r !== Role.PUBLIC || r !== Role.MEDICAL_STAFF) {
					result.add(r);
				}
			}
			break;
		} else if (role === Role.MEDICAL_STAFF) {
			[
				Role.RECEPTIONIST,
				Role.NURSE,
				Role.DOCTOR,
				Role.ADMIN_STAFF,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else if (role === Role.RECEPTIONIST) {
			[
				Role.RECEPTIONIST,
				Role.ADMIN_STAFF,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else if (
			role === Role.ADMIN_STAFF ||
			role === Role.DOCTOR ||
			role === Role.NURSE ||
			role === Role.BILLING_STAFF ||
			role === Role.INSURANCE_AGENT
		) {
			[
				role,
				Role.BRANCH_MANAGER,
				Role.SUPER_ADMIN
			].forEach(r => result.add(r));
		} else {
			result.add(role);
		}
	}

	result.add(Role.SUPER_ADMIN);

	return Array.from(result);
}

