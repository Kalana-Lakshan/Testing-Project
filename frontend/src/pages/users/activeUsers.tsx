import { getAllUsers, type User } from "@/services/userService";
import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createTimer, formatRole, toNormalTimestamp } from "@/services/utils";
import { Eye, Trash } from "lucide-react";
import { Role } from "@/utils";
import DeleteUser from "./user-delete";
import ViewUser from "./user-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAllBranches } from "@/services/branchServices";
import { Roles } from "../Authentication/staff-sign-up";


const Users: React.FC = () => {
  const [Users, setUsers] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<"edit" | "delete" | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          User ID
        </Button>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Username
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Role
        </Button>
      ),
      cell: ({ row }) => formatRole(row.original.role),
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
      cell: ({ row }) => toNormalTimestamp(row.original.created_at),
    },
    {
      accessorKey: "is_approved",
      header: "Approved",
      cell: ({ row }) => (row.original.is_approved ? "True" : "False"),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.role === Role.SUPER_ADMIN) {
          return <div className="text-muted-foreground mt-3 h-6">N/A</div>;
        }
        return (
          <div className="flex gap-2">

            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setSelectedUser(row.original);
                setAction("edit");
              }}
            >
              <Eye />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => {
                setSelectedUser(row.original);
                setAction("delete");
              }}
            >
              <Trash />
            </Button>

          </div>
        );
      },
    },
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState<number>(-1); // total pages

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: Users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    pageCount,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const fetchUsers = useCallback(async () => {
    const tableState = table.getState();
    const page = tableState.pagination.pageIndex + 1;
    const itemsPerPage = tableState.pagination.pageSize;
    toast.loading("Loading...");

    return Promise.allSettled([
      getAllUsers(itemsPerPage, (page - 1) * itemsPerPage, String(selectedRole), selectedBranch === "All" ? "-1" : selectedBranch),
      createTimer(500),
    ])
      .then((hu) => {
        if (hu[0].status === "rejected") {
          throw hu[0].reason;
        }
        setUsers(hu[0].value.users);
        console.log("set", hu[0].value, itemsPerPage);
        setPageCount(Math.ceil(hu[0].value.user_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch users");
        }
      })
      .finally(() => {
        toast.dismiss();
      });
  }, [table, selectedBranch, selectedRole]);


  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b) => ({
          value: String(b.branch_id),
          label: b.name,
        }));
        setBranches(mappedBranches);
      } catch (err) {
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pagination, selectedRole, selectedBranch]);
  return (
    <>
      <div className="grid gap-4 grid-cols-6 mb-4">
        <div className="grid gap-2">
          <Label>Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole} >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="All">All</SelectItem>
              {Roles.map((r) => (
                console.log(r),
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch} >
            <SelectTrigger id="branch" className="w-full">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="All" value="All">All</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ViewUser
        isOpen={action === "edit" && selectedUser !== null}
        selectedUser={selectedUser}
        onFinished={fetchUsers}
        onClose={() => {
          setAction(null);
          setSelectedUser(null);
        }}
      />

      <DeleteUser
        isOpen={action === "delete" && selectedUser !== null}
        selectedUser={selectedUser}
        onFinished={fetchUsers}
        onClose={() => {
          setAction(null);
          setSelectedUser(null);
        }}
      />
      <DataTable table={table} />
    </>
  );
};

export default Users;