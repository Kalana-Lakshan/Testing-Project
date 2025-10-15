import { DataTable } from "../../../components/data-table";
import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { getallmedicalhistories, type medicalHistory } from "@/services/medicalhistoryServices";

const MedicalHistory: React.FC = () => {

  const [medicalHistory, setMedicalHistory] = useState<Array<medicalHistory>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<medicalHistory>[] = [
    {
      accessorKey: "medical_history_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Medical History ID
        </Button>
      ),
    },
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
      accessorKey: "visit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Visit Date
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "diagnosis",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Diagnosis
        </Button>
      ),
    },
    {
      accessorKey: "symptoms",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Symptoms
        </Button>
      ),
    },
    {
      accessorKey: "allergies",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Allergies
        </Button>
      ),
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          notes
        </Button>
      ),
    },
    {
      accessorKey: "follow_up_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Follow Up Date
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Created At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Updated At
        </Button>
      ),
      cell: ({ getValue }) => {
        const raw = String(getValue() ?? "");
        const d = new Date(raw);
        return <span>{isNaN(d.getTime()) ? raw : d.toLocaleString()}</span>;
      },
    }
  ];

  const table = useReactTable({
    data: medicalHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const loadingId = toast.loading("Loading medical histories...");
      try {
        const data = await getallmedicalhistories();
        setMedicalHistory(data);
      } catch (error) {
        toast.error("Failed to fetch medical histories");
      } finally {
        toast.dismiss(loadingId);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Medical History</h1>

      </div>



      <DataTable table={table} />

    </>
  );
};





export default MedicalHistory;
