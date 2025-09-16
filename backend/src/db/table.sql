USE `Project-MedSync`;

DROP TABLE IF EXISTS `action`;
DROP TABLE IF EXISTS `branch`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `speciality`;
DROP TABLE IF EXISTS `insurance`;
DROP TABLE IF EXISTS `appointment`;
DROP TABLE IF EXISTS `treatment_catelogue`;
DROP TABLE IF EXISTS `log`;
DROP TABLE IF EXISTS `user_contact`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `branch_manager`;
DROP TABLE IF EXISTS `doctor`;
DROP TABLE IF EXISTS `patient`;
DROP TABLE IF EXISTS `doctor_speciality`;
DROP TABLE IF EXISTS `patient_insurance`;
DROP TABLE IF EXISTS `insurance_claim`;
DROP TABLE IF EXISTS `medical_history`;
DROP TABLE IF EXISTS `prescription`;
DROP TABLE IF EXISTS `treatment`;
DROP TABLE IF EXISTS `billing_invoice`;
DROP TABLE IF EXISTS `billing_payment`;


CREATE Table `branch` (
    `branch_id` : BIGINT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    `name` : VARCHAR(15),
    `location` : VARCHAR(100),
    `landline_no` : VARCHAR(10),
    `created_at` : TIMESTAMP DEFAULT NOW()
);

CREATE Table `user` (
    `user_id` BIGINT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(20) UNIQUE,
    `password_hash` VARCHAR(50),
    `role` VARCHAR(15) ENUM(
        "SUPER_ADMIN", 
        "BRANCH_MANAGER", 
        "DOCTOR", 
        "ADMIN_STAFF", 
        "NURSE", 
        "RECEPTIONIST", 
        "BILLING_STAFF", 
        "INSURANCE_AGENT", 
        "PATIENT"
        ),
    `branch_id` BIGINT, 
);



