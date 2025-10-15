import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface Treatment {
  service_code: number;
  name: string;
  fee: string;
  description: string;
  speciality_id: number;
 
}

export const getAllTreatments = async () => {
  try {
    const resp = await axiosInstance.get<{ treatments: Array<Treatment> }>("/treatments");
    return resp.data;
  } catch (error: unknown) {
    console.error("Error getting all treatments:", error);
    if (error instanceof AxiosError) {
      if (error.response?.data?.error) throw error.response.data.error;
      throw error.message;
    }
    throw "Unknown error occurred";
  }
};

export type TreatmentCreateInput = {
  service_code: string;
  name: string;
  fee: number | string; // number on submit, string while typing
  description: string;
  speciality_id: string;
};

export async function isServiceCodeTaken(code: string | number): Promise<boolean> {
  const response = await fetch(`http://localhost:8000/treatments/check-service-code?code=${code}`, {
    method: "GET",
    credentials: "omit", 
  });

  if (!response.ok) {
    throw new Error("Failed to check service code");
  }

  const data = await response.json();
  return data.exists;
}

export async function createTreatment(
  payload: Omit<TreatmentCreateInput, "fee"> & { fee: number }
) {
  const res = await fetch("http://localhost:8000/treatments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit", // fix  - dont send cookies
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create treatment");
  }

  return res.json();
}


