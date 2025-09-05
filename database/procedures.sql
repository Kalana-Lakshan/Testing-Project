-- User model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_user(VARCHAR, VARCHAR, VARCHAR, BIGINT, BOOLEAN);
DROP PROCEDURE IF EXISTS update_user(BIGINT, VARCHAR, VARCHAR, VARCHAR, BIGINT, BOOLEAN);
DROP FUNCTION IF EXISTS get_user_by_id(BIGINT);
DROP PROCEDURE IF EXISTS delete_user(BIGINT);
-- Patient model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_patient(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, VARCHAR);
DROP PROCEDURE IF EXISTS update_patient(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, VARCHAR);
DROP FUNCTION IF EXISTS get_patient_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_patients_by_blood_type(VARCHAR);
DROP PROCEDURE IF EXISTS delete_patient(BIGINT);
-- Staff model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_staff(BIGINT, VARCHAR, VARCHAR, VARCHAR, NUMERIC);
DROP PROCEDURE IF EXISTS update_staff(BIGINT, VARCHAR, VARCHAR, VARCHAR, NUMERIC);
DROP FUNCTION IF EXISTS get_staff_by_id(BIGINT);
DROP FUNCTION IF EXISTS get_staffs_by_type(VARCHAR);
DROP PROCEDURE IF EXISTS delete_staff(BIGINT);
-- Branch Manager model functions
-- Drop existing objects (if they exist)
DROP PROCEDURE IF EXISTS create_branch_manager(BIGINT, VARCHAR, NUMERIC, VARCHAR);
DROP PROCEDURE IF EXISTS update_branch_manager(BIGINT, VARCHAR, NUMERIC, VARCHAR);
DROP FUNCTION IF EXISTS get_branch_manager_by_id(BIGINT);
DROP PROCEDURE IF EXISTS delete_branch_manager(BIGINT);



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
  INSERT INTO "User" (username, password_hash, role, branch_id, is_approved)
  VALUES (p_username, p_password_hash, p_role, p_branch_id, p_is_approved);
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
  is_approved  BOOLEAN
) LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id, username, password_hash, role, branch_id, is_approved
  FROM "User"
  WHERE user_id = p_id;
END;
$$;

-- 4. Delete a user 
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

-- 5. Delete a patient 
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

-- 5. Delete a staff 
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

-- 4. Delete a branch manager 
CREATE OR REPLACE PROCEDURE delete_branch_manager(p_id BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM "Branch_Manager" WHERE manager_id = p_id;
END;
$$;



