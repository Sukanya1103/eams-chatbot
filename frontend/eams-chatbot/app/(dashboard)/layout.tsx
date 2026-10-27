// Shared shell for all four dashboards. Reads the session on the server so
// the correct workspace renders without a client-side role flash.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChatLauncher from "@/components/chatbot/ChatLauncher";
import { decodeSession, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { employeeDisplayName } from "./employee/employeeName";
import { getMyProfile } from "@/lib/server/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = decodeSession(token);

  if (!user) {
    redirect("/login");
  }

  const profile = await getMyProfile();
  const fallbackName = user.role === "ADMIN" ? "Admin" : user.role === "HR" ? "HR" : user.role === "MANAGER" ? "Manager" : "Employee";
  const displayName = employeeDisplayName(profile?.name) ?? employeeDisplayName(user.name) ?? fallbackName;

  return (
    <>
      <DashboardShell role={user.role} userName={displayName} email={user.email}>{children}</DashboardShell>
      <ChatLauncher />
    </>
  );
}
