-- Active: 1760701335833@@127.0.0.1@3306@project-medsync
-- use `Project-MedSync`;
-- User model functions
DROP PROCEDURE IF EXISTS create_user;

DROP PROCEDURE IF EXISTS update_user;

DROP PROCEDURE IF EXISTS delete_user;

DROP PROCEDURE IF EXISTS get_user_by_id;

DROP PROCEDURE IF EXISTS get_user_by_username;

DROP PROCEDURE IF EXISTS get_all_users;

DROP PROCEDURE IF EXISTS get_all_active_users_count;

DROP PROCEDURE IF EXISTS get_all_deleted_users;

DROP PROCEDURE IF EXISTS get_all_deleted_users_count;

DROP PROCEDURE IF EXISTS restore_user;

-- Patient model functions
DROP PROCEDURE IF EXISTS create_patient;

DROP PROCEDURE IF EXISTS update_patient;

DROP PROCEDURE IF EXISTS discharge_patient;

DROP PROCEDURE IF EXISTS delete_patient;

DROP PROCEDURE IF EXISTS get_patient_by_id;

DROP PROCEDURE IF EXISTS get_patients_by_blood_type;

DROP PROCEDURE IF EXISTS get_patients_by_branch;

DROP PROCEDURE IF EXISTS get_all_patients;

DROP PROCEDURE IF EXISTS get_patient_count;

-- Staff model functions
DROP PROCEDURE IF EXISTS create_staff;

DROP PROCEDURE IF EXISTS update_staff;

DROP PROCEDURE IF EXISTS delete_staff;

DROP PROCEDURE IF EXISTS get_staff_by_id;

DROP PROCEDURE IF EXISTS get_staff_by_type;

DROP PROCEDURE IF EXISTS get_staff_by_type_and_branch;

DROP PROCEDURE IF EXISTS get_all_staff;

DROP PROCEDURE IF EXISTS get_staff_count;

DROP PROCEDURE IF EXISTS get_staff_by_branch_id;

-- Branch Manager model functions
DROP PROCEDURE IF EXISTS create_branch_manager;

DROP PROCEDURE IF EXISTS update_branch_manager;

DROP PROCEDURE IF EXISTS delete_branch_manager;

DROP PROCEDURE IF EXISTS get_branch_manager_by_id;

DROP PROCEDURE IF EXISTS get_branch_manager_by_branch_id;

DROP PROCEDURE IF EXISTS get_all_branch_manager;

-- Branch model functions
DROP PROCEDURE IF EXISTS create_branch;

DROP PROCEDURE IF EXISTS update_branch;

DROP PROCEDURE IF EXISTS delete_branch;

DROP PROCEDURE IF EXISTS get_branch_by_id;

DROP PROCEDURE IF EXISTS get_all_branch;

DROP PROCEDURE IF EXISTS get_branch_for_pagination;

DROP PROCEDURE IF EXISTS get_all_branch_count;

-- User_Contact model functions
DROP PROCEDURE IF EXISTS create_user_contact;

DROP PROCEDURE IF EXISTS update_user_contact;

DROP PROCEDURE IF EXISTS delete_contact;

DROP PROCEDURE IF EXISTS get_contact_details_by_contact;

DROP PROCEDURE IF EXISTS get_default_contacts_by_userID;

DROP PROCEDURE IF EXISTS get_all_contacts;

-- Logs model functions
DROP PROCEDURE IF EXISTS create_log;

DROP PROCEDURE IF EXISTS get_all_logs;

DROP PROCEDURE IF EXISTS get_logs_count;

-- Doctors model functions
DROP PROCEDURE IF EXISTS create_doctor;

DROP PROCEDURE IF EXISTS get_all_doctors;

DROP PROCEDURE IF EXISTS update_doctor_by_id;

DROP PROCEDURE IF EXISTS get_all_doctors_count;

DROP PROCEDURE IF EXISTS get_doctor_by_id;

-- speciality model functions
DROP PROCEDURE IF EXISTS create_speciality;

DROP PROCEDURE IF EXISTS update_speciality;

DROP PROCEDURE IF EXISTS get_speciality_by_id;

DROP PROCEDURE IF EXISTS get_all_specialities_pagination;

DROP PROCEDURE IF EXISTS get_all_speciality;

DROP PROCEDURE IF EXISTS get_speciality_count;

DROP PROCEDURE IF EXISTS delete_speciality;

-- doctor-speciality model functions
DROP PROCEDURE IF EXISTS link_doctor_specialty;

DROP PROCEDURE IF EXISTS get_all_doctor_speciality;

-- treatment model functions
DROP PROCEDURE IF EXISTS create_treatment;

DROP PROCEDURE IF EXISTS get_all_treatments;

DROP PROCEDURE IF EXISTS check_service_code_exists;

-- medical history model functions
DROP PROCEDURE IF EXISTS get_all_medical_histories;

DROP PROCEDURE IF EXISTS get_medical_histories_by_patient_id;

-- medication model functions
DROP PROCEDURE IF EXISTS get_all_medications;

DROP PROCEDURE IF EXISTS get_medications_by_patient_id;

-- Appointment model functions
DROP PROCEDURE IF EXISTS get_appointments_by_patient_id;

-- billing_invoice model functions
DROP PROCEDURE IF EXISTS create_billing_invoice;

DROP PROCEDURE IF EXISTS update_billing_invoice;

DROP PROCEDURE IF EXISTS delete_billing_invoice;

DROP PROCEDURE IF EXISTS get_billing_invoice_by_id;

DROP PROCEDURE IF EXISTS get_all_billing_invoices;

-- billing_payment model functions
DROP PROCEDURE IF EXISTS create_billing_payment;

DROP PROCEDURE IF EXISTS update_billing_payment;

DROP PROCEDURE IF EXISTS delete_billing_payment;

DROP PROCEDURE IF EXISTS get_billing_payment_by_id;

DROP PROCEDURE IF EXISTS get_billing_payments_by_invoice_id;

DROP PROCEDURE IF EXISTS get_all_billing_payments;

-- Drop procedure for monthly revenue
DROP PROCEDURE IF EXISTS get_monthly_revenue;

-- Drop procedure for patients count per branch
DROP PROCEDURE IF EXISTS patients_count_per_branch;

-- Drop procedure for doctors appointments (paginated)
DROP PROCEDURE IF EXISTS get_doctors_appointments;

-- Drop procedure for total appointments count (all doctors)
DROP PROCEDURE IF EXISTS get_appointments_count;

-- Drop procedure for appointments by doctor id
DROP PROCEDURE IF EXISTS get_appointments_by_doctor_id;

-- Drop procedure for appointments by doctor id count
DROP PROCEDURE IF EXISTS get_appointments_by_doctor_id_count;


DELIMITER $$

-- User model functions
CREATE PROCEDURE create_user(
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id INT,
    IN p_is_approved TINYINT(1)
)
BEGIN
    INSERT INTO `user` (username, password_hash, role, branch_id, is_approved)
    VALUES (p_username, p_password_hash, p_role, p_branch_id, p_is_approved);

    SELECT * 
    FROM `user`
    WHERE user_id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE update_user(
    IN p_id INT,
    IN p_username VARCHAR(20),
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('Super_Admin','Branch_Manager','Doctor','Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent','Patient'),
    IN p_branch_id INT,
    IN p_is_approved TINYINT(1)
)
BEGIN
    UPDATE `user`
    SET username = p_username,
        password_hash = p_password_hash,
        role = p_role,
        branch_id = p_branch_id,
        is_approved = p_is_approved
    WHERE user_id = p_id;
END$$

