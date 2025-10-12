USE `Project-MedSync`;

-- BRANCH
INSERT INTO `branch` (`branch_id`, `name`, `location`, `landline_no`)
VALUES
(1, 'Colombo', 'Colombo 07', '0112567890'),
(2, 'Kandy', 'Peradeniya Road', '0812345678'),
(3, 'Galle', 'Fort Road', '0912233445'),
(4, 'Jaffna', 'Stanley Road', '0214567890'),
(5, 'Matara', 'Beach Road', '0413344556');

-- USER
INSERT INTO `user` (`user_id`, `username`, `password_hash`, `role`, `branch_id`, `is_approved`)
VALUES
(1, 'super_admin', 'hash_super', 'Super_Admin', 1, TRUE),
(2, 'bm_kandy', 'hash_kandy', 'Branch_Manager', 2, TRUE),
(3, 'dr_perera', 'hash_perera', 'Doctor', 1, TRUE),
(4, 'nurse_amma', 'hash_nurse', 'Nurse', 3, TRUE),
(5, 'recept_01', 'hash_recept', 'Receptionist', 1, TRUE),
(6, 'bill_staff', 'hash_bill', 'Billing_Staff', 2, TRUE),
(7, 'agent_01', 'hash_agent', 'Insurance_Agent', 3, TRUE),
(8, 'patient_ravi', 'hash_ravi', 'Patient', 1, TRUE),
(9, 'patient_sara', 'hash_sara', 'Patient', 2, TRUE),
(10, 'patient_kamal', 'hash_kamal', 'Patient', 3, TRUE),
(11, 'patient_nimali', 'hash_nimali', 'Patient', 2, TRUE),
(12, 'patient_tharindu', 'hash_tharindu', 'Patient', 3, TRUE),
(13, 'bm_malathi', 'hash_malathi', 'Branch_Manager', 1, TRUE),
(14, 'bm_gayan', 'hash_gayan', 'Branch_Manager', 2, TRUE),
(15, 'bm_chathura', 'hash_chathura', 'Branch_Manager', 3, TRUE),
(16, 'bm_anoma', 'hash_anoma', 'Branch_Manager', 1, TRUE),
(17, 'admin_dinuka', 'hash_dinuka', 'Admin_Staff', 2, TRUE),
(18, 'dr_silva', 'hash_drsilva', 'Doctor', 1, TRUE),
(19, 'dr_fernando', 'hash_drfernando', 'Doctor', 2, TRUE),
(20, 'dr_wijesinghe', 'hash_drwije', 'Doctor', 3, TRUE),
(21, 'dr_jayasinghe', 'hash_drjaya', 'Doctor', 1, TRUE);

-- PATIENT
INSERT INTO `patient` (`patient_id`, `name`, `gender`, `emergency_contact_no`, `nic`, `address`, `date_of_birth`, `blood_type`)
VALUES
(8, 'Ravindu Perera', 'Male', '0771234567', '200012345V', 'Colombo', '2000-01-12', 'A+'),
(9, 'Sara Silva', 'Female', '0779876543', '200134567V', 'Kandy', '1999-05-23', 'B+'),
(10, 'Kamal Fernando', 'Male', '0765554443', '199812345V', 'Galle', '1998-11-10', 'O-'),
(11, 'Nimali Jayasuriya', 'Female', '0713322114', '200156789V', 'Matara', '2001-02-19', 'AB+'),
(12, 'Tharindu De Silva', 'Male', '0756677889', '199945612V', 'Jaffna', '1997-06-05', 'A-');

-- BRANCH MANAGER
INSERT INTO `branch_manager` (`manager_id`, `name`, `monthly_salary`, `gender`)
VALUES
(2, 'Kanishka Weerasinghe', 150000.00, 'Male'),
(13, 'Malathi Perera', 152000.00, 'Female'),
(14, 'Gayan Fernando', 148000.00, 'Male'),
(15, 'Chathura Silva', 155000.00, 'Male'),
(16, 'Anoma Jayasinghe', 160000.00, 'Female');

