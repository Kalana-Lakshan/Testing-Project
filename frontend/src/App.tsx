import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './DefaultLayout';
import Dashboard from './pages/dashboard';
import { Skeleton } from "./components/ui/skeleton";
import SignIn from "./pages/Authentication/sign-in";
import SignUp from './pages/Authentication/sign-up';
import Users from './pages/users/activeUsers';
import DoctorsDetails from './pages/doctors/doctorsDetails';
import { ThemeProvider } from './components/theme-provider';
import DoctorsAppointmentDetails from './pages/doctors/doctorsAppointmentDetails';


function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return loading ? (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-[500px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    </ThemeProvider>
  ) : (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <Routes>
          <Route
            path="/sign-in"
            element={
              <>
                <PageTitle title="Sign-in | MedSync" />
                <SignIn />
              </>
            }
          />

          <Route
            path="/sign-up"
            element={
              <>
                <PageTitle title="Sign-up | MedSync" />
                <SignUp />
              </>
            }
          />

          <Route element={<DefaultLayout />}>
            <Route
              index
              element={
                <>
                  <PageTitle title="Dashboard | MedSync" />
                  <Dashboard />
                </>
              }
            />

            <Route
              path="/users"
              element={
                <>
                  <PageTitle title="Users | MedSync" />
                  <Users />
                </>
              }
            />

            <Route
              path="/doctors"
              element={
                <>
                  <PageTitle title="Doctors | MedSync" />
                  <DoctorsDetails />
                </>
              }
            />

            <Route
              path="/doctors-appointments"
              element={
                <>
                  <PageTitle title="Appointment details | MedSync" />
                  <DoctorsAppointmentDetails />
                </>
              }
            />

          </Route>
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App