CREATE PROCEDURE get_user_by_id(IN p_id INT)
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.user_id = p_id AND u.is_deleted = 0;
END$$

CREATE PROCEDURE get_user_by_username(IN p_username VARCHAR(20))
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.username = p_username AND u.is_deleted = 0;
END$$

CREATE PROCEDURE get_all_users(IN user_count INT, IN start_count INT, IN in_role VARCHAR(20), IN in_branch_id INT)
BEGIN
    SELECT 
        u.user_id, 
        u.username, 
        u.password_hash, 
        u.role, 
        b.branch_id, 
        b.name as branch_name, 
        u.is_approved, 
        u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.is_deleted = 0
        AND (in_role = 'All' OR u.role = in_role)
        AND (in_branch_id = -1 OR u.branch_id = in_branch_id)
    ORDER BY u.user_id
    LIMIT user_count OFFSET start_count;
END$$

CREATE PROCEDURE get_all_active_users_count(IN in_role VARCHAR(20), IN in_branch_id INT)
BEGIN
    SELECT COUNT(user_id) AS user_count
    FROM `user`
    WHERE is_deleted = 0
        AND (in_role = 'All' OR role = in_role)
        AND (in_branch_id = -1 OR branch_id = in_branch_id);
END$$

CREATE PROCEDURE get_all_deleted_users(IN user_count INT, IN start_count INT)
BEGIN
    SELECT u.user_id, u.username, u.password_hash, u.role, b.branch_id, b.name as branch_name, u.is_approved, u.created_at
    FROM `user` u
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE u.is_deleted = 1
    ORDER BY u.user_id
    LIMIT user_count OFFSET start_count;
END$$

CREATE PROCEDURE get_all_deleted_users_count()
BEGIN
    SELECT COUNT(user_id) AS user_count
    FROM `user`
    WHERE is_deleted = 1;
END$$

CREATE PROCEDURE delete_user(IN p_id INT)
BEGIN
    UPDATE `user` 
    set is_deleted = 1 
    WHERE user_id = p_id; 
END$$

CREATE PROCEDURE restore_user(IN p_id INT)
BEGIN
    UPDATE `user` 
    set is_deleted = 0 
    WHERE user_id = p_id; 
END$$

-- Patient model functions
CREATE PROCEDURE create_patient(
    IN p_patient_id INT,
    IN p_name VARCHAR(50),
    IN p_gender ENUM('Male','Female'),
    IN p_emergency_contact_no VARCHAR(10),
    IN p_nic VARCHAR(12),
    IN p_address VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_blood_type VARCHAR(5)
)
BEGIN
    INSERT INTO `patient` (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type)
    VALUES (p_patient_id, p_name, p_gender, p_emergency_contact_no, p_nic, p_address, p_date_of_birth, p_blood_type);
END$$

CREATE PROCEDURE update_patient(
    IN p_patient_id INT,
    IN p_name VARCHAR(50),
    IN p_gender ENUM('Male','Female'),
    IN p_emergency_contact_no VARCHAR(10),
    IN p_nic VARCHAR(12),
    IN p_address VARCHAR(100),
    IN p_date_of_birth DATE,
    IN p_blood_type VARCHAR(5),
    IN p_is_ex TINYINT
)
BEGIN
    UPDATE `patient`
    SET name = p_name,
        gender = p_gender,
        emergency_contact_no = p_emergency_contact_no,
        nic = p_nic,
        address = p_address,
        date_of_birth = p_date_of_birth,
        blood_type = p_blood_type,
        is_ex_patient = p_is_ex
    WHERE patient_id = p_patient_id;
END$$

CREATE PROCEDURE discharge_patient(IN p_id INT)
BEGIN
    UPDATE `patient`
    SET is_ex_patient = 1
    WHERE patient_id = p_id;
END$$

CREATE PROCEDURE get_patient_by_id(IN p_id INT)
BEGIN
    SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
    FROM `patient`
    WHERE patient_id = p_id;
END$$

-- CREATE PROCEDURE get_patients_by_blood_type(IN p_blood VARCHAR(5), IN patient_count INT, IN count_start INT)
-- BEGIN
--     SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
--     FROM `patient`
--     WHERE blood_type = p_blood
--     ORDER BY patient_id
--     LIMIT patient_count OFFSET count_start;
-- END$$

-- CREATE PROCEDURE get_patients_by_branch(IN p_branch_id INT, IN patient_count INT, IN count_start INT, IN p_is_ex TINYINT)
-- BEGIN
--     SELECT p.patient_id, p.name, p.gender, p.emergency_contact_no, p.nic, p.address, p.date_of_birth, p.blood_type
--     FROM `patient` p
--     JOIN `user` u ON p.patient_id = u.user_id
--     WHERE u.branch_id = p_branch_id AND p.is_ex_patient = p_is_ex
--     ORDER BY patient_id
--     LIMIT patient_count OFFSET count_start;
-- END$$

CREATE PROCEDURE get_all_patients(
    IN patient_count INT, 
    IN count_start INT, 
    IN p_is_ex TINYINT, 
    IN p_branch_id INT, 
    IN p_blood VARCHAR(5),
    IN p_gender VARCHAR(6)
)
BEGIN
    SELECT 
        p.patient_id, 
        p.name, 
        p.gender, 
        p.emergency_contact_no, 
        p.nic, 
        p.address, 
        p.date_of_birth, 
        p.blood_type, 
        u.branch_id, 
        b.name as branch_name
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE p.is_ex_patient = p_is_ex
        AND (p_branch_id = -1 or u.branch_id = p_branch_id)
        AND (p_blood = 'All' or p.blood_type = p_blood)
        AND (p_gender = 'All' or p.gender = p_gender)
    ORDER BY patient_id
    LIMIT patient_count OFFSET count_start;
END$$

CREATE PROCEDURE get_patient_count(
    IN p_is_ex TINYINT, 
    IN p_branch_id INT, 
    IN p_blood VARCHAR(5),
    IN p_gender VARCHAR(6)
)
BEGIN
    SELECT COUNT(p.patient_id) AS patient_count
    FROM `patient` p
    JOIN `user` u ON p.patient_id = u.user_id
    WHERE p.is_ex_patient = p_is_ex
        AND (p_branch_id = -1 or u.branch_id = p_branch_id)
        AND (p_blood = 'All' or p.blood_type = p_blood)
        AND (p_gender = 'All' or p.gender = p_gender);
END$$

CREATE PROCEDURE delete_patient(IN p_id INT)
BEGIN
    DELETE FROM `patient` WHERE patient_id = p_id;
END$$

-- staff model functions
CREATE PROCEDURE create_staff(
    IN p_staff_id INT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_gender ENUM('Male','Female'),
    IN p_monthly_salary DECIMAL(8,2)
)
BEGIN
    INSERT INTO `staff` (staff_id, name, type, gender, monthly_salary)
    VALUES (p_staff_id, p_name, p_type, p_gender, p_monthly_salary);
END$$

CREATE PROCEDURE update_staff(
    IN p_staff_id INT,
    IN p_name VARCHAR(50),
    IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
    IN p_branch_id INT,
    IN p_gender ENUM('Male','Female'),
    IN p_monthly_salary DECIMAL(8,2)
)
BEGIN
    UPDATE `staff`
    SET name = p_name,
        type = p_type,
        gender = p_gender,
        monthly_salary = p_monthly_salary
    WHERE staff_id = p_staff_id;

    UPDATE `user`
    SET branch_id = p_branch_id
    WHERE user_id = p_staff_id;
END$$

CREATE PROCEDURE get_staff_by_id(IN p_id INT)
BEGIN
    SELECT staff_id, name, type, gender, monthly_salary
    FROM `staff`
    WHERE staff_id = p_id;
