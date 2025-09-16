INSERT INTO `branch` (`name`, `location`, `landline_no`, `created_at`) 
VALUES 
('Central Branch', 'Downtown', '021-555-1234', '2025-01-01 08:00:00'),
('East Branch', 'Eastside', '021-555-5678', '2025-01-02 08:00:00'),
('West Branch', 'Westside', '021-555-9012', '2025-01-03 09:00:00'),
('North Branch', 'Northville', '021-555-3456', '2025-01-04 10:00:00'),
('South Branch', 'Southtown', '021-555-7890', '2025-01-05 11:00:00');


-- Super_Admin
INSERT INTO `user` (`username`, `password_hash`, `role`, `branch_id`) 
VALUES ('superadmin', 'hash_superadmin123', 'Super_Admin', NULL);

-- Patients
INSERT INTO `user` (`username`, `password_hash`, `role`, `branch_id`) 
VALUES 
('patient_anna', 'hash_patientanna123', 'Patient', 1),
('patient_bob', 'hash_patientbob456', 'Patient', 2),
('patient_cara', 'hash_patientcara789', 'Patient', 3),
('patient_dan', 'hash_patientdan321', 'Patient', 1),
('patient_ella', 'hash_patientella654', 'Patient', 2);

-- Branch Managers
INSERT INTO `user` (`username`, `password_hash`, `role`, `branch_id`) 
VALUES 
('manager_sam', 'hash_managersam111', 'Branch_Manager', 1),
('manager_linda', 'hash_managerlinda222', 'Branch_Manager', 2);

-- Staff
INSERT INTO `user` (`username`, `password_hash`, `role`, `branch_id`) 
VALUES 
('staff_mike', 'hash_staffmike333', 'Nurse', 1),
('staff_jane', 'hash_staffjane444', 'Receptionist', 2),
('staff_paul', 'hash_staffpaul555', 'Billing_Staff', 3);



INSERT INTO `patient` (`patient_id`, `name`, `gender`, `emergency_contact_no`, `nic`, `address`, `date_of_birth`, `blood_type`) 
VALUES
(1, 'Anna Perera', 'Female', '0711234567', '200012345678', 'Colombo 01', '1990-05-15', 'A+'),
(2, 'Bob Silva', 'Male', '0722345678', '199112345678', 'Kandy 07', '1985-11-22', 'O-'),
(3, 'Cara Fernando', 'Female', '0773456789', '200212345678', 'Galle 03', '1998-07-03', 'B+'),
(4, 'Dan Kumara', 'Male', '0764567890', '198812345678', 'Negombo 05', '1980-01-30', 'AB-'),
(5, 'Ella Jayasekara', 'Female', '0755678901', '199512345678', 'Matara 02', '1995-09-17', 'O+');


INSERT INTO `branch_manager` (`manager_id`, `name`, `monthly_salary`, `gender`) 
VALUES
(6, 'Sam Perera', 150000.00, 'Male'),
(7, 'Linda Silva', 155000.00, 'Female');


INSERT INTO `staff` (`staff_id`, `name`, `type`, `monthly_salary`, `gender`) 
VALUES
(8, 'Mike Fernando', 'Nurse', 90000.00, 'Male'),
(9, 'Jane Kumari', 'Receptionist', 75000.00, 'Female'),
(10, 'Paul Rodrigo', 'Billing_Staff', 85000.00, 'Male');


INSERT INTO `user_contact` (`contact`, `contact_type`, `is_default`, `user_id`) 
VALUES
('anna.perera@email.com', 'Email', TRUE, 1),
('0711234567', 'Phone_No', TRUE, 1),
('bob.silva@email.com', 'Email', TRUE, 2),
('0722345678', 'Phone_No', TRUE, 2),
('manager.sam@clinic.com', 'Email', TRUE, 6),
('manager.linda@clinic.com', 'Email', TRUE, 7),
('mike.fernando@clinic.com', 'Email', TRUE, 8),
('jane.kumari@clinic.com', 'Email', TRUE, 9),
('paul.rodrigo@clinic.com', 'Email', TRUE, 10);
