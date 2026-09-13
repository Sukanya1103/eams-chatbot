// components/dashboard/ManagerSidebar.tsx
// Every link here is implicitly scoped to "my team" by the backend's
// DataScopeService, not by anything in this component.
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/manager", label: "Overview" },
  { href: "/manager/team-attendance", label: "Team attendance" },
  { href: "/manager/team-leaves", label: "Team leaves" },
  { href: "/manager/chatbot", label: "Assistant" },
];

export default function ManagerSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Manager
        </p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
