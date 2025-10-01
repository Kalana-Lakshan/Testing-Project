import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Branch {
  branch_id: number;
  name: string;
  location: string;
  landline_no: string;
  created_at: string;
}

export const getAllBranches = async (count: number, offset: number) => {
  try {
    const branches_db = await axiosInstance.get<{
      branch_count: number;
      branches: Array<Branch>;
    }>(`/branch?count=${count}&offset=${offset}`);
    return branches_db.data;
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