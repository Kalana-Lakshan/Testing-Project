# MedSync Testing Guide

## Pre-Testing Setup

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS `Project-MedSync`;
USE `Project-MedSync`;

# Run table creation script
SOURCE /path/to/backend/src/db/table.sql;

# Run procedures script
SOURCE /path/to/backend/src/db/procedures.sql;

# Verify procedures were created
SHOW PROCEDURE STATUS WHERE Db = 'Project-MedSync';
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

Server should start on `http://localhost:8000`

---

## Test Scenarios

### Scenario 1: Appointment Booking Flow

#### Step 1: Check Available Time Slots
**GET** `/appointments/available-slots?doctor_id=1&date=2025-01-20`

**Expected Response:**
```json
{
  "available_slots": ["08:00-09:00", "10:00-11:00", "14:00-15:00"],
  "booked_slots": ["09:00-10:00", "11:00-12:00"]
}
```

#### Step 2: Create Appointment
**POST** `/appointments/create`

**Body:**
```json
{
  "appointment_id": 1001,
  "patient_id": 100,
  "doctor_id": 1,
  "patient_note": "Regular checkup",
  "date": "2025-01-20",
  "time_slot": "08:00-09:00",
  "status": "Scheduled"
}
```

**Expected:** Success with appointment details

#### Step 3: Try Double Booking (Should Fail)
**POST** `/appointments/create`

**Body:**
```json
{
  "appointment_id": 1002,
  "patient_id": 101,
  "doctor_id": 1,
  "patient_note": "Consultation",
  "date": "2025-01-20",
  "time_slot": "08:00-09:00",
  "status": "Scheduled"
}
```

**Expected:** 409 Conflict - "Doctor already has an appointment in this time slot"

---

### Scenario 2: Emergency Walk-in

**POST** `/appointments/walk-in`

**Body:**
```json
{
  "appointment_id": 1003,
  "patient_id": 102,
  "doctor_id": 2,
  "patient_note": "Emergency - chest pain"
}
```

**Expected:** Appointment created with today's date and "Walk-in" time slot

---

### Scenario 3: Appointment Rescheduling

#### Step 1: Reschedule Appointment
**PUT** `/appointments/1001/reschedule`

**Body:**
```json
{
  "new_date": "2025-01-21",
  "new_time_slot": "10:00-11:00"
}
```

**Expected:** Updated appointment details

#### Step 2: Try Rescheduling to Occupied Slot (Should Fail)
**PUT** `/appointments/1001/reschedule`

**Body:**
```json
{
  "new_date": "2025-01-20",
  "new_time_slot": "09:00-10:00"
}
```

**Expected:** 409 Conflict

---

### Scenario 4: Complete Appointment & Record Treatment

#### Step 1: Update Appointment Status
**PUT** `/appointments/1001/status`

**Body:**
```json
{
  "status": "Completed"
}
```

#### Step 2: Record Treatment
**POST** `/treatments/record`

**Body:**
```json
{
  "appointment_id": 1001,
  "service_code": 1001
}
```

#### Step 3: Create Prescription
**POST** `/prescriptions/create`

**Body:**
```json
{
  "appointment_id": 1001,
  "consultation_note": "Patient recovering well. Continue medication.",
  "prescription_items": "Amoxicillin 500mg - 3x daily for 7 days\nParacetamol 500mg - as needed for pain"
}
```

---

### Scenario 5: Billing & Payment

#### Step 1: Create Invoice
**POST** `/invoices/create`

**Body:**
```json
{
  "appointment_id": 1001,
  "additional_fee": 500.00,
  "claim_id": null
}
```

**Expected:** Invoice with auto-calculated total from treatments + additional fee

#### Step 2: Get Invoice
**GET** `/invoices/1001`

**Expected:** Full invoice details with patient and doctor info

#### Step 3: Make Partial Payment
**POST** `/payments/record`

**Body:**
```json
{
  "payment_id": 5001,
  "invoice_id": 1001,
  "branch_id": 1,
  "paid_amount": 1000.00,
  "cashier_id": 10
}
```

**Expected:** Payment recorded, remaining balance updated

#### Step 4: Make Second Payment
**POST** `/payments/record`

**Body:**
```json
{
  "payment_id": 5002,
  "invoice_id": 1001,
  "branch_id": 1,
  "paid_amount": 500.00,
  "cashier_id": 10
}
```

#### Step 5: Check Outstanding Balance
**GET** `/patients/100/outstanding`

**Expected:** Updated outstanding amount

---

### Scenario 6: Insurance Management

#### Step 1: Create Insurance Policy
**POST** `/insurance/create`

**Body:**
```json
{
  "insurance_id": 1,
  "insurance_type": "Premium Health",
  "insurance_period": "Annual",
  "claim_percentage": 0.70
}
```

#### Step 2: Link Patient to Insurance
**POST** `/insurance/link-patient`

**Body:**
```json
{
  "patient_id": 100,
  "insurance_id": 1
}
```

#### Step 3: Get Patient Insurance
**GET** `/insurance/patient/100`

**Expected:** List of patient's insurance policies

#### Step 4: Create Insurance Claim
**POST** `/insurance/claims/create`

**Body:**
```json
{
  "claim_id": 1,
  "service_code": 1001,
  "patient_id": 100,
  "approved_by": 5,
  "insurance_id": 1
}
```

**Expected:** Claim with auto-calculated amount (70% of service fee)

#### Step 5: Get Patient Claims
**GET** `/insurance/claims/patient/100`

