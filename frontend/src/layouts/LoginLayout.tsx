import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  return (
    <>
      <main className="flex-1 p-4 md:p-6 2xl:p-10">
        <Outlet />
      </main>
    </>
  );
}