// components/dashboard/AdminSidebar.tsx
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/reports", label: "Reports" },
];

export default function AdminSidebar({ collapsed, onToggle }: SidebarCollapseProps) {
  return (
    <nav className={`flex h-full flex-col justify-between ${collapsed ? "p-3" : "p-5"}`}>
      <div className="space-y-1">
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
        {!collapsed && <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">Admin workspace</p>}
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} collapsed={collapsed} />
        ))}
      </div>
      <LogoutButton collapsed={collapsed} />
    </nav>
  );
}
