// app/(dashboard)/layout.tsx
// Shared shell for all four dashboards. Reads the session ON THE SERVER
// (via the cookie) so the correct sidebar renders with no client-side
// flash of the wrong UI. Actual page content (attendance, leaves, etc.)
// renders as `children` inside each role's own route folder.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import ChatLauncher from "@/components/chatbot/ChatLauncher";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { employeeDisplayName } from "./employee/employeeName";

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
    <>
      <DashboardShell role={user.role} employeeName={user.role === "EMPLOYEE" ? employeeDisplayName(user.name) ?? undefined : undefined}>{children}</DashboardShell>
      <ChatLauncher />
    </>
  );
}
