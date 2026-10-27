"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";
import SidebarIcon, { type SidebarIconName } from "./SidebarIcon";

const ITEMS: { label: string; href: string; icon: SidebarIconName }[] = [
  { label: "Dashboard", href: "/employee", icon: "dashboard" },
  { label: "Attendance", href: "/employee/my-attendance", icon: "attendance" },
  { label: "Leave", href: "/employee/my-leaves", icon: "leave" },
  { label: "Holiday", href: "/employee/holiday", icon: "holiday" },
  { label: "Overtime", href: "/employee/overtime", icon: "overtime" },
  { label: "Work From Home", href: "/employee/work-from-home", icon: "home" },
  { label: "Performance Report", href: "/employee/performance-report", icon: "performance" },
  { label: "Policies", href: "/employee/policies", icon: "policy" },
  { label: "Chatbot", href: "/employee/chatbot", icon: "chat" },
] as const;

export default function EmployeeSidebar({
  collapsed,
  onToggle,
  onClose,
  onNavigate,
}: SidebarCollapseProps & {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Employee navigation" className={`flex h-full flex-col justify-between overflow-y-auto ${collapsed ? "p-3" : "p-4"}`}>
      <div>
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} onClose={onClose} workspaceLabel="Employee workspace" />
        <ul className="space-y-1">
          {ITEMS.map((item) => {
            const href = item.href;
            const active = href === "/employee" ? pathname === href : href ? pathname.startsWith(href) : false;
            const content = <><SidebarIcon name={item.icon} /><span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span></>;
            return <li key={item.label}>
<<<<<<< HEAD
              {href ? (
                <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${collapsed ? "justify-center" : ""} ${active ? "bg-[#3B82F6] text-white shadow-sm" : "text-slate-100 hover:bg-white/10 hover:text-white"}`}>
                  {content}
                </Link>
              ) : (
                <div aria-disabled="true" title={`${item.label} employee page is not available`} className={`flex min-h-10 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 ${collapsed ? "justify-center" : ""}`}>
                  {content}
                </div>
              )}
=======
              <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${collapsed ? "justify-center" : ""} ${active ? "bg-[#3B82F6] text-white shadow-sm" : "text-slate-100 hover:bg-white/10 hover:text-white"}`}>
                {content}
              </Link>
>>>>>>> origin/feature/manager
            </li>;
          })}
        </ul>
      </div>
    </nav>
  );
}
