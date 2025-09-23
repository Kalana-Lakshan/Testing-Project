import sql from "../db/db.ts";

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: string;
  branch_id: number;
  branch_name: string;
  is_approved: boolean;
  created_at: string;
}

// Create User
export const createUser = async (
  username: string,
  password_hash: string,
  role: string,
  branch_id: number,
  is_approved: boolean
): Promise<User> => {
  try {
    const [rows] = await sql.query(
      "CALL create_user(?, ?, ?, ?, ?)",
      [username, password_hash, role, branch_id, is_approved]
    );
    // stored procs return nested arrays: [[rows], ...]
    return (rows as any)[0][0] as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update User
export const updateUser = async (
  user_id: number,
  username: string,
  password_hash: string,
  role: string,
  branch_id: number,
  is_approved: boolean
): Promise<void> => {
  try {
    await sql.query("CALL update_user(?, ?, ?, ?, ?, ?)", [
      user_id,
      username,
      password_hash,
      role,
      branch_id,
      is_approved,
    ]);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Get User By ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const [rows] = await sql.query("CALL get_user_by_id(?)", [id]);
    const user = (rows as any)[0][0] as User;
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// Get All Users (pagination)
export const getAllUser = async (
  count: number,
  offset: number
): Promise<User[]> => {
  try {
    const [rows] = await sql.query("CALL get_all_users(?, ?)", [
      count,
      offset,
    ]);
    return (rows as any)[0] as User[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