-- STAFF
INSERT INTO `staff` (`staff_id`, `name`, `type`, `monthly_salary`, `gender`)
VALUES
(4, 'Amma Nisansala', 'Nurse', 95000.00, 'Female'),
(5, 'Ruwini Fonseka', 'Receptionist', 80000.00, 'Female'),
(6, 'Ruwan Dissanayake', 'Billing_Staff', 85000.00, 'Male'),
(7, 'Rashmi Senanayake', 'Insurance_Agent', 90000.00, 'Female'),
(17, 'Dinuka Jayawardena', 'Admin_Staff', 92000.00, 'Male');

-- USER CONTACT
INSERT INTO `user_contact` (`contact`, `contact_type`, `is_default`, `user_id`)
VALUES
('superadmin@medsync.lk', 'Email', TRUE, 1),
('0112567890', 'Phone_No', TRUE, 1),
('bm.kandy@medsync.lk', 'Email', TRUE, 2),
('0751112223', 'Phone_No', TRUE, 3),
('ravi@gmail.com', 'Email', TRUE, 8);

-- SPECIALITY
INSERT INTO `speciality` (`speciality_id`, `speciality_name`, `description`)
VALUES
(1, 'Cardiology', 'Heart and blood vessel treatments'),
(2, 'Neurology', 'Brain and nervous system care'),
(3, 'Dermatology', 'Skin related treatments'),
(4, 'Pediatrics', 'Child healthcare'),
(5, 'Orthopedics', 'Bone and muscle treatments');

-- DOCTOR
INSERT INTO `doctor` (`doctor_id`, `name`, `fee_per_patient`, `basic_monthly_salary`, `gender`)
VALUES
(3, 'Dr. Perera', 2500.00, 175000.00, 'Male'),
(18, 'Dr. Silva', 3000.00, 180000.00, 'Male'),
(19, 'Dr. Fernando', 2200.00, 160000.00, 'Female'),
(20, 'Dr. Wijesinghe', 2700.00, 170000.00, 'Female'),
(21, 'Dr. Jayasinghe', 2600.00, 165000.00, 'Male');

-- DOCTOR SPECIALITY
INSERT INTO `doctor_speciality` (`doctor_id`, `specialiy_id`, `added_at`)
VALUES
(3, 1, '2025-01-10 10:00:00'),
(18, 2, '2025-01-11 09:30:00'),
(19, 3, '2025-02-01 08:45:00'),
(20, 4, '2025-02-05 12:00:00'),
(21, 5, '2025-02-10 11:15:00');

-- INSURANCE
INSERT INTO `insurance` (`insurance_id`, `insurance_type`, `insurance_period`, `claim_percentage`, `created_at`)
VALUES
(1, 'Health Basic', '1 Year', 0.70, '2025-01-01 00:00:00'),
(2, 'Health Plus', '2 Years', 0.80, '2025-02-01 00:00:00'),
(3, 'Premium Care', '3 Years', 0.90, '2025-03-01 00:00:00'),
(4, 'Family Health', '1 Year', 0.75, '2025-04-01 00:00:00'),
(5, 'Senior Care', '2 Years', 0.85, '2025-05-01 00:00:00');

-- TREATMENT CATALOGUE
INSERT INTO `treatment_catelogue` (`service_code`, `name`, `fee`, `description`, `speciality_id`)
VALUES
(101, 'ECG Scan', 1500.00, 'Electrocardiogram test', 1),
(102, 'MRI Scan', 8000.00, 'Brain MRI scanning', 2),
(103, 'Skin Therapy', 3000.00, 'Acne and scar treatment', 3),
(104, 'Child Checkup', 1200.00, 'Routine pediatric examination', 4),
(105, 'Fracture Treatment', 5000.00, 'Bone fracture repair', 5);

