import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Log {
  log_id: number,
  user_id: number,
  username: string
  user_role: string,
  action: string,
  table_name: string,
  record_id: number,
  time_stamp: string,
  details: string,
};

export const getAllLogs = async (
  count: number,
  offset: number
) => {
  try {
    const response = await axiosInstance.get<{
      logs_count: number;
      logs: Log[];
    }>(`/logs?count=${count}&offset=${offset}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting all doctors data:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw error.message;
    }
    throw "Unknown error occurred";
  }
}