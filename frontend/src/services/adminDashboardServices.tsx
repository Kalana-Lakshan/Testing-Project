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

export interface fetchMonthlyAppointmentsCountResponse {
  month: string;
  count: number;
}
export interface FetchMonthlyRevenueResponse {
  month: string;    // "YYYY-MM"
  revenue: string;  // e.g. "5200.00"
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

// export const fetchMonthlyAppointmentsCount = async (startDate: string, endDate: string, status: string | null) => {
//   try {
//     const response = await axiosInstance.post("/appointments/monthly-counts", {startDate,endDate,status});
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching monthly appointments count:", error);
//     throw error;
//   }
// };
export const fetchMonthlyAppointments = async (
  start: string,
  end: string
): Promise<fetchMonthlyAppointmentsCountResponse[]> => {
  const { data } = await axiosInstance.get<fetchMonthlyAppointmentsCountResponse[]>(
    "/appointments/monthly-counts",
    { params: { start, end } }
  );
  return data; // backend returns the array directly
};

// Helper for a whole year
export const fetchMonthlyAppointmentsForYear = async (year: number) => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return fetchMonthlyAppointments(start, end);
};


export const fetchMonthlyRevenue = async (
  start: string,
  end: string
): Promise<FetchMonthlyRevenueResponse[]> => {
  const { data } = await axiosInstance.get<FetchMonthlyRevenueResponse[]>(
    "/billing/monthly-revenue",      // ← adjust if your endpoint differs
    { params: { start, end } }
  );
  return data;
};

export const fetchMonthlyRevenueForYear = async (year: number) => {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return fetchMonthlyRevenue(start, end);
};