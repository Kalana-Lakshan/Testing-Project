import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Droplet, MapPin, Phone, User } from "lucide-react";
import { CalendarDays, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "@/lib/toast";
import { fetchTotalBranchesCount, fetchTotalPatientsCount, fetchTotalStaffsCount } from "@/services/adminDashboardServices";





const AdminDashboard: React.FC = () => {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [totalStaffs, setTotalStaffs] = useState<number | null>(null);
  const [totalBranches, setTotalBranches] = useState<number | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTotalPatientsCount();
        setTotalPatients(data.total_count);

        const staffData = await fetchTotalStaffsCount();
        setTotalStaffs(staffData.total_count);

        const branchData = await fetchTotalBranchesCount();
        setTotalBranches(branchData.total_count);
      } catch (error) {
        console.error("Error fetching total patients count:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* <h1>
        hiii this is admin Dashboard
        <br />
        total patients are: {totalPatients}
        <br />
        total staffs are: {totalStaffs}
        <br />
        total branches are: {totalBranches}
      </h1>

      <div>
        <h2> appointments by date</h2>
      </div> */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </>
  );
};

export default AdminDashboard;