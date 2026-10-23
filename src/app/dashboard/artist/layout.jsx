"use client";

import Sidebar from "@/components/artist-dashboard/Sidebar";
import TopBar from "@/components/artist-dashboard/TopBar";
import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";



export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["artist"]}>
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
    </RoleGuard>
  );
}