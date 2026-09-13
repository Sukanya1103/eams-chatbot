// app/page.tsx
// This REPLACES the default Next.js starter content. The root path itself
// renders nothing — it just sends people to the right place immediately.

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLE_HOME } from "@/types/user";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(ROLE_HOME[user.role]);
  }

  redirect("/login");
}
