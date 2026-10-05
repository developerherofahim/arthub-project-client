"use client";

import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { useState } from "react";


export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-art-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 pt-5 sm:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}