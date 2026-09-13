// app/(dashboard)/layout.tsx
// Shared shell for all four dashboards. Reads the session ON THE SERVER
// (via the cookie) so the correct sidebar renders with no client-side
// flash of the wrong UI. Actual page content (attendance, leaves, etc.)
// renders as `children` inside each role's own route folder.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import HrSidebar from "@/components/dashboard/HrSidebar";
import ManagerSidebar from "@/components/dashboard/ManagerSidebar";
import EmployeeSidebar from "@/components/dashboard/EmployeeSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = decodeSession(token);

  // Belt-and-suspenders: middleware already guards these routes, but a
  // server component should never assume a null user can't reach here.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
        {renderSidebar(user.role)}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function renderSidebar(role: string) {
  switch (role) {
    case "ADMIN":
      return <AdminSidebar />;
    case "HR":
      return <HrSidebar />;
    case "MANAGER":
      return <ManagerSidebar />;
    default:
      return <EmployeeSidebar />;
  }
}
