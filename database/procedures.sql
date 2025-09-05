-- User model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_user(VARCHAR, VARCHAR, VARCHAR, BIGINT, BOOLEAN);
DROP PROCEDURE IF EXISTS update_user(BIGINT, VARCHAR, VARCHAR, VARCHAR, BIGINT, BOOLEAN);
DROP FUNCTION IF EXISTS get_user_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_user_by_username(VARCHAR);
DROP FUNCTION IF EXISTS get_all_users(INT, INT);
DROP PROCEDURE IF EXISTS delete_user(BIGINT);
-- Patient model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_patient(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, VARCHAR);
DROP PROCEDURE IF EXISTS update_patient(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, VARCHAR);
DROP FUNCTION IF EXISTS get_patient_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_patients_by_blood_type(VARCHAR);
DROP FUNCTION IF EXISTS get_all_patients(INT, INT);
DROP PROCEDURE IF EXISTS delete_patient(BIGINT);
-- Staff model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_staff(BIGINT, VARCHAR, VARCHAR, VARCHAR, NUMERIC);
DROP PROCEDURE IF EXISTS update_staff(BIGINT, VARCHAR, VARCHAR, VARCHAR, NUMERIC);
DROP FUNCTION IF EXISTS get_staff_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_staffs_by_type(VARCHAR);
DROP FUNCTION IF EXISTS get_staffs_by_branch_id(BIGINT);
DROP PROCEDURE IF EXISTS delete_staff(BIGINT);
-- Branch Manager model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_branch_manager(BIGINT, VARCHAR, NUMERIC, VARCHAR);
DROP PROCEDURE IF EXISTS update_branch_manager(BIGINT, VARCHAR, NUMERIC, VARCHAR);
DROP FUNCTION IF EXISTS get_branch_manager_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_branch_manager_by_branch_id(BIGINT);
DROP PROCEDURE IF EXISTS delete_branch_manager(BIGINT);
-- Branch model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_branch(VARCHAR, VARCHAR, VARCHAR);
DROP PROCEDURE IF EXISTS update_branch(BIGINT, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS get_branch_by_id(BIGINT);
DROP PROCEDURE IF EXISTS delete_branch(BIGINT);
-- User_Contact model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_user_contact(VARCHAR, VARCHAR, BOOLEAN, BIGINT);
DROP PROCEDURE IF EXISTS update_user_contact(VARCHAR, VARCHAR, BOOLEAN, BIGINT);
DROP FUNCTION IF EXISTS get_contact(VARCHAR);
DROP FUNCTION IF EXISTS get_default_contacts_by_userID(BIGINT);
DROP PROCEDURE IF EXISTS delete_branch(BIGINT);



-- User model functions
-- 1. Create a user 
CREATE OR REPLACE PROCEDURE create_user(
  p_username      VARCHAR,
  p_password_hash VARCHAR,
  p_role          VARCHAR,
  p_branch_id     BIGINT,
  p_is_approved   BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "User" (username, password_hash, role, branch_id, is_approved, created_at)
  VALUES (p_username, p_password_hash, p_role, p_branch_id, p_is_approved, NOW());
END;
$$;

-- 2. Update a user
CREATE OR REPLACE PROCEDURE update_user(
  p_id            BIGINT,
  p_username      VARCHAR,
  p_password_hash VARCHAR,
  p_role          VARCHAR,
  p_branch_id     BIGINT,
  p_is_approved   BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "User"
  SET username      = p_username,
      password_hash = p_password_hash,
      role          = p_role,
      branch_id     = p_branch_id,
      is_approved   = p_is_approved
  WHERE user_id = p_id;
END;
$$;

-- 3. Get a user by ID 
CREATE OR REPLACE FUNCTION get_user_by_id(p_id BIGINT)
RETURNS TABLE(
  user_id      BIGINT,
  username     VARCHAR,
  password_hash VARCHAR,
  role         VARCHAR,
  branch_id    BIGINT,
  is_approved  BOOLEAN,
	created_at	TIMESTAMP
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id, username, password_hash, role, branch_id, is_approved
  FROM "User"
  WHERE user_id = p_id;
END;
$$;

-- 3. Get a user by username 
CREATE OR REPLACE FUNCTION get_user_by_username(p_username VARCHAR)
RETURNS TABLE(
  user_id      BIGINT,
  username     VARCHAR,
  password_hash VARCHAR,
  role         VARCHAR,
  branch_id    BIGINT,
  is_approved  BOOLEAN,
	created_at	TIMESTAMP
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id, username, password_hash, role, branch_id, is_approved
  FROM "User"
  WHERE username = p_username;
END;
$$;

-- 5. Get all user 
CREATE OR REPLACE FUNCTION get_all_users(
	user_count INT, 
	start_count INT
	)
RETURNS TABLE(
  user_id      BIGINT,
  username     VARCHAR,
  password_hash VARCHAR,
  role         VARCHAR,
  branch_id    BIGINT,
  is_approved  BOOLEAN,
	created_at	TIMESTAMP
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id, username, password_hash, role, branch_id, is_approved, created_at
  FROM "User"
	ORDER BY user_id
	LIMIT user_count
	OFFSET start_count;
END;
$$;

-- 6. Delete a user 
CREATE OR REPLACE PROCEDURE delete_user(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "User" WHERE user_id = p_id;
END;
$$;

-- Patient model functions
-- 1. Create a patient 
CREATE OR REPLACE PROCEDURE create_patient(
  p_patient_id  BIGINT,
  p_name        VARCHAR,
  p_gender      VARCHAR,
  p_emergency_contact_no  VARCHAR,
  p_nic         VARCHAR,
  p_address     VARCHAR,
  p_date_of_birth DATE,
  p_blood_type  VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "Patient" (patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type)
  VALUES (p_patient_id, p_name, p_gender, p_emergency_contact_no, p_nic, p_address, p_date_of_birth, p_blood_type);
END;
$$;

-- 2. Update a patient
CREATE OR REPLACE PROCEDURE update_patient(
  p_patient_id  BIGINT,
  p_name        VARCHAR,
  p_gender      VARCHAR,
  p_emergency_contact_no  VARCHAR,
  p_nic         varchar,
  p_address     VARCHAR,
  p_date_of_birth DATE,
  p_blood_type  VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "Patient"
  SET name  = p_name,
      gender = p_gender,
      emergency_contact_no = p_emergency_contact_no,
      nic = p_nic,
      address = p_address, 
      date_of_birth = p_date_of_birth, 
      blood_type = p_blood_type 
  WHERE patient_id = p_patient_id;
END;
$$;

-- 3. Get a patient by ID 
CREATE OR REPLACE FUNCTION get_patient_by_id(p_id BIGINT)
RETURNS TABLE(
  patient_id  BIGINT,
  name        VARCHAR,
  gender      VARCHAR,
  emergency_contact_no  VARCHAR,
	nic         varchar,
  address     VARCHAR,
  date_of_birth DATE,
  blood_type  VARCHAR
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
  FROM "Patient"
  WHERE patient_id = p_id;
END;
$$;

-- 4. Get a patients by blood group
CREATE OR REPLACE FUNCTION get_patients_by_blood_type(p_blood VARCHAR)
RETURNS TABLE(
  patient_id  BIGINT,
  name        VARCHAR,
  gender      VARCHAR,
  emergency_contact_no  VARCHAR,
  nic         varchar,
  address     VARCHAR,
  date_of_birth DATE,
  blood_type  VARCHAR
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
  FROM "Patient"
  WHERE blood_type = p_blood;
END;
$$;

-- 5. Get all patient 
CREATE OR REPLACE FUNCTION get_all_patients(
	patient_count INT,
	count_start INT
	)
RETURNS TABLE(
  patient_id  BIGINT,
  name        VARCHAR,
  gender      VARCHAR,
  emergency_contact_no  VARCHAR,
	nic         varchar,
  address     VARCHAR,
  date_of_birth DATE,
  blood_type  VARCHAR
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT patient_id, name, gender, emergency_contact_no, nic, address, date_of_birth, blood_type
  FROM "Patient"
  ORDER BY patient_id
	LIMIT patient_count
	OFFSET count_start;
END;
$$;

-- 6. Delete a patient 
CREATE OR REPLACE PROCEDURE delete_patient(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Patient" WHERE patient_id = p_id;
END;
$$;


-- staff model functions
-- 1. Create a staff 
CREATE OR REPLACE PROCEDURE create_staff(
  p_staff_id BIGINT,
	p_name VARCHAR,
	p_type VARCHAR,
	p_gender VARCHAR,
	p_monthly_salary NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "Staff" (staff_id, name, type, gender, monthly_salary)
  VALUES (p_staff_id, p_name, p_type, p_gender, p_monthly_salary);
END;
$$;

-- 2. update a staff 
CREATE OR REPLACE PROCEDURE update_staff(
  p_staff_id BIGINT,
	p_name VARCHAR,
	p_type VARCHAR,
	p_gender VARCHAR,
	p_monthly_salary NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "Staff"
  SET name = p_name,
			type = p_type,
			gender = p_gender,
			monthly_salary = p_monthly_salary
  WHERE staff_id = p_staff_id;
END;
$$;

-- 3. Get a staff by ID 
CREATE OR REPLACE FUNCTION get_staff_by_id(p_id BIGINT)
RETURNS TABLE(
	staff_id BIGINT,
	name VARCHAR,
	type VARCHAR,
	gender VARCHAR,
	monthly_salary NUMERIC
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT staff_id, name, type, gender, monthly_salary
  FROM "Staff"
  WHERE staff_id = p_id;
END;
$$;

-- 4. Get a staffs by type 
CREATE OR REPLACE FUNCTION get_staffs_by_type(p_type VARCHAR)
RETURNS TABLE(
	staff_id BIGINT,
	name VARCHAR,
	type VARCHAR,
	gender VARCHAR,
	monthly_salary NUMERIC
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT staff_id, name, type, gender, monthly_salary
  FROM "Staff"
  WHERE type = p_type;
END;
$$;

-- 5. Get a staffs by branch id 
CREATE OR REPLACE FUNCTION get_staffs_by_branch_id(p_branch_id BIGINT)
RETURNS TABLE(
	staff_id BIGINT,
	name VARCHAR,
	type VARCHAR,
	gender VARCHAR,
	monthly_salary NUMERIC
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT s.staff_id, s.name, s.type, s.gender, s.monthly_salary
  FROM "Staff" s
	LEFT OUTER JOIN "User" u
	ON s.staff_id = u.user_id
  WHERE u.branch_id = p_branch_id;
END;
$$;

-- 6. Delete a staff 
CREATE OR REPLACE PROCEDURE delete_staff(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Staff" WHERE staff_id = p_id;
END;
$$;


-- branch manager model functions
-- 1. Create a branch manager 
CREATE OR REPLACE PROCEDURE create_branch_manager(
  p_manager_id BIGINT,
	p_name varchar,
	p_monthly_salary NUMERIC,
	p_gender varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "Branch_Manager" (manager_id, name, monthly_salary, gender)
  VALUES (p_staff_id, p_name, p_type, p_gender, p_monthly_salary);
END;
$$;

-- 2. update a branch manager 
CREATE OR REPLACE PROCEDURE update_branch_manager(
  p_manager_id BIGINT,
	p_name varchar,
	p_monthly_salary NUMERIC,
	p_gender varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "Branch_Manager"
  SET name = p_name,
			monthly_salary = p_monthly_salary,
			gender = p_gender
  WHERE manager_id = p_manager_id;
END;
$$;

-- 3. Get a branch manager by ID 
CREATE OR REPLACE FUNCTION get_branch_manager_by_id(p_id BIGINT)
RETURNS TABLE(
	manager_id BIGINT,
	name varchar,
	monthly_salary NUMERIC,
	gender varchar
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT manager_id, name, monthly_salary, gender
  FROM "Branch_Manager"
  WHERE manager_id = p_id;
END;
$$;

-- 3. Get a branch manager by branch ID 
CREATE OR REPLACE FUNCTION get_branch_manager_by_branch_id(p_branch_id BIGINT)
RETURNS TABLE(
	manager_id BIGINT,
	name varchar,
	monthly_salary NUMERIC,
	gender varchar
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT manager_id, name, monthly_salary, gender
  FROM "Branch_Manager" b
	LEFT OUTER JOIN  "User" u
	ON u.user_id = b.manager_id
  WHERE u.branch_id = p_branch_id;
END;
$$;

-- 5. Delete a branch manager 
CREATE OR REPLACE PROCEDURE delete_branch_manager(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Branch_Manager" WHERE manager_id = p_id;
END;
$$;


-- branch model functions
-- 1. Create a branch  
CREATE OR REPLACE PROCEDURE create_branch(
	p_name varchar,
	p_location varchar,
	p_landline_no varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "Branch" (name, location, landline_no, created_at)
  VALUES (p_name, p_location, p_landline_no, NOW());
END;
$$;

-- 2. update a branch 
CREATE OR REPLACE PROCEDURE update_branch(
  p_branch_id BIGINT,
	p_name VARCHAR,
	p_location VARCHAR,
	p_landline_no VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "Branch"
  SET name = p_name,
			location = p_location,
			landline_no = p_landline_no
  WHERE id = p_branch_id;
END;
$$;

-- 3. Get a branch by ID 
CREATE OR REPLACE FUNCTION get_branch_by_id(p_branch_id BIGINT)
RETURNS TABLE(
	id BIGINT,
	name VARCHAR,
	location VARCHAR,
	landline_no VARCHAR,
	created_at TIMESTAMP
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, location, landline_no, created_at
  FROM "Branch"
  WHERE id = p_branch_id;
END;
$$;

-- 4. Delete a branch 
CREATE OR REPLACE PROCEDURE delete_branch(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Branch" WHERE id = p_id;
END;
$$;

-- user contact model functions
-- 1. Create a user contact  
CREATE OR REPLACE PROCEDURE create_user_contact(
	p_contact VARCHAR,
	p_contact_type VARCHAR,
	p_is_default BOOLEAN,
	p_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "User_Contact" (contact, contact_type, is_default, user_id)
  VALUES (p_contact, p_contact_type, p_is_default, p_user_id);
END;
$$;

-- 2. update a user contact 
CREATE OR REPLACE PROCEDURE update_user_contact(
  p_contact VARCHAR,
	p_contact_type VARCHAR,
	p_is_default BOOLEAN,
	p_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "User_Contact"
  SET contact = p_contact,
			contact_type = p_contact_type,
			is_default = p_is_default,
			user_id = p_user_id
  WHERE contact = p_contact;
END;
$$;

-- 3. Get a user contact by contact
CREATE OR REPLACE FUNCTION get_contact(p_contact VARCHAR)
RETURNS TABLE(
	contact VARCHAR,
	contact_type VARCHAR,
	is_default BOOLEAN,
	user_id BIGINT
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT contact, contact_type, is_default, user_id
  FROM "User_Contact"
  WHERE contact = p_contact;
END;
$$;

-- 4. Get default user contact by user id
CREATE OR REPLACE FUNCTION get_default_contacts_by_userID(p_userID BIGINT)
RETURNS TABLE(
	contact VARCHAR,
	contact_type VARCHAR,
	is_default BOOLEAN,
	user_id BIGINT
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT contact, contact_type, is_default, user_id
  FROM "User_Contact"
  WHERE user_id = p_userID ADD is_default = TRUE;
END;
$$;

-- 5. Delete a user contact 
CREATE OR REPLACE PROCEDURE delete_contact(p_contact VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "User_Contact" WHERE contact = p_contact;
END;
$$;








