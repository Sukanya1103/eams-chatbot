"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Role } from "@/types/user";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";
import HrSidebar from "./HrSidebar";
import ManagerSidebar from "./ManagerSidebar";
import ProfileMenu from "./ProfileMenu";

export default function DashboardShell({
  role,
  userName,
  email,
  children,
}: {
  role: Role;
  userName?: string;
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileState, setMobileState] = useState({ open: false, pathname });
  const mobileOpen = mobileState.open && mobileState.pathname === pathname;
  const setMobileOpen = useCallback((open: boolean) => setMobileState({ open, pathname }), [pathname]);
  const displayName = userName || email.split("@")[0] || "User";

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen, setMobileOpen]);

  const sidebarProps = {
    collapsed: collapsed && !mobileOpen,
    onToggle: () => setCollapsed((current) => !current),
    onClose: () => setMobileOpen(false),
    onNavigate: () => setMobileOpen(false),
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FA]">
      <header className="sticky top-0 z-[60] flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 text-[#1F2937] shadow-sm shadow-slate-900/[0.06] sm:px-6 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileOpen} aria-controls="dashboard-navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-[#17324D] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 md:hidden">
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="leading-tight"><p className="text-lg font-black tracking-tight text-[#17324D]">EAMS</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">Enterprise Portal</p></div>
        </div>
        <div className="ml-auto flex shrink-0 items-center">
          <ProfileMenu userName={displayName} email={email} role={role} />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {mobileOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/50 backdrop-blur-[1px] md:hidden" />}
        <aside id="dashboard-navigation" className={`fixed inset-y-16 left-0 z-50 w-72 transform bg-[#24445F] shadow-xl shadow-slate-950/15 transition-[width,transform] duration-200 md:sticky md:top-16 md:bottom-auto md:h-[calc(100vh-4rem)] md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "md:w-20" : "md:w-64"}`}>
          {role === "ADMIN" ? <AdminSidebar {...sidebarProps} />
            : role === "HR" ? <HrSidebar {...sidebarProps} />
              : role === "MANAGER" ? <ManagerSidebar {...sidebarProps} />
                : <EmployeeSidebar {...sidebarProps} />}
        </aside>

        <main className="min-w-0 flex-1 bg-[#F4F7FA]">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
