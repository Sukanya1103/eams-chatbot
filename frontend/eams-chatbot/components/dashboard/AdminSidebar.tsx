// components/dashboard/AdminSidebar.tsx
import SidebarLink from "./SidebarLink";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/employees", label: "Accounts & roles", icon: "users" },
  { href: "/admin/attendance", label: "Attendance oversight", icon: "attendance" },
  { href: "/admin/leaves", label: "Leave overrides", icon: "leave" },
  { href: "/admin/reports", label: "Organization reports", icon: "reports" },
  { href: "/admin/chatbot", label: "Assistant", icon: "chat" },
] as const;

export default function AdminSidebar({ collapsed, onToggle, onClose, onNavigate }: SidebarCollapseProps & { onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin navigation" className={`flex h-full flex-col justify-between overflow-y-auto ${collapsed ? "p-3" : "p-4"}`}>
      <div>
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} onClose={onClose} workspaceLabel="System administration" />
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}
