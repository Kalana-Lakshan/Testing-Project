import { useEffect, useState } from "react";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Droplet, MapPin, Phone, User, UserCheck, Building2, Users, DollarSign } from "lucide-react";
import { CalendarDays, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "@/lib/toast";
import { fetchTotalBranchesCount, fetchTotalPatientsCount, fetchTotalStaffsCount, type fetchMonthlyAppointmentsCountResponse } from "@/services/adminDashboardServices";
import { MonthlyAppointmentsChart } from "./monthlyappoinmenttable";
import { MonthlyRevenueChart } from "./monthlyrevenuetable";
import { fetchMonthlyRevenueForYear } from "@/services/adminDashboardServices";
import { getPatientsCountPerBranch } from "@/services/patientServices";
import { BranchPatientsPieChart } from "./piechartbranchesandpatients";





const AdminDashboard: React.FC = () => {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [totalStaffs, setTotalStaffs] = useState<number | null>(null);
  const [totalBranches, setTotalBranches] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [patientsCountPerBranch, setPatientsCountPerBranch] = useState<{ branch_name: string; patient_count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTotalPatientsCount();
        setTotalPatients(data.total_count);
      } catch (error) {
        console.error("Error fetching total patients count:", error);
      }

      try {
        const staffData = await fetchTotalStaffsCount();
        setTotalStaffs(staffData.total_count);
      } catch (error) {
        console.error("Error fetching total staffs count:", error);
      }

      try {
        const branchData = await fetchTotalBranchesCount();
        setTotalBranches(branchData.total_count);
      } catch (error) {
        console.error("Error fetching total branches count:", error);
      }

      try {
        const year = new Date().getFullYear();
        const rows = await fetchMonthlyRevenueForYear(year);

        // Get current month (format: YYYY-MM)
        const currentMonth = new Date().toISOString().slice(0, 7);
        const current = rows.find((r) => r.month === currentMonth);

        setRevenue(Number(current?.revenue ?? 0));
      } catch (err) {
        console.error("Failed to fetch current month revenue:", err);
      }

      try {
        const counts = await getPatientsCountPerBranch();
        setPatientsCountPerBranch(counts);
      } catch (error) {
        console.error("Error fetching patients count per branch:", error);
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Patients
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">{totalPatients}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">Active and discharged patients</p>
          </CardFooter>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Staffs
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <UserCheck className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">{totalStaffs}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">All registered staff members</p>
          </CardFooter>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-100 text-base font-medium flex items-center gap-2">
              Total Branches
            </CardTitle>
            <div className="p-2 rounded-full bg-neutral-800">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">{totalBranches}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">Operating medical branches</p>
          </CardFooter>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium text-gray-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Current Month Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-semibold text-gray-100">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "LKR", // change to your currency
                minimumFractionDigits: 2,
              }).format(revenue ?? 0)}
            </p>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
            </p>
          </CardFooter>
        </Card>
      </div>
      <br />
      <div className="flex flex-col w-full">
        <Tabs defaultValue="Appointments" className="w-full">
          {/* Tab buttons */}
          <div className="flex justify-center ">
            <TabsList className="rounded-full">
              <TabsTrigger value="Appointments" className="rounded-full">
                Monthly Appointments
              </TabsTrigger>
              <TabsTrigger value="Revenue" className="rounded-full">
                Monthly Revenue
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="Appointments" className="mt-6">
            <MonthlyAppointmentsChart />
          </TabsContent>

          <TabsContent value="Revenue" className="mt-6">
            <MonthlyRevenueChart />
          </TabsContent>
        </Tabs>
      </div>
      <br />
      <div className="w-[400px] mx-left">
        <BranchPatientsPieChart />
      </div>



    </>
  );
};

export default AdminDashboard;