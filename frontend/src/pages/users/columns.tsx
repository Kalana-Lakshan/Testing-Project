import { type ColumnDef } from "@tanstack/react-table"

export type User = {
  user_id: number
  username: string
  role: string
  branch_id: number
  created_at: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "branch_id",
    header: "Branch",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
]