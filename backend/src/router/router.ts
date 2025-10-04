import type { Express, Request, Response } from "express";
import authorizeRoles from "../auth/auth.js";
import { getUsers } from "../handlers/user.handler.ts";
import { patientSignup, userLogin, userSignup, validateUser } from "../handlers/auth.handler.ts";
import {getAllDoctors,getDoctorByID} from "../handlers/doctor.handler.js"
import { getAllDoctorAppointments } from "../handlers/doctor.appointment.handler.ts";

export const HttpMethod = {
	GET    : "GET",
	POST   : "POST",
	PUT    : "PUT",
	DELETE : "DELETE",
};

export const Role = {
	SUPER_ADMIN		: "SUPER_ADMIN",
	BRANCH_MANAGER	: "BRANCH_MANAGER",
	DOCTOR			: "DOCTOR",
	ADMIN_STAFF		: "ADMIN_STAFF",
	NURSE			: "NURSE",
	RECEPTIONIST	: "RECEPTIONIST",
	BILLING_STAFF	: "BILLING_STAFF",
	INSURANCE_AGENT	: "INSURANCE_AGENT",
	PATIENT			: "PATIENT",
	PUBLIC			: "PUBLIC",		// open access 
	// to group the user related roles those who have access to login to the system
	USER			: "USER",
	// to group the medical related staff
	MEDICAL_STAFF	: "MEDICAL_STAFF",
};

interface Route {
	path: string;
	AccessibleBy: string[];
	method: string;
	handler: Function;
}

var routes: Route[] = [
	// authentication router
	{ path: "/auth/sign-in", AccessibleBy: availableForRoles([Role.USER]), method: HttpMethod.POST, handler: userLogin },
	{ path: "/auth/sign-up/user", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: userSignup },
	{ path: "/auth/sign-up/patient", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.POST, handler: patientSignup },
	{ path: "/auth/validate", AccessibleBy: availableForRoles([Role.USER]), method: HttpMethod.POST, handler: validateUser },

	// users router
	{ path: "/users/active", AccessibleBy: availableForRoles([Role.PUBLIC]), method: HttpMethod.GET, handler: getUsers },
	//doctors router
	{ path: "/doctors",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctors },
	{path: "/doctors/:id",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getDoctorByID},
	{path: "/doctors-appointments",AccessibleBy:availableForRoles([Role.PUBLIC]),method: HttpMethod.GET,handler:getAllDoctorAppointments},

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

