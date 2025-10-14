import sql from "../db/db.ts";

export interface Speciality {
  speciality_id: number;
  speciality_name: string;
  description: string;
};

export const getAllSpecialities = async (): Promise<Speciality[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_speciality()");
    return (rows as any)[0] as Speciality[];
  } catch (error) {
    console.error("Error fetching all specialities:", error);
    throw error;
  }
};

export const addSpeciality = async (speciality_name: string, description: string): Promise<void> => {
  try {
    const [result] = await sql.query("CALL add_speciality(?, ?)", [speciality_name, description]);
    const insertId = (result as any).insertId;
    if (insertId === 0) {
      throw new Error("Speciality already exists");
    } else {
      console.log(`Speciality added with ID: ${insertId}`);
    }
  } catch (error) {
    console.error("Error adding speciality:", error);
    throw error;
  }
};

export const getSpecialityById = async (speciality_id: number): Promise<Speciality> => {
  try {
    const [rows] = await sql.query("CALL get_speciality_by_id(?)", [speciality_id]);
    const specialities = (rows as any)[0] as Speciality[];
    if (specialities.length === 0 || !specialities[0]) {
      throw new Error("Speciality not found");
    }
    return specialities[0];
  } catch (error) {
    console.error("Error fetching speciality by ID:", error);
    throw error;
  }
};
