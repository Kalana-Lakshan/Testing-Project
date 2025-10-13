// pages/patient/PatientDashboard.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPatientDashboardDetails, type PatientDashboardDetails } from "@/services/patientDashboardServices";

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"

export default function PatientDashboard() {
  const [patientDetails, setPatientDetails] = useState<(PatientDashboardDetails & { name: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const details = await getPatientDashboardDetails();
        setPatientDetails(details);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch patient details");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!patientDetails) return <div>No data.</div>;

  return (
    <>
      <h1>Hi {patientDetails.name}, welcome to your dashboard!</h1>
    </>
  );
}
