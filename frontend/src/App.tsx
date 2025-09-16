// import './App.css'
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import DefaultLayout from './DefaultLayout';
import Dashboard from './pages/Dashboard';
import { Skeleton } from "./components/ui/skeleton";
import SignIn from "./pages/Authentication/sign-in";
import SignUp from "./pages/Authentication/sign-up";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
	const { pathname } = useLocation();

  useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

  return loading ? (
		<div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
	) : (
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
                  {/* <SignUp /> */}
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
              path=""
              element={
                <>
                  {/* <PageTitle title="" /> */}
                  {/* < /> */}
                </>
              }
            />

            </Route>
      </Routes>
    </>
  );
}

export default App
