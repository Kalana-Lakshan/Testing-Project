import sql from "../db/db.ts";

export interface Treatment {
  service_code: number;
  name: string;
  fee: string;
  description: string;
  speciality_id: number;
  created_at: string;
}

export const getAllTreatments = async (): Promise<Treatment[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_treatments()");
    return (rows as any)[0] as Treatment[];
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw error;
  }
};

export const getTreatmentsForPagination = async (
  count: number,
  offset: number
): Promise<Treatment[]> => {
  try {
    const [rows] = await sql.query("CALL get_treatments_for_pagination(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as Treatment[];
  } catch (error) {
    console.error("Error in getTreatmentsForPagination:", error);
    throw error;
  }
};

export const getTreatmentsCount = async (): Promise<number> => {
  try {
    const [rows]: any = await sql.query("CALL get_treatments_count()");
    return rows[0][0].treatment_count;
  } catch (error) {
    console.error("Error fetching treatment count:", error);
    throw error;
  }
};
export const checkServiceCodeExists = async (code: number): Promise<boolean> => {
  const [rows]: any = await sql.query("CALL check_service_code_exists(?)", [code]);
  const exists = rows?.[0]?.[0]?.exists_flag ?? 0;
  return Boolean(Number(exists));
};
export type CreateTreatmentInput = {
  service_code: number;
  name: string;
  fee: number;             // number here; decimal in DB
  description?: string | null;
  speciality_id: number;
};

export const createTreatment = async (payload: CreateTreatmentInput): Promise<Treatment> => {
  const [rows]: any = await sql.query("CALL create_treatment(?, ?, ?, ?, ?)", [
    payload.service_code,
    payload.name,
    payload.fee,
    payload.description ?? null,
    payload.speciality_id,
  ]);
  return rows[0][0] as Treatment; // matches the SELECT in the procedure
};