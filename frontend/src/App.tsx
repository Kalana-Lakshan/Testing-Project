import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './DefaultLayout';
import Dashboard from './pages/dashboard';
import { Skeleton } from "./components/ui/skeleton";
import SignIn from "./pages/Authentication/sign-in";
import SignUp from './pages/Authentication/sign-up';
import Users from './pages/users/users';
import { ThemeProvider } from './components/theme-provider';


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

          </Route>
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App