-- INSURANCE CLAIM
INSERT INTO `insurance_claim` (`claim_id`, `service_code`, `patient_id`, `approved_by`, `claimed_amount`, `claimed_at`, `insurance_id`)
VALUES
(1, 101, 8, 7, 1000.00, '2025-06-01 09:00:00', 1),
(2, 102, 9, 7, 6000.00, '2025-06-02 09:30:00', 2),
(3, 103, 10, 7, 2500.00, '2025-06-03 10:00:00', 3),
(4, 104, 11, 7, 900.00, '2025-06-04 10:30:00', 4),
(5, 105, 12, 7, 4000.00, '2025-06-05 11:00:00', 5);

-- APPOINTMENT
INSERT INTO `appointment` (`appointment_id`, `patient_id`, `doctor_id`, `patient_note`, `date`, `time_slot`, `status`, `time_stamp`)
VALUES
(1, 8, 3, 'Chest pain', '2025-07-01', '09:00-09:30', 'Completed', '2025-07-01 09:00:00'),
(2, 9, 18, 'Frequent headaches', '2025-07-02', '10:00-10:30', 'Completed', '2025-07-02 10:00:00'),
(3, 10, 19, 'Skin rash', '2025-07-03', '11:00-11:30', 'Completed', '2025-07-03 11:00:00'),
(4, 11, 20, 'Child checkup', '2025-07-04', '12:00-12:30', 'Completed', '2025-07-04 12:00:00'),
(5, 12, 21, 'Fracture pain', '2025-07-05', '13:00-13:30', 'Completed', '2025-07-05 13:00:00');

-- BILLING INVOICE
INSERT INTO `billing_invoice` (`appointment_id`, `additional_fee`, `total_fee`, `claim_id`, `net_amount`, `remaining_payment_amount`, `time_stamp`)
VALUES
(1, 200.00, 2700.00, 1, 1700.00, 0.00, '2025-07-01 09:40:00'),
(2, 300.00, 8300.00, 2, 2300.00, 0.00, '2025-07-02 10:40:00'),
(3, 100.00, 3100.00, 3, 600.00, 0.00, '2025-07-03 11:40:00'),
(4, 150.00, 1350.00, 4, 450.00, 0.00, '2025-07-04 12:40:00'),
(5, 400.00, 5400.00, 5, 1400.00, 0.00, '2025-07-05 13:40:00');

-- BILLING PAYMENT
INSERT INTO `billing_payment` (`payment_id`, `invoice_id`, `branch_id`, `paid_amount`, `time_stamp`, `cashier_id`)
VALUES
(1, 1, 1, 1700.00, '2025-07-01 10:00:00', 6),
(2, 2, 2, 2300.00, '2025-07-02 11:00:00', 6),
(3, 3, 3, 600.00, '2025-07-03 12:00:00', 6),
(4, 4, 4, 450.00, '2025-07-04 13:00:00', 6),
(5, 5, 5, 1400.00, '2025-07-05 14:00:00', 6);

-- PRESCRIPTION
INSERT INTO `prescription` (`appointment_id`, `consultation_note`, `prescription_items_details`, `prescribed_at`, `is_active`)
VALUES
(1, 'Heartburn detected', 'Omeprazole 20mg daily', '2025-07-01 09:30:00', TRUE),
(2, 'Migraine episodes', 'Paracetamol 500mg as needed', '2025-07-02 10:30:00', TRUE),
(3, 'Skin allergy', 'Hydrocortisone cream 1%', '2025-07-03 11:30:00', TRUE),
(4, 'Child vitamins', 'Vitamin syrup daily', '2025-07-04 12:30:00', TRUE),
(5, 'Bone recovery', 'Calcium supplement 1000mg', '2025-07-05 13:30:00', TRUE);

-- ACTION
INSERT INTO `action` (`action_id`, `name`)
VALUES
(1, 'INSERT'),
(2, 'UPDATE'),
(3, 'DELETE'),
(4, 'LOGIN'),
(5, 'VIEW');

