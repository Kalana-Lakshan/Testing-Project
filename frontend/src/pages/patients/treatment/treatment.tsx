import { getAllTreatments, type Treatment } from "@/services/treatmentServices";
import { DataTable } from "../../../components/data-table";
import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";



const Treatments: React.FC = () => {
  
  const [treatments, setTreatments] = useState<Array<Treatment>>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Treatment>[] = [
    {
      accessorKey: "service_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Service Code
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Name
        </Button>
      ),
    },
    {
      accessorKey: "fee",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Fee
        </Button>
      ),
      cell: ({ getValue }) => {
      const v = getValue<number | string>();
      const num = typeof v === "string" ? parseFloat(v) : v;
      return "Rs. " + (num ?? 0).toFixed(2); // -> Rs. 500.00
    },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Description
        </Button>
      ),
    },
    // {
    //   accessorKey: "speciality_id",
    //   header: "Speciality ID",
    // },
    {
        accessorKey: "speciality_name",
        header: "Speciality Name",
    }
  ];

  const table = useReactTable({
    data: treatments,
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
      toast.loading("Loading treatments...");
      try {
        const data = await getAllTreatments(); 
        setTreatments(data.treatments);
      } catch (error) {
        toast.error("Failed to fetch treatments");
      } finally {
        toast.dismiss();
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Treatments</h1>
        <Link to="/patients/treatment/add">
          <Button>+ Add Treatment</Button>
        </Link>
      </div>

      {treatments.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No treatments yet. Click <span className="font-medium">+ Add Treatment</span> to create one.
        </div>
      ) : (
        <DataTable table={table} />
      )}
    </>
  );
};





export default Treatments;
