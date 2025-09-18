CREATE TABLE `Speciality` (
  `speciality_id` int,
  `speciality_name` varchar(20),
  `description` varchar(255),
  PRIMARY KEY (`speciality_id`)
);

CREATE TABLE `Doctor` (
  `doctor_id` int,
  `name` varchar(50),
  `fee_per_patient` numeric(8,2),
  `basic_monthly_salary` numeric(8,2),
  `gender` varchar(6),
  PRIMARY KEY (`doctor_id`)
);

CREATE TABLE `Doctor_Speciality` (
  `doctor_id` int,
  `specialiy_id` int,
  `added_at` timestamp,
  PRIMARY KEY (`doctor_id`, `specialiy_id`),
  FOREIGN KEY (`specialiy_id`)
      REFERENCES `Speciality`(`speciality_id`),
  FOREIGN KEY (`doctor_id`)
      REFERENCES `Doctor`(`doctor_id`)
);

CREATE TABLE `Insurance` (
  `insurance_id` int,
  `insurance_type` varchar(20),
  `insurance_period` varchar(20),
  `claim_percentage` numeric(2,2),
  `created_at` timestamp,
  PRIMARY KEY (`insurance_id`)
);

CREATE TABLE `Staff` (
  `staff_id` int,
  `name` varchar(50),
  `type` varchar(15),
  `monthly_salary` numeric(8,2),
  `gender` varchar(6),
  PRIMARY KEY (`staff_id`)
);

CREATE TABLE `Patient` (
  `patient_id` int,
  `name` varchar(50),
  `gender` varchar(6),
  `emergency_contact_no` varchar(10),
  `nic` varchar(12),
  `address` varchar(100),
  `date_of_birth` date,
  `blood_type` varchar(5),
  PRIMARY KEY (`patient_id`)
);

CREATE TABLE `Treatment_Catelogue` (
  `service_code` int,
  `name` varchar(50),
  `fee` numeric(8,2),
  `description` varchar(255),
  `speciality_id` int,
  PRIMARY KEY (`service_code`),
  FOREIGN KEY (`speciality_id`)
      REFERENCES `Speciality`(`speciality_id`)
);

CREATE TABLE `Insurance_Claim` (
  `claim_id` int,
  `service_code` int,
  `patient_id` int,
  `approved_by` int,
  `claimed_amount` numeric(8,2),
  `claimed_at` timestamp,
  `insurance_id` int,
  PRIMARY KEY (`claim_id`),
  FOREIGN KEY (`insurance_id`)
      REFERENCES `Insurance`(`insurance_id`),
  FOREIGN KEY (`approved_by`)
      REFERENCES `Staff`(`staff_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `Patient`(`patient_id`),
  FOREIGN KEY (`service_code`)
      REFERENCES `Treatment_Catelogue`(`service_code`)
);

CREATE TABLE `Branch` (
  `branch_id` int,
  `name` varchar(15),
  `location` varchar(100),
  `landline_no` varchar(10),
  `created_at` timestamp,
  PRIMARY KEY (`branch_id`)
);

CREATE TABLE `Billing_Invoice` (
  `appointment_id` int,
  `additional_fee` numeric(8,2),
  `total_fee` numeric(8,2),
  `claim_id` int,
  `net_amount` numeric(8,2),
  `remaining_payment_amount` numeric(8,2),
  `time_stamp` timestamp,
  PRIMARY KEY (`appointment_id`)
);

CREATE TABLE `Billing_Payment` (
  `payment_id` int,
  `invoice_id` int,
  `branch_id` int,
  `paid_amount` numeric(8,2),
  `time_stamp` timestamp,
  `cashier_id` int,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`branch_id`)
      REFERENCES `Branch`(`branch_id`),
  FOREIGN KEY (`invoice_id`)
      REFERENCES `Billing_Invoice`(`appointment_id`),
  FOREIGN KEY (`cashier_id`)
      REFERENCES `Staff`(`staff_id`)
);

CREATE TABLE `Prescription` (
  `appointment_id` int,
  `consultation_note` varchar(255),
  `prescription_items_details` Type,
  `prescribed_at` timestamp,
  `is_active` bool,
  PRIMARY KEY (`appointment_id`)
);

CREATE TABLE `Action` (
  `action_id` int,
  `name` varchar(15),
  PRIMARY KEY (`action_id`)
);

CREATE TABLE `Appointment` (
  `appointment_id` int,
  `patient_id` int,
  `doctor_id` int,
  `patient_note` varchar(255),
  `date` date,
  `time_slot` varchar(13),
  `status (Scheduled / Completed / Cancelled)` varchar(10),
  `time_stamp (for emergency walk-in)` timestamp,
  PRIMARY KEY (`appointment_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `Patient`(`patient_id`),
  FOREIGN KEY (`doctor_id`)
      REFERENCES `Doctor`(`doctor_id`)
);

CREATE TABLE `Medical_History` (
  `medical_history_id` int,
  `appointment_id` int,
  `visit_date` date,
  `diagnosis` varchar(255),
  `symptoms` varchar(255),
  `allergies` varchar(255),
  `notes` varchar(255),
  `follow_up_date` date,
  `created_at` timestamp,
  `updated_at` timestamp,
  PRIMARY KEY (`medical_history_id`),
  FOREIGN KEY (`appointment_id`)
      REFERENCES `Appointment`(`appointment_id`)
);

CREATE TABLE `treatments` (
  `service_code` int,
  `appointment_id` int,
  PRIMARY KEY (`service_code`, `appointment_id`),
  FOREIGN KEY (`appointment_id`)
      REFERENCES `Appointment`(`appointment_id`),
  FOREIGN KEY (`service_code`)
      REFERENCES `Treatment_Catelogue`(`service_code`)
);

CREATE TABLE `User` (
  `user_id` int,
  `username` varchar(20),
  `password_hash` varchar(50),
  `role` varchar(15),
  `branch_id` int,
  `is_approved` bool,
  `created_at` timestamp,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`branch_id`)
      REFERENCES `Branch`(`branch_id`)
);

CREATE TABLE `User_Contact` (
  `contact ` varchar(50),
  `contact_type` varchar(8),
  `is_default` bool,
  `user_id` int,
  PRIMARY KEY (`contact `),
  FOREIGN KEY (`user_id`)
      REFERENCES `User`(`user_id`)
);

CREATE TABLE `Branch_Manager` (
  `manager_id` int,
  `name` varchar(50),
  `monthly_salary` numeric(8,2),
  `gender` varchar(6),
  PRIMARY KEY (`manager_id`)
);

CREATE TABLE `Log` (
  `log_id` int,
  `user_id` int,
  `user_role` varchar(15),
  `action_id` int,
  `table_name` varchar(15),
  `record_id` int,
  `time_Stamp` timestamp,
  `details` varchar(255),
  PRIMARY KEY (`log_id`),
  FOREIGN KEY (`action_id`)
      REFERENCES `Action`(`action_id`),
  FOREIGN KEY (`user_id`)
      REFERENCES `User`(`user_id`)
);

CREATE TABLE `Patient_Insurance` (
  `patient_id` int,
  `insurance_id` int,
  `created_at` timestamp,
  `is_expired` bool,
  PRIMARY KEY (`patient_id`, `insurance_id`),
  FOREIGN KEY (`patient_id`)
      REFERENCES `Patient`(`patient_id`),
  FOREIGN KEY (`insurance_id`)
      REFERENCES `Insurance`(`insurance_id`)
);