END$$

-- CREATE PROCEDURE get_staff_by_type(IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'))
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary, u.branch_id, u.name as branch_name
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE s.`type` = p_type;
-- END$$

-- CREATE PROCEDURE get_staff_by_branch_id(IN p_branch_id INT)
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE u.branch_id = p_branch_id;
-- END$$

-- CREATE PROCEDURE get_staff_by_type_and_branch(
--     IN p_type ENUM('Admin_Staff','Nurse','Receptionist','Billing_Staff','Insurance_Agent'),
--     IN p_branch_id INT
-- )
-- BEGIN
--     SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
--     FROM `staff` s
--     JOIN `user` u ON s.staff_id = u.user_id
--     WHERE u.branch_id = p_branch_id AND s.`type` = p_type;
-- END$$

CREATE PROCEDURE get_all_staff(IN staff_count INT, IN count_start INT, IN p_role VARCHAR(20), IN p_branch_id INT)
BEGIN
    SELECT s.staff_id, s.name, s.type, u.branch_id, b.name AS branch_name, s.gender, s.monthly_salary
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    LEFT JOIN `branch` b ON b.branch_id = u.branch_id
    WHERE (p_role = 'All' OR s.type = p_role)
      AND (p_branch_id = -1 OR u.branch_id = p_branch_id)
    ORDER BY s.staff_id
    LIMIT staff_count OFFSET count_start;
END$$

CREATE PROCEDURE get_staff_count(IN p_role VARCHAR(20), IN p_branch_id INT)
BEGIN
    SELECT COUNT(s.staff_id) AS staff_count
    FROM `staff` s
    JOIN `user` u ON s.staff_id = u.user_id
    WHERE (p_role = 'All' OR s.type = p_role)
      AND (p_branch_id = -1 OR u.branch_id = p_branch_id);
END$$

CREATE PROCEDURE delete_staff(IN p_id INT)
BEGIN
    DELETE FROM `staff` WHERE staff_id = p_id;
END$$

-- branch manager model functions
CREATE PROCEDURE create_branch_manager(
    IN p_manager_id INT,
    IN p_name VARCHAR(50),
    IN p_monthly_salary DECIMAL(8,2),
    IN p_gender ENUM('Male','Female')
)
BEGIN
    INSERT INTO `branch_manager` (manager_id, name, monthly_salary, gender)
    VALUES (p_manager_id, p_name, p_monthly_salary, p_gender);
END$$

CREATE PROCEDURE update_branch_manager(
    IN p_manager_id INT,
    IN p_name VARCHAR(50),
    IN p_monthly_salary DECIMAL(8,2),
    IN p_gender ENUM('Male','Female')
)
BEGIN
    UPDATE `branch_manager`
    SET name = p_name,
        monthly_salary = p_monthly_salary,
        gender = p_gender
    WHERE manager_id = p_manager_id;
END$$

CREATE PROCEDURE get_branch_manager_by_id(IN p_id INT)
BEGIN
    SELECT manager_id, name, monthly_salary, gender
    FROM `branch_manager`
    WHERE manager_id = p_id;
END$$

CREATE PROCEDURE get_branch_manager_by_branch_id(IN p_branch_id INT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    WHERE u.branch_id = p_branch_id;
END$$

CREATE PROCEDURE get_all_branch_manager(IN staff_count INT, IN count_start INT)
BEGIN
    SELECT b.manager_id, b.name, b.monthly_salary, b.gender
    FROM `branch_manager` b
    JOIN `user` u ON u.user_id = b.manager_id
    ORDER BY b.manager_id
    LIMIT staff_count OFFSET count_start;
END$$

CREATE PROCEDURE delete_branch_manager(IN p_id INT)
BEGIN
    DELETE FROM `branch_manager` WHERE manager_id = p_id;
END$$

-- branch model functions
CREATE PROCEDURE create_branch(
    IN p_name VARCHAR(15),
    IN p_location VARCHAR(100),
    IN p_landline_no VARCHAR(12)
)
BEGIN
    INSERT INTO `branch` (name, location, landline_no)
    VALUES (p_name, p_location, p_landline_no);
END$$

CREATE PROCEDURE update_branch(
    IN p_branch_id INT,
    IN p_name VARCHAR(15),
    IN p_location VARCHAR(100),
    IN p_landline_no VARCHAR(12)
)
BEGIN
    UPDATE `branch`
    SET name = p_name,
        location = p_location,
        landline_no = p_landline_no
    WHERE branch_id = p_branch_id;
END$$

CREATE PROCEDURE get_branch_by_id(IN p_branch_id INT)
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    WHERE branch_id = p_branch_id;
END$$

CREATE PROCEDURE get_branch_for_pagination(IN branch_count INT, IN count_start INT)
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    ORDER BY branch_id
    LIMIT branch_count OFFSET count_start;
END$$

CREATE PROCEDURE get_all_branch()
BEGIN
    SELECT branch_id, name, location, landline_no, created_at
    FROM `branch`
    ORDER BY branch_id;
END$$

CREATE PROCEDURE get_all_branch_count()
BEGIN
    SELECT COUNT(branch_id) AS branch_count
    FROM `branch`;
END$$

CREATE PROCEDURE delete_branch(IN p_id INT)
BEGIN
    DELETE FROM `branch` WHERE branch_id = p_id;
END$$

-- user contact model functions
CREATE PROCEDURE create_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id INT
)
BEGIN
    INSERT INTO `user_contact` (contact, contact_type, is_default, user_id)
    VALUES (p_contact, p_contact_type, p_is_default, p_user_id);
END$$

CREATE PROCEDURE update_user_contact(
    IN p_contact VARCHAR(50),
    IN p_contact_type ENUM('Email','Phone_No'),
    IN p_is_default TINYINT(1),
    IN p_user_id INT
)
BEGIN
    UPDATE `user_contact`
    SET contact_type = p_contact_type,
        is_default = p_is_default,
        user_id = p_user_id
    WHERE contact = p_contact;
END$$

CREATE PROCEDURE get_contact_details_by_contact(IN p_contact VARCHAR(50))
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE contact = p_contact;
END$$

CREATE PROCEDURE get_default_contacts_by_userID(IN p_userID INT)
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    WHERE user_id = p_userID AND is_default = 1;
END$$

CREATE PROCEDURE get_all_contacts()
BEGIN
    SELECT contact, contact_type, is_default, user_id
    FROM `user_contact`
    ORDER BY user_id,contact_type,is_default;
END$$

CREATE PROCEDURE delete_contact(IN p_contact VARCHAR(50))
BEGIN
    DELETE FROM `user_contact` WHERE contact = p_contact;
END$$

-- Log model functions
CREATE PROCEDURE create_log(
    IN p_user_id INT,
    IN p_user_role VARCHAR(15),
    IN p_action_id INT,
    IN p_table_name VARCHAR(255),
    IN p_record_id INT,
    IN p_details VARCHAR(255)
)
BEGIN
    INSERT INTO `log` (user_id, user_role, action_id, table_name, record_id, details)
    VALUES (p_user_id, p_user_role, p_action_id, p_table_name, p_record_id, p_details);
END$$

CREATE PROCEDURE get_all_logs(
    IN log_count INT, 
    IN log_offset INT
)
BEGIN
    SELECT l.log_id, l.user_id, u.username, l.user_role, a.name AS action, l.table_name, l.record_id, l.time_stamp, l.details
    FROM `log` l
    LEFT JOIN `action` a ON l.action_id = a.action_id
    LEFT JOIN `user` u ON u.user_id = l.user_id
    ORDER BY l.log_id DESC
    LIMIT log_count OFFSET log_offset;
END$$

CREATE PROCEDURE get_logs_count()
BEGIN
    SELECT COUNT(log_id) AS log_count
    FROM `log`;
END$$

-- doctor model functions
CREATE PROCEDURE create_doctor(
    IN p_user_id INT,
    IN p_name VARCHAR(50),
    IN p_gender VARCHAR(6),
    IN p_fee_per_patient numeric(8,2),
    IN p_monthly_salary numeric(8,2)
)
BEGIN
    INSERT INTO `doctor` (user_id, name, gender, fee_per_patient, monthly_salary)
    VALUES (p_user_id, p_name, p_gender, p_fee_per_patient, p_monthly_salary);
END$$

CREATE PROCEDURE update_doctor_by_id(
    IN p_user_id INT,
    IN p_name VARCHAR(50),
    IN p_gender VARCHAR(6),
    IN p_branch_id INT,
    IN p_fee_per_patient numeric(8,2),
    IN p_monthly_salary numeric(8,2)
)
BEGIN
    UPDATE `doctor`
    SET name = p_name,
        gender = p_type,
        gender = p_gender,
        fee_per_patient = p_fee_per_patient,
        basic_monthly_salary = p_monthly_salary
    WHERE doctor_id = p_user_id;

    UPDATE `user`
    SET branch_id = p_branch_id
    WHERE user_id = p_staff_id;
END$$

CREATE PROCEDURE get_doctor_by_id(IN p_id INT)
BEGIN
    SELECT d.doctor_id, d.name, d.gender, b.branch_id, b.name AS branch_name, d.fee_per_patient, d.basic_monthly_salary
    FROM `doctor` d
    LEFT JOIN `user` u ON d.doctor_id = u.user_id
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE d.doctor_id = p_id;
END$$

CREATE PROCEDURE get_all_doctors(
    IN doc_count INT, 
    IN doc_offset INT,
    IN doc_branch INT
)
BEGIN
    SELECT d.doctor_id, d.name, d.gender, b.branch_id, b.name AS branch_name, d.fee_per_patient, d.basic_monthly_salary
    FROM `doctor` d
    LEFT JOIN `user` u ON d.doctor_id = u.user_id
    LEFT JOIN `branch` b ON u.branch_id = b.branch_id
    WHERE (doc_branch = -1 OR b.branch_id = doc_branch)
    ORDER BY d.doctor_id
    LIMIT doc_count OFFSET doc_offset;
END$$

CREATE PROCEDURE get_all_doctors_count(IN doc_branch INT)
BEGIN
    SELECT COUNT(*) AS doctor_count
    FROM `user` u
    WHERE u.role = 'Doctor'
        AND (doc_branch = -1 OR u.branch_id = doc_branch);
END$$

-- Speciality model functions
CREATE PROCEDURE create_speciality(
    IN p_speciality_name VARCHAR(20),
    IN p_description VARCHAR(255)
)
BEGIN
    INSERT INTO `speciality` (speciality_name, description)
    VALUES (p_speciality_name, p_description);
    SELECT * FROM `speciality` WHERE speciality_id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE update_speciality(
    IN p_speciality_id INT,
    IN p_speciality_name VARCHAR(20),
    IN p_description VARCHAR(255)
)
BEGIN
    UPDATE `speciality`
    SET speciality_name = p_speciality_name,
        description = p_description
    WHERE speciality_id = p_speciality_id;
END$$

CREATE PROCEDURE get_speciality_by_id(IN p_speciality_id INT)
BEGIN
    SELECT speciality_id, speciality_name, description
    FROM `speciality`
    WHERE speciality_id = p_speciality_id;
END$$

CREATE PROCEDURE get_all_specialities_pagination(
    IN speciality_count INT,
    IN count_start INT
)
BEGIN
    SELECT speciality_id, speciality_name, description
    FROM `speciality`
    ORDER BY speciality_id
    LIMIT speciality_count OFFSET count_start;
END$$

CREATE PROCEDURE get_all_speciality()
BEGIN
    SELECT speciality_id, speciality_name, description
    FROM `speciality`
    ORDER BY speciality_id;
END$$

CREATE PROCEDURE get_speciality_count()
BEGIN
    SELECT COUNT(speciality_id) AS speciality_count
    FROM `speciality`;
END$$

CREATE PROCEDURE delete_speciality(IN p_speciality_id INT)
BEGIN
    DELETE FROM `speciality` WHERE speciality_id = p_speciality_id;
END$$

-- Doctor-Speciality model functions
CREATE PROCEDURE link_doctor_specialty(
    IN p_doctor_id INT,
    IN p_speciality_id INT
)
BEGIN
    INSERT INTO `doctor_speciality` (doctor_id, speciality_id)
    VALUES (p_doctor_id, p_speciality_id);
END$$

CREATE PROCEDURE get_all_doctor_speciality()
BEGIN
    SELECT d.doctor_id, d.name AS doctor_name, s.speciality_id, s.speciality_name, s.description, ds.added_at
    FROM `doctor_speciality` ds
    LEFT JOIN `doctor` d ON ds.doctor_id = d.doctor_id
    LEFT JOIN `speciality` s ON ds.speciality_id = s.speciality_id
    ORDER BY d.doctor_id, s.speciality_name;
END$$

-- treatment model functions
CREATE PROCEDURE get_all_treatments()
BEGIN
  select tc.service_code, tc.name, tc.fee , tc.description, tc.speciality_id, speciality_name 
from treatment_catelogue as tc left outer join speciality as s on tc.speciality_id = s.speciality_id
  ORDER BY service_code;
END$$

CREATE PROCEDURE check_service_code_exists(IN p_code INT)
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM treatment_catelogue WHERE service_code = p_code
  ) AS exists_flag;
