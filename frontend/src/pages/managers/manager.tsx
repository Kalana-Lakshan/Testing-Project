import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createTimer, formatSalary } from "@/services/utils";
import { Eye } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getAllBranches } from "../../services/branchServices";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { Navigate } from "react-router-dom";
import ViewBranchManager from "./manager-view";
import { getAllManagers, type BranchManager } from "@/services/managerServices";



const BranchManagerPage: React.FC = () => {
  const [manager, setManager] = useState<Array<BranchManager>>([]);
  const [managerCount, setManagerCount] = useState<number>(0);
  const [selectedManager, setSelectedManager] = useState<BranchManager | null>(null);
  const [action, setAction] = useState<"edit" | null>(null);
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const user = localStorage.getItem(LOCAL_STORAGE__USER)
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const columns: ColumnDef<BranchManager>[] = [
    {
      accessorKey: "manager_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Manager ID
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
      accessorKey: "branch_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Branch
        </Button>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Gender
        </Button>
      ),
    },
    {
      accessorKey: "monthly_salary",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Monthly Salary
        </Button>
      ),
      cell: ({ row }) => formatSalary(Number(row.original.monthly_salary)),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedManager(row.original);
              setAction("edit");
            }}
          >
            <Eye />
          </Button>
        );
      },
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: manager,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const fetchStaff = useCallback(async () => {
    toast.loading("Loading...");

    try {
      const response = await Promise.allSettled([
        getAllManagers(
          (selectedBranch == "All")
            ? -1
            : Number(selectedBranch)
        ),
        createTimer(500),
      ]);

      if (response[0].status === "rejected") {
        throw response[0].reason;
      }

      setManager(response[0].value.managers);
      setManagerCount(response[0].value.manager_count);
      setErrorCode(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorCode(404);
      } else {
        toast.error("Failed to fetch staff");
      }
    } finally {
      toast.dismiss();
    }
  }, [table, selectedBranch]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b: { branch_id: number; name: string }) => ({
          value: String(b.branch_id),
          label: b.name,
        }));
        setBranches(mappedBranches);
      } catch {
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, selectedBranch, errorCode]);
  return (
    <div className="space-y-6 p-4">
      <ViewBranchManager
        isOpen={action === "edit" && selectedManager !== null}
        selectedManager={selectedManager}
        onFinished={fetchStaff}
        onClose={() => {
          setAction(null);
          setSelectedManager(null);
        }}
      />

      <div>
        <h2 className="text-lg font-medium">All Branch Managers</h2>
        <p className="text-sm text-muted-foreground">{managerCount} items</p>
      </div>

      <div className="grid gap-4 grid-cols-6 mb-4">
        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger id="branch" className="w-full">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="All">
                All
              </SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable table={table} errorCode={errorCode} hideHeader={true} />
    </div>
  );
};

export default BranchManagerPage;