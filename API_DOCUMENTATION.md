# MedSync API Documentation

## Overview
This document provides comprehensive API documentation for the MedSync Clinic Appointment and Treatment Management System.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Appointment Management

### Create Appointment
**POST** `/appointments/create`
- **Access**: Medical Staff
- **Body**:
```json
{
  "appointment_id": 1,
  "patient_id": 100,
  "doctor_id": 50,
  "patient_note": "Follow-up consultation",
  "date": "2025-01-15",
  "time_slot": "09:00-10:00",
  "status": "Scheduled"
}
```

### Update Appointment Status
**PUT** `/appointments/:appointment_id/status`
- **Access**: Medical Staff
- **Body**:
```json
{
  "status": "Completed"
}
```

### Reschedule Appointment
**PUT** `/appointments/:appointment_id/reschedule`
- **Access**: Medical Staff
- **Body**:
```json
{
  "new_date": "2025-01-20",
  "new_time_slot": "14:00-15:00"
}
```

### Get Appointment Details
**GET** `/appointments/:appointment_id`
- **Access**: Public
- **Response**: Appointment details with patient, doctor, and branch information

### Get Available Time Slots
**GET** `/appointments/available-slots?doctor_id=50&date=2025-01-15`
- **Access**: Public
- **Response**:
```json
{
  "available_slots": ["08:00-09:00", "10:00-11:00"],
  "booked_slots": ["09:00-10:00", "11:00-12:00"]
}
```

### Create Walk-in Appointment
**POST** `/appointments/walk-in`
- **Access**: Medical Staff
- **Body**:
```json
{
  "appointment_id": 2,
  "patient_id": 101,
  "doctor_id": 51,
  "patient_note": "Emergency consultation"
}
```

### Get Branch Appointments by Date
**GET** `/appointments/branch/by-date?branch_id=1&date=2025-01-15`
- **Access**: Medical Staff
- **Response**: List of all appointments for a branch on a specific date

---

## Billing & Invoicing

### Create Invoice
**POST** `/invoices/create`
- **Access**: Billing Staff
- **Body**:
```json
{
  "appointment_id": 1,
  "additional_fee": 500.00,
  "claim_id": null
}
```

### Get Invoice
**GET** `/invoices/:appointment_id`
- **Access**: Public
- **Response**: Invoice details with patient and doctor information

### Record Payment
**POST** `/payments/record`
- **Access**: Billing Staff
- **Body**:
```json
{
  "payment_id": 1,
  "invoice_id": 1,
  "branch_id": 1,
  "paid_amount": 1500.00,
  "cashier_id": 10
}
```

### Get Payments for Invoice
**GET** `/payments/invoice/:invoice_id`
- **Access**: Public
- **Response**: List of all payments made for an invoice

### Get Patient Outstanding Balance
**GET** `/patients/:patient_id/outstanding`
- **Access**: Public
- **Response**:
```json
{
  "outstanding": 2500.00
}
```

---

## Insurance Management

### Create Insurance Policy
**POST** `/insurance/create`
- **Access**: Super Admin
- **Body**:
```json
{
  "insurance_id": 1,
  "insurance_type": "Health Plus",
  "insurance_period": "Annual",
  "claim_percentage": 0.70
}
```

### Get All Insurance Policies
**GET** `/insurance/all`
- **Access**: Public
- **Response**: List of all available insurance policies

### Link Patient to Insurance
**POST** `/insurance/link-patient`
- **Access**: Insurance Agent
- **Body**:
```json
{
  "patient_id": 100,
  "insurance_id": 1
}
```

### Get Patient Insurance Policies
**GET** `/insurance/patient/:patient_id`
- **Access**: Public
- **Response**: List of insurance policies for a patient

### Create Insurance Claim
**POST** `/insurance/claims/create`
- **Access**: Insurance Agent
- **Body**:
```json
{
  "claim_id": 1,
  "service_code": 1001,
  "patient_id": 100,
  "approved_by": 20,
  "insurance_id": 1
}
```

