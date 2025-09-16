import sql from "../db/db.ts";

export interface User {
  user_id       : number;
  username      : string;
  password_hash : string;
  role          : string;
  branch_id     : number;
  is_approved   : boolean;
  created_at    : string;
}

export const createUser = async (username: string, password_hash: string, role: string, branch_id: number, is_approved: boolean) => {
  try {
    const [user] = await sql<User[]>`SELECT * FROM create_user(${username}, ${password_hash}, ${role}, ${branch_id}, ${is_approved});`;
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (user_id: number, username: string, password_hash: string, role: string, branch_id: number, is_approved: boolean) => {
  try {
    await sql`SELECT update_user(${user_id}, ${username}, ${password_hash}, ${role}, ${branch_id}, ${is_approved});`;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const [user] = await sql<User[]>`SELECT * FROM get_user_by_id(${id});`;
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const getAllUser = async (count: number, offset: number) => {
  try {
    const users = await sql<User[]>`SELECT * FROM get_all_users(${count}, ${offset});`;
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};