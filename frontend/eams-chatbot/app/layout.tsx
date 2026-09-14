// app/layout.tsx
// Root layout — wraps literally every page, including /login.
// Keep this minimal; role-specific chrome (sidebars etc.) lives one
// level down in app/(dashboard)/layout.tsx instead.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EAMS",
  description: "Employee attendance, leave, and salary management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-cyan-50 text-slate-950 antialiased">{children}</body>
    </html>
  );
}