### Get Patient Insurance Claims
**GET** `/insurance/claims/patient/:patient_id`
- **Access**: Public
- **Response**: List of all insurance claims for a patient

---

## Prescriptions & Treatments

### Create Prescription
**POST** `/prescriptions/create`
- **Access**: Doctor
- **Body**:
```json
{
  "appointment_id": 1,
  "consultation_note": "Patient shows improvement",
  "prescription_items": "Amoxicillin 500mg, 3x daily for 7 days"
}
```

### Get Prescription
**GET** `/prescriptions/:appointment_id`
- **Access**: Public
- **Response**: Prescription details for an appointment

### Record Treatment
**POST** `/treatments/record`
- **Access**: Doctor
- **Body**:
```json
{
  "appointment_id": 1,
  "service_code": 1001
}
```

### Get Treatments for Appointment
**GET** `/treatments/appointment/:appointment_id`
- **Access**: Public
- **Response**: List of all treatments performed in an appointment

---

## Management Reports

### Report 1: Branch-wise Appointment Summary
**GET** `/reports/branch-appointments?date=2025-01-15&branch_id=1`
- **Access**: Branch Manager
- **Response**: Appointment counts by status for each branch on a specific day

### Report 2: Doctor-wise Revenue Report
**GET** `/reports/doctor-revenue?start_date=2025-01-01&end_date=2025-01-31&doctor_id=-1`
- **Access**: Branch Manager
- **Response**: Revenue breakdown per doctor including appointments, collections, and outstanding amounts

### Report 3: Patients with Outstanding Balances
**GET** `/reports/outstanding-balances`
- **Access**: Branch Manager
- **Response**: List of all patients with unpaid invoices and their outstanding amounts

### Report 4: Treatments by Category
**GET** `/reports/treatments-by-category?start_date=2025-01-01&end_date=2025-01-31`
- **Access**: Branch Manager
- **Response**: Treatment counts and revenue grouped by specialty category

### Report 5: Insurance Coverage vs Out-of-Pocket
**GET** `/reports/insurance-vs-outofpocket?start_date=2025-01-01&end_date=2025-12-31`
- **Access**: Branch Manager
- **Response**: Monthly breakdown of insurance-covered vs out-of-pocket payments

---

## Existing Endpoints (from original codebase)

### Authentication
- **POST** `/auth/sign-in` - User login
- **POST** `/auth/sign-up/staff` - Staff registration
- **POST** `/auth/sign-up/patient` - Patient registration
- **GET** `/auth/validate` - Validate JWT token

### Users
- **GET** `/users/active` - Get active users
- **GET** `/users/inactive` - Get deleted users
- **PUT** `/user/:id` - Update user
- **DELETE** `/user/:id` - Delete user
- **PUT** `/user/restore/:id` - Restore deleted user

### Doctors
- **GET** `/doctors` - Get doctors (paginated)
- **GET** `/doctors/:id` - Get doctor by ID
- **POST** `/doctors/add` - Add new doctor
- **GET** `/doctors/specialities` - Get doctor specialties
- **GET** `/doctors/appointments` - Get all doctor appointments

### Patients
- **GET** `/patients` - Get patients (paginated with filters)
- **GET** `/patient/:id` - Get patient by ID
- **PUT** `/patient/:id` - Update patient
- **PUT** `/patient/discharge/:id` - Discharge patient
- **GET** `/patient/count` - Get total patient count
- **GET** `/patient/count/per-branch` - Get patient count per branch

### Branches
- **GET** `/all-branches` - Get all branch names
- **GET** `/branches` - Get branches (paginated)
- **POST** `/branchs/add` - Create new branch
- **PUT** `/branchs/:id` - Update branch
- **GET** `/branch/count` - Get total branch count

