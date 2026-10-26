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
import { ManagerNavigationContext, type ManagerSection } from "./ManagerNavigationContext";

export default function DashboardShell({
  role,
  userName,
  email,
  children,
}: {
  role: Role;
  userName?: string;
  email?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [managerSection, setManagerSection] = useState<ManagerSection>("Overview");
  const [mobileState, setMobileState] = useState({ open: false, pathname });
  const mobileOpen = mobileState.open && mobileState.pathname === pathname;
  const setMobileOpen = useCallback((open: boolean) => setMobileState({ open, pathname }), [pathname]);
  const displayName = userName || email?.split("@")[0] || "User";

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
    <ManagerNavigationContext.Provider value={{ section: managerSection, setSection: setManagerSection }}>
    <div className="min-h-screen bg-cyan-50">
        <header className="sticky top-0 z-50 flex h-[88px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600 md:hidden"
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div>
              <p className="text-xl font-bold tracking-tight text-[#17324D]">EAMS</p>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500">ENTERPRISE PORTAL</p>
            </div>
          </div>
          <ProfileMenu userName={displayName} email={email ?? ""} role={role} />
        </header>
      <div className="flex min-h-[calc(100vh-88px)]">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-x-0 bottom-0 top-[88px] z-30 bg-slate-950/50 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-[88px] left-0 z-40 w-72 bg-cyan-700 shadow-xl shadow-cyan-950/15 transition-transform duration-200 md:sticky md:top-[88px] md:h-[calc(100vh-88px)] md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-20" : "md:w-72"}`}
      >
        {role === "ADMIN" ? (
          <AdminSidebar {...sidebarProps} />
        ) : role === "HR" ? (
          <HrSidebar {...sidebarProps} />
        ) : role === "MANAGER" ? (
          <ManagerSidebar {...sidebarProps} />
        ) : (
          <EmployeeSidebar {...sidebarProps} />
        )}
      </aside>
      <main className="min-w-0 flex-1">
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
    </div>
    </ManagerNavigationContext.Provider>
  );
}