END$$

CREATE PROCEDURE create_treatment(
  IN p_service_code INT,
  IN p_name         VARCHAR(50),
  IN p_fee          DECIMAL(8,2),
  IN p_description  VARCHAR(255),
  IN p_speciality_id INT
)
BEGIN
  INSERT INTO treatment_catelogue(service_code, name, fee, description, speciality_id)
  VALUES (p_service_code, p_name, p_fee, p_description, p_speciality_id);

  SELECT
    service_code, name, fee, description, speciality_id, NOW() AS created_at
  FROM treatment_catelogue
  WHERE service_code = p_service_code;
END$$

-- medical history model functions
CREATE PROCEDURE get_all_medical_histories()
BEGIN
    SELECT * FROM `medical_history`;
END$$

CREATE PROCEDURE get_medical_histories_by_patient_id(IN p_patient_id INT)
BEGIN
  SELECT pat.patient_id, mh.appointment_id, visit_date, diagnosis, symptoms, allergies, notes, follow_up_date, created_at, updated_at
  FROM medical_history AS mh
  JOIN appointment as a ON mh.appointment_id = a.appointment_id
  JOIN patient      AS pat ON a.patient_id     = pat.patient_id
  WHERE a.patient_id = p_patient_id
  ORDER BY mh.created_at DESC;
END$$

-- medication model functions
CREATE PROCEDURE get_all_medications()
BEGIN
    SELECT appointment_id, consultation_note, prescription_items_details, prescribed_at, is_active, patient_id, name
    FROM prescription
    NATURAL JOIN appointment
    NATURAL JOIN patient;
END$$

CREATE PROCEDURE get_medications_by_patient_id(IN p_patient_id INT)
BEGIN
  SELECT p.appointment_id, a.patient_id, pat.name AS name, p.consultation_note AS consultation_note, p.prescription_items_details, p.prescribed_at, p.is_active
  FROM prescription AS p
  JOIN appointment  AS a   ON p.appointment_id = a.appointment_id
  JOIN patient      AS pat ON a.patient_id     = pat.patient_id
  WHERE a.patient_id = p_patient_id
  ORDER BY p.prescribed_at DESC;