**Expected:** List of all claims for patient

---

### Scenario 7: Billing with Insurance

#### Step 1: Create Appointment & Complete
(Follow Scenario 4)

#### Step 2: Create Insurance Claim First
**POST** `/insurance/claims/create`

**Body:**
```json
{
  "claim_id": 2,
  "service_code": 1002,
  "patient_id": 100,
  "approved_by": 5,
  "insurance_id": 1
}
```

#### Step 3: Create Invoice with Claim
**POST** `/invoices/create`

**Body:**
```json
{
  "appointment_id": 1002,
  "additional_fee": 0,
  "claim_id": 2
}
```

**Expected:** Invoice with reduced net_amount (total_fee - claimed_amount)

---

### Scenario 8: Management Reports

#### Report 1: Branch Appointments Summary
**GET** `/reports/branch-appointments?date=2025-01-20&branch_id=-1`

**Expected:** Appointment counts by status for all branches

#### Report 2: Doctor Revenue
**GET** `/reports/doctor-revenue?start_date=2025-01-01&end_date=2025-01-31&doctor_id=-1`

**Expected:** Revenue breakdown per doctor

#### Report 3: Outstanding Balances
**GET** `/reports/outstanding-balances`

**Expected:** List of patients with unpaid invoices

#### Report 4: Treatments by Category
**GET** `/reports/treatments-by-category?start_date=2025-01-01&end_date=2025-01-31`

**Expected:** Treatment statistics by specialty

#### Report 5: Insurance vs Out-of-Pocket
**GET** `/reports/insurance-vs-outofpocket?start_date=2025-01-01&end_date=2025-12-31`

**Expected:** Monthly insurance coverage analysis

---

## Automated Testing Script

### Using cURL

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"
TOKEN="your_jwt_token_here"

# Test 1: Get available slots
echo "Test 1: Get Available Slots"
curl -X GET "$BASE_URL/appointments/available-slots?doctor_id=1&date=2025-01-20" \
  -H "Authorization: Bearer $TOKEN"

# Test 2: Create appointment
echo "\nTest 2: Create Appointment"
curl -X POST "$BASE_URL/appointments/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": 1001,
    "patient_id": 100,
    "doctor_id": 1,
    "patient_note": "Regular checkup",
    "date": "2025-01-20",
    "time_slot": "08:00-09:00",
    "status": "Scheduled"
  }'

# Test 3: Get appointment details
echo "\nTest 3: Get Appointment"
curl -X GET "$BASE_URL/appointments/1001" \
  -H "Authorization: Bearer $TOKEN"

# Add more tests...
```

---

## Common Issues & Solutions

### Issue 1: "Procedure does not exist"
**Solution:** Re-run procedures.sql
```bash
mysql -u root -p Project-MedSync < backend/src/db/procedures.sql
```

### Issue 2: "Cannot connect to database"
**Solution:** Check .env file configuration
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Project-MedSync
```

### Issue 3: "Unauthorized" errors
**Solution:** Login first to get JWT token
```bash
curl -X POST "$BASE_URL/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

### Issue 4: TypeScript compilation errors
**Solution:** Rebuild the project
```bash
cd backend
npm run build
```

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test appointment creation endpoint
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  -p appointment.json -T application/json \
  http://localhost:8000/appointments/create
```

### Database Query Performance
```sql
-- Check slow queries
SHOW PROCESSLIST;

-- Analyze query execution
EXPLAIN SELECT * FROM appointment WHERE doctor_id = 1 AND date = '2025-01-20';

-- Add indexes if needed
CREATE INDEX idx_appointment_doctor_date ON appointment(doctor_id, date);
```

---

## Test Data Setup

### Sample Test Data SQL
```sql
-- Insert test patient
INSERT INTO patient (patient_id, name, date_of_birth, gender, blood_type, emergency_contact_no)
VALUES (100, 'John Doe', '1990-01-15', 'Male', 'O+', '0771234567');

-- Insert test doctor
INSERT INTO doctor (doctor_id, name, nic, specialization)
VALUES (1, 'Dr. Smith', '901234567V', 'General');

-- Insert test staff
INSERT INTO staff (staff_id, name, nic, role)
VALUES (10, 'Jane Cashier', '851234567V', 'Billing_Staff');

-- Insert test treatment
INSERT INTO treatment_catelogue (service_code, name, fee, description, speciality_id)
VALUES (1001, 'General Consultation', 2000.00, 'Basic consultation', 1);
```

---

## Checklist

### Pre-Deployment Checklist
- [ ] All database tables created
- [ ] All stored procedures loaded
- [ ] Backend dependencies installed
- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] All 35+ endpoints tested
- [ ] Authentication working
- [ ] Role-based access control verified
- [ ] Error handling tested
- [ ] Database constraints working
- [ ] Conflict prevention working (appointments)
- [ ] Partial payments working
- [ ] Insurance claims calculating correctly
- [ ] All 5 reports generating data
- [ ] Documentation complete

### Post-Deployment Checklist
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Firewall rules set
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Logs configured
- [ ] Performance optimized

---

## Success Criteria

✅ **All tests pass**
✅ **No errors in console**
✅ **Database constraints enforced**
✅ **API responses match documentation**
✅ **Role-based access working**
✅ **Reports generate accurate data**
✅ **Partial payments tracked correctly**
✅ **Insurance claims auto-calculate**
✅ **Appointment conflicts prevented**

---

**Happy Testing! 🚀**