-- MEDICAL HISTORY
INSERT INTO `medical_history` (`medical_history_id`, `appointment_id`, `visit_date`, `diagnosis`, `symptoms`, `allergies`, `notes`, `follow_up_date`, `created_at`, `updated_at`)
VALUES
(1, 1, '2025-07-01', 'Mild gastritis', 'Chest pain', 'None', 'Monitor diet', '2025-07-15', '2025-07-01 10:00:00', '2025-07-01 10:00:00'),
(2, 2, '2025-07-02', 'Migraine', 'Headache', 'None', 'Reduce stress', '2025-07-20', '2025-07-02 11:00:00', '2025-07-02 11:00:00'),
(3, 3, '2025-07-03', 'Dermatitis', 'Rash', 'Peanuts', 'Apply cream daily', '2025-07-18', '2025-07-03 12:00:00', '2025-07-03 12:00:00'),
(4, 4, '2025-07-04', 'Normal growth', 'N/A', 'None', 'Continue healthy diet', '2025-07-25', '2025-07-04 13:00:00', '2025-07-04 13:00:00'),
(5, 5, '2025-07-05', 'Fracture healing', 'Pain', 'None', 'Physiotherapy advised', '2025-07-20', '2025-07-05 14:00:00', '2025-07-05 14:00:00');

-- TREATMENT
INSERT INTO `treatment` (`service_code`, `appointment_id`)
VALUES
(101, 1),
(102, 2),
(103, 3),
(104, 4),
(105, 5);

-- LOG
INSERT INTO `log` (`log_id`, `user_id`, `user_role`, `action_id`, `table_name`, `record_id`, `time_stamp`, `details`)
VALUES
-- Admin activities
(1, 1, 'admin', 4, 'user', 1, '2025-05-15 09:00:00', 'Admin logged in successfully'),
(2, 1, 'admin', 1, 'branch', 6, '2025-05-15 09:10:00', 'Created new branch record'),
(3, 1, 'admin', 2, 'user', 4, '2025-05-15 09:30:00', 'Approved new technician account'),
(4, 1, 'admin', 5, 'system', 1, '2025-05-15 18:00:00', 'Admin logged out'),
-- Manager activities
(5, 2, 'manager', 4, 'user', 2, '2025-06-01 08:45:00', 'Manager logged in successfully'),
(6, 2, 'manager', 1, 'employee', 10, '2025-06-01 09:10:00', 'Added new employee to HR system'),
(7, 2, 'manager', 2, 'employee', 10, '2025-06-02 11:20:00', 'Updated employee salary details'),
(8, 2, 'manager', 3, 'employee', 9, '2025-06-03 15:05:00', 'Deleted inactive employee record'),
(9, 2, 'manager', 5, 'system', 2, '2025-06-03 17:30:00', 'Manager logged out'),
-- Clerk activities
(10, 3, 'clerk', 4, 'user', 3, '2025-06-05 08:00:00', 'Clerk logged in successfully'),
(11, 3, 'clerk', 1, 'invoice', 27, '2025-06-05 08:30:00', 'Created new invoice for order #1452'),
(12, 3, 'clerk', 2, 'invoice', 27, '2025-06-05 09:00:00', 'Updated invoice total due to discount'),
(13, 3, 'clerk', 5, 'system', 3, '2025-06-05 17:45:00', 'Clerk logged out'),
-- Technician and Auditor
(14, 4, 'technician', 3, 'device', 5, '2025-06-07 14:10:00', 'Deleted faulty sensor device entry'),
(15, 5, 'auditor', 4, 'audit_log', 3, '2025-06-10 09:30:00', 'Auditor logged in to review records');


-- PATIENT INSURANCE
INSERT INTO `patient_insurance` (`patient_id`, `insurance_id`, `created_at`, `is_expired`)
VALUES
(8, 1, '2025-01-01 00:00:00', FALSE),
(9, 2, '2025-02-01 00:00:00', FALSE),
(10, 3, '2025-03-01 00:00:00', FALSE),
(11, 4, '2025-04-01 00:00:00', FALSE),
(12, 5, '2025-05-01 00:00:00', FALSE);