END$$

-- Appointment model functions
CREATE PROCEDURE get_appointments_by_patient_id(IN p_patient_id INT)
BEGIN
	select ap.appointment_id , ap.doctor_id, ap.date, ap.time_slot, ap.status, d.name
	from appointment as ap join doctor as d
	on ap.doctor_id= d.doctor_id
	where ap.patient_id = p_patient_id
	ORDER BY ap.date DESC;
END$$

-- billing_invoice model functions
CREATE PROCEDURE create_billing_invoice(
    IN p_appointment_id INT,
    IN p_additional_fee DECIMAL(10,2),
    IN p_total_fee DECIMAL(10,2),
    IN p_claim_id INT,
    IN p_net_amount DECIMAL(10,2),
    IN p_remaining_payment_amount DECIMAL(10,2)
)
BEGIN
    INSERT INTO `billing_invoice` 
    (appointment_id, additional_fee, total_fee, claim_id, net_amount, remaining_payment_amount, time_stamp)
    VALUES
    (p_appointment_id, p_additional_fee, p_total_fee, p_claim_id, p_net_amount, p_remaining_payment_amount, NOW());
END$$

CREATE PROCEDURE update_billing_invoice(
    IN p_invoice_id INT,
    IN p_additional_fee DECIMAL(10,2),
    IN p_total_fee DECIMAL(10,2),
    IN p_net_amount DECIMAL(10,2),
    IN p_remaining_payment_amount DECIMAL(10,2)
)
BEGIN
    UPDATE `billing_invoice`
    SET additional_fee = p_additional_fee,
        total_fee = p_total_fee,
        net_amount = p_net_amount,
        remaining_payment_amount = p_remaining_payment_amount,
        time_stamp = NOW()
    WHERE id = p_invoice_id;
END$$

CREATE PROCEDURE delete_billing_invoice(IN p_invoice_id INT)
BEGIN
    DELETE FROM `billing_invoice` WHERE id = p_invoice_id;
END$$

CREATE PROCEDURE get_billing_invoice_by_id(IN p_invoice_id INT)
BEGIN
    SELECT * FROM `billing_invoice` WHERE id = p_invoice_id;
END$$

CREATE PROCEDURE get_all_billing_invoices()
BEGIN
    SELECT * FROM `billing_invoice`;
END$$

-- billing_payment model functions
CREATE PROCEDURE create_billing_payment(
    IN p_payment_id INT,
    IN p_invoice_id INT,
    IN p_branch_id INT,
    IN p_paid_amount NUMERIC(8,2),
    IN p_cashier_id INT
)
BEGIN
    INSERT INTO `billing_payment`
    (payment_id, invoice_id, branch_id, paid_amount, cashier_id, time_stamp)
    VALUES
    (p_payment_id, p_invoice_id, p_branch_id, p_paid_amount, p_cashier_id, NOW());
END$$

CREATE PROCEDURE update_billing_payment(
    IN p_payment_id INT,
    IN p_paid_amount NUMERIC(8,2)
)
BEGIN
    UPDATE `billing_payment`
    SET paid_amount = p_paid_amount,
        time_stamp = NOW()
    WHERE payment_id = p_payment_id;
END$$

CREATE PROCEDURE delete_billing_payment(IN p_payment_id INT)
BEGIN
    DELETE FROM `billing_payment` WHERE payment_id = p_payment_id;
END$$

CREATE PROCEDURE get_billing_payment_by_id(IN p_payment_id INT)
BEGIN
    SELECT * FROM `billing_payment` WHERE payment_id = p_payment_id;
END$$

CREATE PROCEDURE get_billing_payments_by_invoice_id(IN p_invoice_id INT)
BEGIN
    SELECT * FROM `billing_payment` WHERE invoice_id = p_invoice_id;
END$$

CREATE PROCEDURE get_all_billing_payments()
BEGIN
    SELECT * FROM `billing_payment`;
END$$

-- get total patients count
CREATE PROCEDURE get_total_patients_count(
    OUT total_count INT
)
BEGIN
    SELECT COUNT(*) INTO total_count FROM patient;
END$$

-- get total staff count
CREATE PROCEDURE get_total_staffs_count(
    OUT staffs_count INT
)
BEGIN
    SELECT COUNT(*) INTO staffs_count FROM staff;
END$$


-- proc for getting appointments based on month
DROP PROCEDURE IF EXISTS get_monthly_appointment_counts;


CREATE PROCEDURE get_monthly_appointment_counts(
  IN in_start DATE,                 -- e.g. '2025-01-01'
  IN in_end   DATE,                 -- e.g. '2025-12-31'
  IN in_status VARCHAR(50)          -- NULL to ignore, or 'Completed'
)
BEGIN
  -- Normalize to month starts
  SET in_start = DATE_FORMAT(in_start, '%Y-%m-01');
  SET in_end   = DATE_FORMAT(in_end,   '%Y-%m-01');

  WITH RECURSIVE months AS (
    SELECT in_start AS month_start
    UNION ALL
    SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
    FROM months
    WHERE month_start < in_end
  ),
  agg AS (
    SELECT
      DATE_FORMAT(`date`, '%Y-%m-01') AS month_start,
      COUNT(*) AS cnt
    FROM appointment
    WHERE `date` >= in_start
      AND `date` < DATE_ADD(in_end, INTERVAL 1 MONTH)  -- inclusive end month
      AND (in_status IS NULL OR status = in_status)
    GROUP BY month_start
  )
  SELECT
    DATE_FORMAT(m.month_start, '%Y-%m') AS month,
    COALESCE(a.cnt, 0) AS count
    FROM months m
    LEFT JOIN agg a USING (month_start)
    ORDER BY m.month_start;
    END$$

-- proc for getiing monthy revenue
CREATE PROCEDURE get_monthly_revenue(
  IN in_start DATE,                 -- e.g. '2025-01-01'
  IN in_end   DATE                  -- e.g. '2025-12-31'
)
BEGIN
  -- Normalize to month starts
  SET in_start = DATE_FORMAT(in_start, '%Y-%m-01');
  SET in_end   = DATE_FORMAT(in_end,   '%Y-%m-01');

  WITH RECURSIVE months AS (
  SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 12 MONTH), '%Y-%m-01') AS month_start
  UNION ALL
  SELECT DATE_FORMAT(DATE_ADD(month_start, INTERVAL 1 MONTH), '%Y-%m-01')
  FROM months
  WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
),
agg AS (
  SELECT DATE_FORMAT(`time_stamp`, '%Y-%m-01') AS month_start, sum(paid_amount) AS rev
  FROM billing_payment
  --   AND `date` >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  GROUP BY DATE_FORMAT(`time_stamp`, '%Y-%m-01')
)
SELECT
  DATE_FORMAT(m.month_start, '%Y-%m') AS month,
  COALESCE(a.rev, 0) AS revenue
    FROM months m
    LEFT JOIN agg a USING (month_start)
    ORDER BY m.month_start;

END$$

-- proC FOR patients count per branch
CREATE PROCEDURE patients_count_per_branch()

    BEGIN
    SELECT b.name AS branch, COUNT(u.user_id) AS total_patients
    FROM user AS u
    JOIN branch AS b ON u.branch_id = b.branch_id
    WHERE u.role = 'Patient'
    GROUP BY b.name;

END$$


-- doctors  appointment
CREATE PROCEDURE get_doctors_appointments(IN appt_count INT,
    IN count_start INT)

