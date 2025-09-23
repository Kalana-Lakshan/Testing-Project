import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const getAllUsers = async (count: number, offset: number) => {
  try {
    return await axiosInstance.get(`/users?count=${count}&offset=${offset}`);
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