import ManagerWorkspace from "./ManagerWorkspace";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function ManagerPage() {
  const user = await getCurrentUser();

  return (
    <ManagerWorkspace
      managerName={user?.name ?? "Manager"}
      managerEmail={user?.email ?? ""}
    />
  );
}