BEGIN
	SELECT d.name, a.appointment_id, a.doctor_id, a.date, a.time_slot, a.status
    from appointment as a natural join doctor as d
    where a.doctor_id =  d.doctor_id
    order by a.date desc
    limit appt_count OFFSET count_start;
END$$

-- proc for getting doctors appointments count
CREATE PROCEDURE get_appointments_count()

BEGIN
	SELECT count(*) AS total_count
    from appointment ;
    
END$$

-- proc for getting doctors appointments by doctor id
create procedure get_appointments_by_doctor_id( IN p_id INT)
begin 
	select appointment_id,patient.name, patient_note, date, time_slot, status, count(*) as total from
	doctor natural join appointment join patient on appointment.patient_id = patient.patient_id
	where doctor.doctor_id=p_id and doctor.doctor_id = appointment.doctor_id;
end $$

-- proc for getting doctors appointments by doctor id count
create procedure get_appointments_by_doctor_id_count( IN p_id INT)
begin 
	   SELECT COUNT(*) AS total_appointments
  FROM appointment
  WHERE doctor_id = p_id;

end $$


-- ============================================================================
-- APPOINTMENT MANAGEMENT PROCEDURES
-- ============================================================================

-- Create new appointment (for scheduling)
DROP PROCEDURE IF EXISTS create_appointment$$
CREATE PROCEDURE create_appointment(
    IN p_appointment_id INT,
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_patient_note VARCHAR(255),
    IN p_date DATE,
    IN p_time_slot VARCHAR(13),
    IN p_status VARCHAR(10)
)
BEGIN
    -- Check if doctor has overlapping appointment
    DECLARE overlap_count INT;
    
    SELECT COUNT(*) INTO overlap_count
    FROM appointment
    WHERE doctor_id = p_doctor_id
      AND date = p_date
      AND time_slot = p_time_slot
      AND status IN ('Scheduled', 'Completed');
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor already has an appointment in this time slot';
    END IF;
    
    INSERT INTO appointment (
        appointment_id, patient_id, doctor_id, patient_note, 
        date, time_slot, status, time_stamp
    )
    VALUES (
        p_appointment_id, p_patient_id, p_doctor_id, p_patient_note,
        p_date, p_time_slot, p_status, NOW()
    );
    
    SELECT * FROM appointment WHERE appointment_id = p_appointment_id;
END$$

-- Update appointment status (for completing/cancelling)
DROP PROCEDURE IF EXISTS update_appointment_status$$
CREATE PROCEDURE update_appointment_status(
    IN p_appointment_id INT,
    IN p_status VARCHAR(10)
)
BEGIN
    UPDATE appointment
    SET status = p_status
    WHERE appointment_id = p_appointment_id;
    
    SELECT * FROM appointment WHERE appointment_id = p_appointment_id;
END$$

-- Reschedule appointment
DROP PROCEDURE IF EXISTS reschedule_appointment$$
CREATE PROCEDURE reschedule_appointment(
    IN p_appointment_id INT,
    IN p_new_date DATE,
    IN p_new_time_slot VARCHAR(13)
)
BEGIN
    DECLARE v_doctor_id INT;
    DECLARE overlap_count INT;
    
    -- Get doctor_id for the appointment
    SELECT doctor_id INTO v_doctor_id
    FROM appointment
    WHERE appointment_id = p_appointment_id;
    
    -- Check for overlapping appointments
    SELECT COUNT(*) INTO overlap_count
    FROM appointment
    WHERE doctor_id = v_doctor_id
      AND date = p_new_date
      AND time_slot = p_new_time_slot
      AND appointment_id != p_appointment_id
      AND status IN ('Scheduled', 'Completed');
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor already has an appointment in this time slot';
    END IF;
    
    UPDATE appointment
    SET date = p_new_date,
        time_slot = p_new_time_slot,
        time_stamp = NOW()
    WHERE appointment_id = p_appointment_id;
    
    SELECT * FROM appointment WHERE appointment_id = p_appointment_id;
END$$

-- Get appointment by ID
DROP PROCEDURE IF EXISTS get_appointment_by_id$$
CREATE PROCEDURE get_appointment_by_id(IN p_appointment_id INT)
BEGIN
    SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name,
        b.name as branch_name
    FROM appointment a
    JOIN patient p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    JOIN user u ON d.doctor_id = u.user_id
    JOIN branch b ON u.branch_id = b.branch_id
    WHERE a.appointment_id = p_appointment_id;
END$$

-- Get available time slots for a doctor on a specific date
DROP PROCEDURE IF EXISTS get_available_time_slots$$
CREATE PROCEDURE get_available_time_slots(
    IN p_doctor_id INT,
    IN p_date DATE
)
BEGIN
    -- Return booked time slots
    SELECT time_slot
    FROM appointment
    WHERE doctor_id = p_doctor_id
      AND date = p_date
      AND status IN ('Scheduled', 'Completed');
END$$

-- ============================================================================
-- TREATMENT AND CONSULTATION PROCEDURES
-- ============================================================================

-- Record treatment for completed appointment
DROP PROCEDURE IF EXISTS record_treatment$$
CREATE PROCEDURE record_treatment(
    IN p_appointment_id INT,
    IN p_service_code INT
)
BEGIN
    INSERT INTO treatment (service_code, appointment_id)
    VALUES (p_service_code, p_appointment_id);
END$$

-- Get treatments for an appointment
DROP PROCEDURE IF EXISTS get_treatments_by_appointment$$
CREATE PROCEDURE get_treatments_by_appointment(IN p_appointment_id INT)
BEGIN
    SELECT 
        t.service_code,
        tc.name,
        tc.fee,
        tc.description
    FROM treatment t
    JOIN treatment_catelogue tc ON t.service_code = tc.service_code
    WHERE t.appointment_id = p_appointment_id;
END$$

-- Create prescription
DROP PROCEDURE IF EXISTS create_prescription$$
CREATE PROCEDURE create_prescription(
    IN p_appointment_id INT,
    IN p_consultation_note VARCHAR(255),
    IN p_prescription_items VARCHAR(255)
)
BEGIN
    INSERT INTO prescription (
        appointment_id, consultation_note, 
        prescription_items_details, prescribed_at, is_active
    )
    VALUES (
        p_appointment_id, p_consultation_note,
        p_prescription_items, NOW(), TRUE
    )
    ON DUPLICATE KEY UPDATE
        consultation_note = p_consultation_note,
        prescription_items_details = p_prescription_items,
        prescribed_at = NOW();
    
    SELECT * FROM prescription WHERE appointment_id = p_appointment_id;
END$$

-- Get prescription by appointment
DROP PROCEDURE IF EXISTS get_prescription_by_appointment$$
CREATE PROCEDURE get_prescription_by_appointment(IN p_appointment_id INT)
BEGIN
    SELECT * FROM prescription WHERE appointment_id = p_appointment_id;
END$$

-- ============================================================================
-- BILLING AND INVOICE PROCEDURES
-- ============================================================================

