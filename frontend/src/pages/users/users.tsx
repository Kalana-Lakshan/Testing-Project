import { columns, type User } from "./columns"
import { DataTable } from "./data-table"

const data = [
              {"user_id":1,"username":"admin1","role":"Admin_Staff","branch_id":1,"created_at":"2025-09-23T18:24:38.000Z"},
              {"user_id":2,"username":"admin2","role":"Admin_Staff","branch_id":2,"created_at":"2025-09-23T18:24:38.000Z"},
              {"user_id":3,"username":"user1","role":"Patient","branch_id":3,"created_at":"2025-09-23T18:24:38.000Z"},
              {"user_id":4,"username":"user2","role":"Patient","branch_id":4,"created_at":"2025-09-23T18:24:38.000Z"}
            ]
const Users: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Users;