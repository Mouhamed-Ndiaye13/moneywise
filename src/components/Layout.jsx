import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-40 md:ml-64">
          <Navbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Contenu des pages */}
        <main className="flex-1 mt-16 md:ml-64 p-4 md:p-6 transition-all duration-300">
          <Outlet />
        </main>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
