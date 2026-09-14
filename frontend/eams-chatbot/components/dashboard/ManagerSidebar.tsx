// components/dashboard/ManagerSidebar.tsx
// Every link here is implicitly scoped to "my team" by the backend's
// DataScopeService, not by anything in this component.
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/manager", label: "Overview" },
  { href: "/manager/team-attendance", label: "Team attendance" },
  { href: "/manager/team-leaves", label: "Team leaves" },
];

export default function ManagerSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-5">
      <div className="space-y-1">
        <div className="mb-8 px-3"><p className="text-lg font-black tracking-tight text-white">EAMS</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Enterprise portal</p></div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">Manager workspace</p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
