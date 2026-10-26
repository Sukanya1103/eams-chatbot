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
  employeeName,
  children,
}: {
  role: Role;
  employeeName?: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCollapsed = () => setCollapsed((current) => !current);

  const isEmployee = role === "EMPLOYEE";

  const isAdmin = role === "ADMIN";

  return (
    <div
      className={`flex min-h-screen ${
        isAdmin
          ? "bg-[radial-gradient(ellipse_at_8%_0%,rgba(139,121,255,0.16),transparent_34%),radial-gradient(ellipse_at_92%_86%,rgba(113,145,224,0.12),transparent_34%),linear-gradient(135deg,#f5f5fb_0%,#eef1f8_52%,#f5f3fa_100%)]"
          : "bg-cyan-50"
      }`}
    >
      {isEmployee && mobileOpen && <button aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" />}
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
          <EmployeeSidebar collapsed={collapsed} onToggle={toggleCollapsed} onNavigate={() => setMobileOpen(false)} />
        )}
      </aside>
      <main className={`min-w-0 flex-1 ${isEmployee ? "p-4 md:p-8" : "p-5 md:p-8"}`}>
        {isEmployee && <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-300 bg-white text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600 md:hidden"><span aria-hidden="true">☰</span></button><span className="text-sm font-black tracking-wide text-slate-800 md:hidden">EAMS</span></div><div className="flex items-center gap-3"><span className="hidden text-sm font-medium text-slate-600 sm:inline">{employeeName}</span><span aria-label={`${employeeName ?? "Employee"} profile`} title={employeeName} className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm">{employeeName?.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "E"}</span></div></div>}
        {children}
      </main>
    </div>
  );
}
