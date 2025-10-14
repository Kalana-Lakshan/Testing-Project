// pages/patient/PatientDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import {getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState,} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {getPatientDashboardDetails,type PatientDashboardDetails,} from "@/services/patientDashboardServices";
import { DataTable } from "../components/data-table";
import toast from "react-hot-toast";
import { type medicalHistory, getMedicalHistoriesByPatientId } from "@/services/medicalhistoryServices";
import { getMedicationsByPatientId, type medication } from "@/services/medicationServices";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PatientDashboard() {
  // Prefer aligning the service type to include `name` if it's real.
  const [patientDetails, setPatientDetails] = useState<PatientDashboardDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const details = await getPatientDashboardDetails();
        if (!cancelled) setPatientDetails(details);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch patient details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!patientDetails) return <div>No data.</div>;

  return (
    <div className="space-y-6 text-left">
      {/* If your type really has `name`, add it to PatientDashboardDetails to avoid casting */}
      {"name" in patientDetails ? (
        <h1 className="left text-2xl font-bold">Hi {(patientDetails as any).name}, welcome to your dashboard !</h1>
      ) : (
        <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
      )}
      <Tabs defaultValue="history" className="w-full">
        {/* Pills selector */}
        <div className="flex justify-start">
          <TabsList className="rounded-full">
            <TabsTrigger value="history" className="rounded-full">
              Medical History
              {/* Optional count badge — pass counts via props/state if you want */}
              {/* <Badge className="ml-2">3</Badge> */}
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-full">
              Prescriptions
              {/* <Badge className="ml-2">2</Badge> */}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Panels */}
        <TabsContent value="history" className="mt-6">
          <MedicalHistoryTable patientId={patientDetails.patient_id} />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <MedicationTable patientId={patientDetails.patient_id} />
        </TabsContent>
      </Tabs>
   
      {/* <MedicalHistoryTable patientId={patientDetails.patient_id} />
      <MedicationTable patientId={patientDetails.patient_id} /> */}
     </div>
  );
}

function MedicalHistoryTable({ patientId }: { patientId: number }) {
  const [medicalHistories, setMedicalHistories] = useState<medicalHistory[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [mhLoading, setMhLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMhLoading(true);

    (async () => {
      try {
        const list = await getMedicalHistoriesByPatientId(patientId); // ← here
        if (!cancelled) setMedicalHistories(list);                    // ← and here
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch medical histories");
        if (!cancelled) setMedicalHistories([]);
      } finally {
        if (!cancelled) setMhLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);


  const columns: ColumnDef<medicalHistory>[] = [
    { accessorKey: "appointment_id", header: "Appointment ID" },
    { accessorKey: "patient_id", header: "Patient ID" },
    // your payload has visit_date (not "date")
    {
      accessorKey: "visit_date",
      header: "Visit Date",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
    { accessorKey: "diagnosis", header: "Diagnosis" },
    { accessorKey: "symptoms", header: "Symptoms" },
    { accessorKey: "allergies", header: "Allergies" },
    { accessorKey: "notes", header: "Notes" },
    {
      accessorKey: "follow_up_date",
      header: "Follow-up Date",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ getValue }) => {
        const v = getValue() as string | null | undefined;
        return v ? new Date(v).toLocaleString() : "-";
      },
    },
  ];

  // Build the table on every render; use [] while loading
  const table = useReactTable({
    data: mhLoading ? [] : medicalHistories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (mhLoading) return <div>Loading...</div>;
  if (medicalHistories.length === 0) return <div>No medical histories found.</div>;

  return <DataTable table={table} />;
}

function MedicationTable({ patientId }: { patientId: number }) {
  const [medications, setMedications] = useState<Array<medication>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [mhLoading, setMhLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMhLoading(true);

    (async () => {
      try {
        const list = await getMedicationsByPatientId(patientId); // ← here
        if (!cancelled) setMedications(list);                    // ← and here
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to fetch medications");
        if (!cancelled) setMedications([]);
      } finally {
        if (!cancelled) setMhLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const columns: ColumnDef<medication>[] = [
      {
        accessorKey: "appointment_id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Appointment ID
          </Button>
        ),
      },
      {
        accessorKey: "patient_id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Patient ID
          </Button>
        ),
      },
      {
        accessorKey: "name", // fixed
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Patient Name
          </Button>
        ),
      },
      {
        accessorKey: "consultation_note", // fixed
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Consultation Notes
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{String(getValue() ?? "")}</span>
        ),
      },
      {
        accessorKey: "prescription_items_details",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Prescription Items Details
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="line-clamp-2">{String(getValue() ?? "")}</span>
        ),
      },
      {
        accessorKey: "prescribed_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Prescribed At
          </Button>
        ),
        cell: ({ getValue }) => {
          const raw = String(getValue() ?? "");
          const d = new Date(raw);
          return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
        },
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ getValue }) => <span>{getValue() ? "Yes" : "No"}</span>,
      },
    ];
    const table = useReactTable({
    data: medications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (mhLoading) return <div>Loading...</div>;
  if (medications.length === 0) return <div>No medications found.</div>;

  return <DataTable table={table} />;
}
