USE `Project-MedSync`;

-- child → parent drop order
DROP TABLE IF EXISTS `billing_payment`;
DROP TABLE IF EXISTS `billing_invoice`;
DROP TABLE IF EXISTS `prescription`;
DROP TABLE IF EXISTS `treatment`;
DROP TABLE IF EXISTS `medical_history`;
DROP TABLE IF EXISTS `insurance_claim`;
DROP TABLE IF EXISTS `patient_insurance`;
DROP TABLE IF EXISTS `doctor_speciality`;
DROP TABLE IF EXISTS `patient`;
DROP TABLE IF EXISTS `doctor`;
DROP TABLE IF EXISTS `branch_manager`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `user_contact`;
DROP TABLE IF EXISTS `log`;
DROP TABLE IF EXISTS `action`;
DROP TABLE IF EXISTS `appointment`;
DROP TABLE IF EXISTS `treatment_catelogue`;
DROP TABLE IF EXISTS `speciality`;
DROP TABLE IF EXISTS `insurance`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `branch`;



CREATE TABLE `branch` (
    `branch_id` BIGINT AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL UNIQUE,
    `location` VARCHAR(100) NOT NULL,
    `landline_no` VARCHAR(12) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`branch_id`)
);


CREATE TABLE `user` (
    `user_id` BIGINT AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL UNIQUE,
    `password_hash` VARCHAR(50) NOT  NULL,
    `role` ENUM(
        'Super_Admin', 
        'Branch_Manager', 
        'Doctor', 
        'Admin_Staff', 
        'Nurse', 
        'Receptionist', 
        'Billing_Staff', 
        'Insurance_Agent', 
        'Patient'
    ) NOT NULL,
    `branch_id` BIGINT NULL,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`branch_id`) REFERENCES `branch`(`branch_id`)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE Table `patient` (
    `patient_id` BIGINT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    `emergency_contact_no` VARCHAR(10) NOT NULL,
    `nic` VARCHAR(12) NULL,
    `address` VARCHAR(100) NULL,
    `date_of_birth` DATE,
    `blood_type` VARCHAR(5) NULL,    -- A+, A-, AB-, O+,....
    PRIMARY KEY(`patient_id`),
    Foreign Key (`patient_id`) REFERENCES `user`(`user_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE `branch_manager` (
    `manager_id` BIGINT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `monthly_salary` DECIMAL(8,2) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    PRIMARY KEY (`manager_id`),
    FOREIGN KEY (`manager_id`) REFERENCES `user`(`user_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE `staff` (
    `staff_id` BIGINT NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `type` ENUM(
        'Admin_Staff',
        'Nurse',
        'Receptionist',
        'Billing_Staff',
        'Insurance_Agent'
    ) NOT NULL,
    `monthly_salary` DECIMAL(8,2) NOT NULL,
    `gender` ENUM('Male','Female') NOT NULL,
    PRIMARY KEY (`staff_id`),
    FOREIGN KEY (`staff_id`) REFERENCES `user`(`user_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE `user_contact` (
    `contact` VARCHAR(50) NOT NULL,
    `contact_type` ENUM('Email','Phone_No') NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`contact`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);