-- Create billing invoice
DROP PROCEDURE IF EXISTS create_invoice$$
CREATE PROCEDURE create_invoice(
    IN p_appointment_id INT,
    IN p_additional_fee DECIMAL(8,2),
    IN p_claim_id INT
)
BEGIN
    DECLARE v_total_fee DECIMAL(8,2);
    DECLARE v_claimed_amount DECIMAL(8,2);
    DECLARE v_net_amount DECIMAL(8,2);
    
    -- Calculate total fee from treatments
    SELECT COALESCE(SUM(tc.fee), 0) INTO v_total_fee
    FROM treatment t
    JOIN treatment_catelogue tc ON t.service_code = tc.service_code
    WHERE t.appointment_id = p_appointment_id;
    
    -- Add additional fee
    SET v_total_fee = v_total_fee + COALESCE(p_additional_fee, 0);
    
    -- Get claimed amount if insurance claim exists
    IF p_claim_id IS NOT NULL THEN
        SELECT COALESCE(claimed_amount, 0) INTO v_claimed_amount
        FROM insurance_claim
        WHERE claim_id = p_claim_id;
    ELSE
        SET v_claimed_amount = 0;
    END IF;
    
    -- Calculate net amount
    SET v_net_amount = v_total_fee - v_claimed_amount;
    
    INSERT INTO billing_invoice (
        appointment_id, additional_fee, total_fee, 
        claim_id, net_amount, remaining_payment_amount, time_stamp
    )
    VALUES (
        p_appointment_id, p_additional_fee, v_total_fee,
        p_claim_id, v_net_amount, v_net_amount, NOW()
    );
    
    SELECT * FROM billing_invoice WHERE appointment_id = p_appointment_id;
END$$

-- Record payment (full or partial)
DROP PROCEDURE IF EXISTS record_payment$$
CREATE PROCEDURE record_payment(
    IN p_payment_id INT,
    IN p_invoice_id INT,
    IN p_branch_id INT,
    IN p_paid_amount DECIMAL(8,2),
    IN p_cashier_id INT
)
BEGIN
    DECLARE v_remaining DECIMAL(8,2);
    
    -- Insert payment
    INSERT INTO billing_payment (
        payment_id, invoice_id, branch_id, 
        paid_amount, time_stamp, cashier_id
    )
    VALUES (
        p_payment_id, p_invoice_id, p_branch_id,
        p_paid_amount, NOW(), p_cashier_id
    );
    
    -- Update remaining amount in invoice
    SELECT remaining_payment_amount - p_paid_amount INTO v_remaining
    FROM billing_invoice
    WHERE appointment_id = p_invoice_id;
    
    UPDATE billing_invoice
    SET remaining_payment_amount = v_remaining
    WHERE appointment_id = p_invoice_id;
    
    SELECT * FROM billing_payment WHERE payment_id = p_payment_id;
END$$

-- Get invoice by appointment
DROP PROCEDURE IF EXISTS get_invoice_by_appointment$$
CREATE PROCEDURE get_invoice_by_appointment(IN p_appointment_id INT)
BEGIN
    SELECT 
        bi.*,
        a.patient_id,
        p.name as patient_name,
        a.doctor_id,
        d.name as doctor_name,
        a.date as appointment_date
    FROM billing_invoice bi
    JOIN appointment a ON bi.appointment_id = a.appointment_id
    JOIN patient p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    WHERE bi.appointment_id = p_appointment_id;
END$$

-- Get payments for an invoice
DROP PROCEDURE IF EXISTS get_payments_by_invoice$$
CREATE PROCEDURE get_payments_by_invoice(IN p_invoice_id INT)
BEGIN
    SELECT 
        bp.*,
        s.name as cashier_name,
        b.name as branch_name
    FROM billing_payment bp
    JOIN staff s ON bp.cashier_id = s.staff_id
    JOIN branch b ON bp.branch_id = b.branch_id
    WHERE bp.invoice_id = p_invoice_id
    ORDER BY bp.time_stamp DESC;
END$$

-- Get outstanding balance for a patient
DROP PROCEDURE IF EXISTS get_patient_outstanding_balance$$
CREATE PROCEDURE get_patient_outstanding_balance(IN p_patient_id INT)
BEGIN
    SELECT 
        SUM(bi.remaining_payment_amount) as total_outstanding
    FROM billing_invoice bi
    JOIN appointment a ON bi.appointment_id = a.appointment_id
    WHERE a.patient_id = p_patient_id
      AND bi.remaining_payment_amount > 0;
END$$

-- ============================================================================
-- INSURANCE PROCEDURES
-- ============================================================================

-- Create insurance policy
DROP PROCEDURE IF EXISTS create_insurance$$
CREATE PROCEDURE create_insurance(
    IN p_insurance_id INT,
    IN p_insurance_type VARCHAR(20),
    IN p_insurance_period VARCHAR(20),
    IN p_claim_percentage DECIMAL(2,2)
)
BEGIN
    INSERT INTO insurance (
        insurance_id, insurance_type, insurance_period,
        claim_percentage, created_at
    )
    VALUES (
        p_insurance_id, p_insurance_type, p_insurance_period,
        p_claim_percentage, NOW()
    );
    
    SELECT * FROM insurance WHERE insurance_id = p_insurance_id;
END$$

-- Link patient to insurance
DROP PROCEDURE IF EXISTS link_patient_insurance$$
CREATE PROCEDURE link_patient_insurance(
    IN p_patient_id INT,
    IN p_insurance_id INT
)
BEGIN
    INSERT INTO patient_insurance (patient_id, insurance_id, created_at, is_expired)
    VALUES (p_patient_id, p_insurance_id, NOW(), FALSE);
END$$

-- Get patient insurance policies
DROP PROCEDURE IF EXISTS get_patient_insurance$$
CREATE PROCEDURE get_patient_insurance(IN p_patient_id INT)
BEGIN
    SELECT 
        i.*,
        pi.created_at as policy_start_date,
        pi.is_expired
    FROM patient_insurance pi
    JOIN insurance i ON pi.insurance_id = i.insurance_id
    WHERE pi.patient_id = p_patient_id;
END$$

-- Create insurance claim
DROP PROCEDURE IF EXISTS create_insurance_claim$$
CREATE PROCEDURE create_insurance_claim(
    IN p_claim_id INT,
    IN p_service_code INT,
    IN p_patient_id INT,
    IN p_approved_by INT,
    IN p_insurance_id INT
)
BEGIN
    DECLARE v_service_fee DECIMAL(8,2);
    DECLARE v_claim_percentage DECIMAL(2,2);
    DECLARE v_claimed_amount DECIMAL(8,2);
    
    -- Get service fee
    SELECT fee INTO v_service_fee
    FROM treatment_catelogue
    WHERE service_code = p_service_code;
    
    -- Get claim percentage
    SELECT claim_percentage INTO v_claim_percentage
    FROM insurance
    WHERE insurance_id = p_insurance_id;
    
    -- Calculate claimed amount
    SET v_claimed_amount = v_service_fee * v_claim_percentage;
    
    INSERT INTO insurance_claim (
        claim_id, service_code, patient_id, approved_by,
        claimed_amount, claimed_at, insurance_id
    )
    VALUES (
        p_claim_id, p_service_code, p_patient_id, p_approved_by,
        v_claimed_amount, NOW(), p_insurance_id
    );
    
    SELECT * FROM insurance_claim WHERE claim_id = p_claim_id;
END$$

-- Get insurance claims for patient
DROP PROCEDURE IF EXISTS get_patient_insurance_claims$$
CREATE PROCEDURE get_patient_insurance_claims(IN p_patient_id INT)
BEGIN
    SELECT 
        ic.*,
        tc.name as treatment_name,
        i.insurance_type,
        s.name as approved_by_name
    FROM insurance_claim ic
    JOIN treatment_catelogue tc ON ic.service_code = tc.service_code
    JOIN insurance i ON ic.insurance_id = i.insurance_id
    JOIN staff s ON ic.approved_by = s.staff_id
    WHERE ic.patient_id = p_patient_id
    ORDER BY ic.claimed_at DESC;
END$$

-- ============================================================================
-- MANAGEMENT REPORTS PROCEDURES
-- ============================================================================

