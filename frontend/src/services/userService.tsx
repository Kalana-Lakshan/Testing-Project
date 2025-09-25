import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface UserDTO {
  user_id: number;
  username: string;
  role: string;
  branch_name: string;
  created_at: string;
  is_approved: number | boolean;
}

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

export const getAllUsers = async (count: number, offset: number) => {
  try {
    const users_db = await axiosInstance.get<{
      user_count: number;
      users: Array<User>;
    }>(`/users/active?count=${count}&offset=${offset}`);
    return users_db.data;
  } catch (error: unknown) {
    console.error("Error logging in:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};