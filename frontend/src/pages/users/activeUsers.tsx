import { getAllUsers, type UserDTO } from "@/services/userService";
import { DataTable } from "../../components/data-table"
import { useCallback, useEffect, useState } from "react";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createTimer } from "@/services/utils";


const Users: React.FC = () => {
  const [Users, setUsers] = useState<Array<UserDTO>>([]);
  const columns: ColumnDef<UserDTO>[] = [
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
    },
    {
      accessorKey: "is_approved",
      header: "Is_Approved",
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
      getAllUsers(page, itemsPerPage),
      createTimer(500),
    ])
      .then((hu) => {
        if (hu[0].status === "rejected") {
          throw hu[0].reason;
        }
        const mappedUsers: UserDTO[] = hu[0].value.users.map((u: any) => ({
          user_id: u.user_id,
          username: u.username,
          role: u.role,
          branch_name: u.branch_name,
          created_at: u.created_at,
          is_approved: Boolean(u.is_approved),
        }));

        setUsers(mappedUsers);
        // setUsers(hu[0].value.users);
        console.log("set", hu[0].value, itemsPerPage);
        setPageCount(Math.ceil(hu[0].value.user_count / itemsPerPage));
      })
      .catch((error) => {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          toast.error("Failed to fetch unverified students");
        }
      })
      .finally(() => {
        toast.dismiss();
      });
  }, [table]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pagination]);
  return (
    <DataTable table={table} />
  );
};

export default Users;