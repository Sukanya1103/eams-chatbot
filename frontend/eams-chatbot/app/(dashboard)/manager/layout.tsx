import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLE_HOME } from "@/types/user";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "MANAGER") {
    redirect(ROLE_HOME[user.role]);
  }

  return children;
}
