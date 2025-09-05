-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Action (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT Action_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Appointment (
  appointment_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id bigint NOT NULL,
  doctor_id bigint NOT NULL,
  patient_note character varying,
  date date NOT NULL,
  time_slot character varying NOT NULL,
  status character varying NOT NULL,
  CONSTRAINT Appointment_pkey PRIMARY KEY (appointment_id),
  CONSTRAINT Appointment_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.Doctor(doctor_id),
  CONSTRAINT Appointment_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.Patient(patient_id)
);
CREATE TABLE public.Billing_Invoice (
  invoice_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  branch_id bigint NOT NULL,
  doctor_id bigint NOT NULL,
  treatment_id bigint,
  patient_id bigint NOT NULL,
  additional_fee numeric,
  total_fee numeric,
  insurance_claim numeric,
  net_amount numeric,
  remaining_payment_amount numeric,
  time_stamp timestamp without time zone NOT NULL,
  CONSTRAINT Billing_Invoice_pkey PRIMARY KEY (invoice_id),
  CONSTRAINT Billing_Invoice_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.Patient(patient_id),
  CONSTRAINT Billing_Invoice_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.Treatment_Catelogue(treatment_id),
  CONSTRAINT Billing_Invoice_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.Doctor(doctor_id),
  CONSTRAINT Billing_Invoice_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.Branch(id)
);
CREATE TABLE public.Billing_Payment (
  payment_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_id bigint NOT NULL,
  branch_id bigint NOT NULL,
  payed_amount numeric NOT NULL,
  time_stamp timestamp without time zone DEFAULT now(),
  cashier_id bigint NOT NULL,
  CONSTRAINT Billing_Payment_pkey PRIMARY KEY (payment_id),
  CONSTRAINT Billing_Payment_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.Branch(id),
  CONSTRAINT Billing_Payment_cashier_id_fkey FOREIGN KEY (cashier_id) REFERENCES public.Staff(staff_id),
  CONSTRAINT Billing_Payment_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.Billing_Invoice(invoice_id)
);
CREATE TABLE public.Branch (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  location character varying NOT NULL,
  landline_no character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Branch_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Branch_Manager (
  manager_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  monthly_salary numeric,
  gender character varying NOT NULL,
  CONSTRAINT Branch_Manager_pkey PRIMARY KEY (manager_id),
  CONSTRAINT Branch_Manager_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.User(user_id)
);
CREATE TABLE public.Doctor (
  doctor_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  fee_per_patient numeric,
  basic_monthly_salary numeric,
  gender character varying NOT NULL,
  CONSTRAINT Doctor_pkey PRIMARY KEY (doctor_id),
  CONSTRAINT Doctor_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.User(user_id)
);
CREATE TABLE public.Doctor_Speciality (
  doctor_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  specialiy_id bigint NOT NULL,
  added_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT Doctor_Speciality_pkey PRIMARY KEY (doctor_id, specialiy_id),
  CONSTRAINT Doctor_Speciality_specialiy_id_fkey FOREIGN KEY (specialiy_id) REFERENCES public.Speciality(id),
  CONSTRAINT Doctor_Speciality_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.Doctor(doctor_id)
);
CREATE TABLE public.Insurance (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  insurance_type character varying,
  isurance_period character varying,
  claim_percentage character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Insurance_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Insurance_Claim (
  claim_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id bigint NOT NULL,
  treatment_id bigint,
  insurance_id bigint NOT NULL,
  claimed_amount character varying,
  claimed_at timestamp without time zone DEFAULT now(),
  approved_by bigint,
  CONSTRAINT Insurance_Claim_pkey PRIMARY KEY (claim_id),
  CONSTRAINT Insurance_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.Patient(patient_id),
  CONSTRAINT Insurance_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.Treatment_Catelogue(treatment_id),
  CONSTRAINT Insurance_Claim_insurance_id_fkey FOREIGN KEY (insurance_id) REFERENCES public.Insurance(id),
  CONSTRAINT Insurance_Claim_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.Staff(staff_id)
);
CREATE TABLE public.Log (
  log_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id bigint NOT NULL,
  user_role character varying,
  action_id bigint,
  table_name character varying,
  record_id bigint,
  time_Stamp timestamp without time zone NOT NULL,
  details character varying,
  CONSTRAINT Log_pkey PRIMARY KEY (log_id),
  CONSTRAINT Log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Log_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.Action(id)
);
CREATE TABLE public.Medical_History (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id bigint,
  visit_date date,
  doctor_id bigint,
  diagnosis character varying,
  symptoms character varying,
  treatment_id bigint,
  medications character varying,
  allergies character varying,
  notes character varying,
  follow_up_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT Medical_History_pkey PRIMARY KEY (id),
  CONSTRAINT Medical_History_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.Patient(patient_id),
  CONSTRAINT Medical_History_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.Treatment_Catelogue(treatment_id),
  CONSTRAINT Medical_History_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.Doctor(doctor_id)
);
CREATE TABLE public.Patient (
  patient_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  gender character varying NOT NULL,
  emergency_contact_no character varying NOT NULL,
  nic character varying,
  address character varying,
  date_of_birth date,
  blood_type character varying,
  CONSTRAINT Patient_pkey PRIMARY KEY (patient_id),
  CONSTRAINT Patient_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.User(user_id)
);
CREATE TABLE public.Patient_Insurance (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  insurance_id bigint NOT NULL,
  is_expired boolean NOT NULL DEFAULT false,
  CONSTRAINT Patient_Insurance_pkey PRIMARY KEY (id, insurance_id),
  CONSTRAINT Patient_Insurance_insurance_id_fkey FOREIGN KEY (insurance_id) REFERENCES public.Insurance(id),
  CONSTRAINT Patient_Insurance_id_fkey FOREIGN KEY (id) REFERENCES public.Patient(patient_id)
);
CREATE TABLE public.Prescription (
  prescription_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id bigint NOT NULL,
  doctor_id bigint NOT NULL,
  treatment_id bigint,
  consultation_note character varying,
  prescription_items_details character varying,
  prescribed_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT Prescription_pkey PRIMARY KEY (prescription_id),
  CONSTRAINT Prescription_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.Doctor(doctor_id),
  CONSTRAINT Prescription_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.Patient(patient_id),
  CONSTRAINT Prescription_treatment_id_fkey FOREIGN KEY (treatment_id) REFERENCES public.Treatment_Catelogue(treatment_id)
);
CREATE TABLE public.Speciality (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  speciality_name character varying NOT NULL,
  description character varying,
  CONSTRAINT Speciality_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Staff (
  staff_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  type character varying,
  monthly_salary numeric,
  gender character varying NOT NULL,
  CONSTRAINT Staff_pkey PRIMARY KEY (staff_id),
  CONSTRAINT Staff_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.User(user_id)
);
CREATE TABLE public.Treatment_Catelogue (
  treatment_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  fee numeric,
  description character varying,
  speciality_id bigint,
  CONSTRAINT Treatment_Catelogue_pkey PRIMARY KEY (treatment_id),
  CONSTRAINT Treatment_Catelogue_speciality_id_fkey FOREIGN KEY (speciality_id) REFERENCES public.Speciality(id)
);
CREATE TABLE public.User (
  user_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  password_hash character varying NOT NULL,
  role character varying NOT NULL,
  branch_id bigint NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  username character varying NOT NULL,
  created_at timestamp without time zone NOT NULL,
  CONSTRAINT User_pkey PRIMARY KEY (user_id),
  CONSTRAINT User_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.Branch(id)
);
CREATE TABLE public.User_Contact (
  contact character varying NOT NULL,
  contact_type character varying NOT NULL,
  is_default boolean DEFAULT false,
  user_id bigint,
  CONSTRAINT User_Contact_pkey PRIMARY KEY (contact),
  CONSTRAINT User_Contact_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id)
);