-- Report 1: Branch-wise appointment summary per day
DROP PROCEDURE IF EXISTS report_branch_appointments_daily$$
CREATE PROCEDURE report_branch_appointments_daily(
    IN p_date DATE,
    IN p_branch_id INT
)
BEGIN
    SELECT 
        b.name as branch_name,
        a.date,
        a.status,
        COUNT(*) as appointment_count
    FROM appointment a
    JOIN doctor d ON a.doctor_id = d.doctor_id
    JOIN user u ON d.doctor_id = u.user_id
    JOIN branch b ON u.branch_id = b.branch_id
    WHERE a.date = p_date
      AND (p_branch_id = -1 OR u.branch_id = p_branch_id)
    GROUP BY b.name, a.date, a.status
    ORDER BY b.name, a.status;
END$$

-- Report 2: Doctor-wise revenue report
DROP PROCEDURE IF EXISTS report_doctor_revenue$$
CREATE PROCEDURE report_doctor_revenue(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_doctor_id INT
)
BEGIN
    SELECT 
        d.doctor_id,
        d.name as doctor_name,
        COUNT(DISTINCT a.appointment_id) as total_appointments,
        SUM(bi.total_fee) as total_revenue,
        SUM(bp.paid_amount) as total_collected,
        SUM(bi.remaining_payment_amount) as total_outstanding
    FROM doctor d
    JOIN appointment a ON d.doctor_id = a.doctor_id
    LEFT JOIN billing_invoice bi ON a.appointment_id = bi.appointment_id
    LEFT JOIN billing_payment bp ON bi.appointment_id = bp.invoice_id
    WHERE a.date BETWEEN p_start_date AND p_end_date
      AND a.status = 'Completed'
      AND (p_doctor_id = -1 OR d.doctor_id = p_doctor_id)
    GROUP BY d.doctor_id, d.name
    ORDER BY total_revenue DESC;
END$$

-- Report 3: List of patients with outstanding balances
DROP PROCEDURE IF EXISTS report_patients_outstanding_balances$$
CREATE PROCEDURE report_patients_outstanding_balances()
BEGIN
    SELECT 
        p.patient_id,
        p.name as patient_name,
        p.emergency_contact_no,
        b.name as branch_name,
        SUM(bi.remaining_payment_amount) as total_outstanding,
        COUNT(DISTINCT bi.appointment_id) as unpaid_invoices
    FROM patient p
    JOIN appointment a ON p.patient_id = a.patient_id
    JOIN billing_invoice bi ON a.appointment_id = bi.appointment_id
    JOIN user u ON p.patient_id = u.user_id
    JOIN branch b ON u.branch_id = b.branch_id
    WHERE bi.remaining_payment_amount > 0
    GROUP BY p.patient_id, p.name, p.emergency_contact_no, b.name
    ORDER BY total_outstanding DESC;
END$$

-- Report 4: Number of treatments per category over a given period
DROP PROCEDURE IF EXISTS report_treatments_by_category$$
CREATE PROCEDURE report_treatments_by_category(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        s.speciality_name as category,
        tc.name as treatment_name,
        COUNT(*) as treatment_count,
        SUM(tc.fee) as total_revenue
    FROM treatment t
    JOIN appointment a ON t.appointment_id = a.appointment_id
    JOIN treatment_catelogue tc ON t.service_code = tc.service_code
    JOIN speciality s ON tc.speciality_id = s.speciality_id
    WHERE a.date BETWEEN p_start_date AND p_end_date
      AND a.status = 'Completed'
    GROUP BY s.speciality_name, tc.name
    ORDER BY s.speciality_name, treatment_count DESC;
END$$

-- Report 5: Insurance coverage vs. out-of-pocket payments
DROP PROCEDURE IF EXISTS report_insurance_vs_outofpocket$$
CREATE PROCEDURE report_insurance_vs_outofpocket(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        DATE_FORMAT(a.date, '%Y-%m') as month,
        COUNT(DISTINCT a.appointment_id) as total_appointments,
        SUM(bi.total_fee) as total_fees,
        SUM(COALESCE(ic.claimed_amount, 0)) as insurance_covered,
        SUM(bp.paid_amount) as out_of_pocket_payments,
        ROUND(SUM(COALESCE(ic.claimed_amount, 0)) / SUM(bi.total_fee) * 100, 2) as insurance_coverage_percentage
    FROM appointment a
    JOIN billing_invoice bi ON a.appointment_id = bi.appointment_id
    LEFT JOIN insurance_claim ic ON bi.claim_id = ic.claim_id
    LEFT JOIN billing_payment bp ON bi.appointment_id = bp.invoice_id
    WHERE a.date BETWEEN p_start_date AND p_end_date
      AND a.status = 'Completed'
    GROUP BY DATE_FORMAT(a.date, '%Y-%m')
    ORDER BY month;
END$$

-- ============================================================================
-- ADDITIONAL UTILITY PROCEDURES
-- ============================================================================

-- Get all appointments for a branch on a specific date
DROP PROCEDURE IF EXISTS get_branch_appointments_by_date$$
CREATE PROCEDURE get_branch_appointments_by_date(
    IN p_branch_id INT,
    IN p_date DATE
)
BEGIN
    SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name,
        s.speciality_name
    FROM appointment a
    JOIN patient p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    JOIN user u ON d.doctor_id = u.user_id
    LEFT JOIN doctor_speciality ds ON d.doctor_id = ds.doctor_id
    LEFT JOIN speciality s ON ds.speciality_id = s.speciality_id
    WHERE u.branch_id = p_branch_id
      AND a.date = p_date
    ORDER BY a.time_slot;
END$$

-- Get treatment catalogue with pagination
DROP PROCEDURE IF EXISTS get_treatments_for_pagination$$
CREATE PROCEDURE get_treatments_for_pagination(
    IN p_count INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        tc.*,
        s.speciality_name,
        tc.created_at
    FROM treatment_catelogue tc
    LEFT JOIN speciality s ON tc.speciality_id = s.speciality_id
    ORDER BY tc.service_code
    LIMIT p_count OFFSET p_offset;
END$$

-- Get treatment count
DROP PROCEDURE IF EXISTS get_treatments_count$$
CREATE PROCEDURE get_treatments_count()
BEGIN
    SELECT COUNT(*) as treatment_count FROM treatment_catelogue;
END$$

-- Get all insurance policies
DROP PROCEDURE IF EXISTS get_all_insurance$$
CREATE PROCEDURE get_all_insurance()
BEGIN
    SELECT * FROM insurance ORDER BY created_at DESC;
END$$

-- Get total patients count (fixed version)
DROP PROCEDURE IF EXISTS get_total_patients_count$$
CREATE PROCEDURE get_total_patients_count()
BEGIN
    SELECT COUNT(*) as patient_count FROM patient;
END$$

-- Get total staff count (fixed version)
DROP PROCEDURE IF EXISTS get_total_staffs_count$$
CREATE PROCEDURE get_total_staffs_count()
BEGIN
    SELECT COUNT(*) as staff_count FROM staff;
END$$

-- Emergency walk-in appointment creation
DROP PROCEDURE IF EXISTS create_walkin_appointment$$
CREATE PROCEDURE create_walkin_appointment(
    IN p_appointment_id INT,
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_patient_note VARCHAR(255)
)
BEGIN
    INSERT INTO appointment (
        appointment_id, patient_id, doctor_id, patient_note,
        date, time_slot, status, time_stamp
    )
    VALUES (
        p_appointment_id, p_patient_id, p_doctor_id, p_patient_note,
        CURDATE(), 'Walk-in', 'Scheduled', NOW()
    );
    
    SELECT * FROM appointment WHERE appointment_id = p_appointment_id;
END$$


DELIMITER ;