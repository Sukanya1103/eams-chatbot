"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Role } from "@/types/user";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";
import HrSidebar from "./HrSidebar";
import ManagerSidebar from "./ManagerSidebar";

export default function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((current) => !current);

  return (
    <div className="flex min-h-screen bg-cyan-50">
      <aside
        className={`shrink-0 bg-cyan-700 shadow-xl shadow-cyan-950/15 transition-[width] duration-200 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {role === "ADMIN" ? (
          <AdminSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        ) : role === "HR" ? (
          <HrSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        ) : role === "MANAGER" ? (
          <ManagerSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        ) : (
          <EmployeeSidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        )}
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
