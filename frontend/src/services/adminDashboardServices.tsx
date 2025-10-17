import axiosInstance from "../axiosConfig";

export interface fetchTotalPatientsCountResponse {
  total_count: number;
}
export interface fetchTotalStaffsCountResponse {
  total_count: number;
}
export interface fetchTotalBranchesCountResponse {
  total_count: number;
}

export const fetchTotalPatientsCount = async () => {
  try {
    const response = await axiosInstance.get("/patient/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total patients count:", error);
    throw error;
  }
};

export const fetchTotalStaffsCount = async () => {
  try {
    const response = await axiosInstance.get("/staff/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total staffs count:", error);
    throw error;
  }
};

export const fetchTotalBranchesCount = async () => {
  try {
    const response = await axiosInstance.get("/branch/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching total staffs count:", error);
    throw error;
  }
};