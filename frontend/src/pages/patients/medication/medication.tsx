import { DataTable } from "../../../components/data-table";
import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toast";
import { getAllMedications, getMedicationsByPatientId, type medication } from "@/services/medicationServices";
// import { Link } from "react-router-dom";
const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Array<medication>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [patientIdInput, setPatientIdInput] = useState<string>("");

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

  useEffect(() => {
    const t = toast.loading("Loading medications...");
    getAllMedications()
      .then(setMedications)
      .catch(() => toast.error("Failed to fetch medications"))
      .finally(() => toast.dismiss(t));
  }, []);

  const handleSearch = async () => {
    const parsed = parseInt(patientIdInput.trim(), 10);
    if (Number.isNaN(parsed)) {
      toast.warning("Please enter a valid integer Patient ID");
      return;
    }
    const t = toast.loading(`Loading medications for patient ${parsed}...`);
    try {
      const data = await getMedicationsByPatientId(parsed);
      setMedications(data);
      toast.info(`Loaded ${data.length} record(s)`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        "Failed to fetch medications for that patient";
      toast.error(msg);
    } finally {
      toast.dismiss(t);
    }
  };

  const handleClear = async () => {
    const t = toast.loading("Loading all medications...");
    try {
      const data = await getAllMedications();
      setMedications(data);
      setPatientIdInput("");
    } catch {
      toast.error("Failed to fetch medications");
    } finally {
      toast.dismiss(t);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Medications</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Patient ID…"
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            className="w-40 border rounded-md px-3 py-2"
            inputMode="numeric"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      <DataTable table={table} />
    </>
  );
};

export default Medications;