### Staff
- **GET** `/staff` - Get all staff
- **PUT** `/staff/:id` - Update staff
- **GET** `/staff/count` - Get total staff count

### Specialties
- **GET** `/specialities` - Get all specialties
- **POST** `/specialities/add` - Add new specialty

### Treatments
- **GET** `/treatments` - Get all treatments
- **POST** `/treatments` - Create new treatment
- **GET** `/treatments/check-service-code` - Check if service code exists

### Medical History
- **GET** `/medical-histories` - Get all medical histories
- **GET** `/medical-histories/:patientId` - Get medical histories for patient

### Medications
- **GET** `/medications` - Get all medications
- **GET** `/medications/:patientId` - Get medications for patient

### Appointments (Original)
- **GET** `/appointments/monthly-counts` - Get monthly appointment counts
- **GET** `/patient/appointments/:patientId` - Get patient appointments
- **GET** `/doctors/appointments/:doctorId` - Get doctor appointments
- **GET** `/doctors/appointments/:doctorId/count` - Get doctor appointment count

### Billing (Original)
- **GET** `/billing/monthly-revenue` - Get monthly revenue

### Logs
- **GET** `/logs` - Get system logs (paginated)

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "error": "Missing required parameter: appointment_id"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Appointment not found"
}
```

### 409 Conflict
```json
{
  "error": "Doctor already has an appointment in this time slot"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Role-Based Access Control

### Roles
- **Super_Admin**: Full system access
- **Branch_Manager**: Branch management and reports
- **Doctor**: Medical operations
- **Admin_Staff**: Administrative tasks
- **Nurse**: Medical support
- **Receptionist**: Front desk operations
- **Billing_Staff**: Billing and payments
- **Insurance_Agent**: Insurance management
- **Patient**: Personal data access

### Role Hierarchies
- **Medical_Staff**: Includes Receptionist, Nurse, Doctor, Admin_Staff, Branch_Manager, Super_Admin
- **Billing_Staff**: Includes Billing_Staff, Branch_Manager, Super_Admin
- **Insurance_Agent**: Includes Insurance_Agent, Branch_Manager, Super_Admin

---

## Database Procedures

All API endpoints utilize stored procedures for ACID compliance and data integrity. Key procedures include:

### Appointment Procedures
- `create_appointment` - Creates new appointment with overlap validation
- `update_appointment_status` - Updates appointment status
- `reschedule_appointment` - Reschedules with conflict checking
- `get_appointment_by_id` - Retrieves appointment details
- `get_available_time_slots` - Gets booked slots for a doctor
- `create_walkin_appointment` - Creates emergency walk-in

### Billing Procedures
- `create_invoice` - Auto-calculates fees from treatments
- `record_payment` - Records payment and updates remaining balance
- `get_invoice_by_appointment` - Retrieves invoice with details
- `get_patient_outstanding_balance` - Calculates total outstanding

### Insurance Procedures
- `create_insurance` - Creates insurance policy
- `link_patient_insurance` - Links patient to policy
- `create_insurance_claim` - Auto-calculates claim amount
- `get_patient_insurance_claims` - Retrieves claim history

### Report Procedures
- `report_branch_appointments_daily` - Daily appointment summary
- `report_doctor_revenue` - Doctor revenue analysis
- `report_patients_outstanding_balances` - Outstanding payments
- `report_treatments_by_category` - Treatment statistics
- `report_insurance_vs_outofpocket` - Insurance coverage analysis

---

## Notes

1. All dates should be in `YYYY-MM-DD` format
2. Time slots are in `HH:MM-HH:MM` format (e.g., "09:00-10:00")
3. Monetary values are in decimal format with 2 decimal places
4. Patient IDs, Doctor IDs, and other IDs are integers
5. The system prevents double-booking of doctors automatically
6. Partial payments are supported - remaining balance is tracked
7. Insurance claims are auto-calculated based on policy percentage
8. All timestamps are automatically generated by the database
