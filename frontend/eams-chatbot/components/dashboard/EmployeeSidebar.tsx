// components/dashboard/EmployeeSidebar.tsx
// EMPLOYEE role — can only ever see their own data, so links stay
// generic ("My attendance") rather than naming anyone.
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";

const LINKS = [
  { href: "/employee", label: "Overview" },
  { href: "/employee/my-attendance", label: "My attendance" },
  { href: "/employee/my-leaves", label: "My leaves" },
  { href: "/employee/my-salary", label: "My salary" },
];

export default function EmployeeSidebar({ collapsed, onToggle }: SidebarCollapseProps) {
  return (
    <nav className={`flex h-full flex-col justify-between ${collapsed ? "p-3" : "p-5"}`}>
      <div className="space-y-1">
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
        {!collapsed && <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">Employee workspace</p>}
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} collapsed={collapsed} />
        ))}
      </div>
      <LogoutButton collapsed={collapsed} />
    </nav>
  );
}
