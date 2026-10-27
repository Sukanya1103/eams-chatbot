"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";

const ITEMS = [
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

export default function EmployeeSidebar({ collapsed, onToggle, onClose, onNavigate }: SidebarCollapseProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Employee navigation" className={`flex h-full flex-col justify-between overflow-y-auto ${collapsed ? "p-3" : "p-4"}`}>
      <div>
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} onClose={onClose} workspaceLabel="Employee workspace" />
        <ul className="space-y-1">
          {ITEMS.map((item) => {
            const href = "href" in item ? item.href : undefined;
            const active = href === "/employee" ? pathname === href : href ? pathname.startsWith(href) : false;
            const content = <><Icon name={item.icon} /><span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span></>;
            return <li key={item.label}>
              {href ? (
                <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${collapsed ? "justify-center" : ""} ${active ? "bg-[#3B82F6] text-white shadow-sm" : "text-slate-100 hover:bg-white/10 hover:text-white"}`}>
                  {content}
                </Link>
              ) : (
                <div aria-disabled="true" title={`${item.label} employee page is not available`} className={`flex min-h-10 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 ${collapsed ? "justify-center" : ""}`}>
                  {content}
                </div>
              )}
            </li>;
          })}
        </ul>
      </div>
    </nav>
  );
}

function Icon({ name }: { name: string }) {
  const common = { className: "h-[18px] w-[18px] shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const shapes: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></>,
    attendance: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    leave: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m9 15 2 2 4-4"/></>,
    holiday: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.1-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m14.2 0-1.4-1.4M6.3 6.3 4.9 4.9"/></>,
    overtime: <><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z"/></>,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/><path d="M8 10a6 6 0 0 1 8 0"/></>,
    performance: <><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/><path d="M16 6h4v4"/></>,
    policy: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7m-7 4h7"/></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.5-.7L4 20l1.4-3.5A7.2 7.2 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
  };
  return <svg {...common}>{shapes[name]}</svg>;
}
