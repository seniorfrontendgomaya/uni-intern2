"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname === "/company/chat";

  if (isChatPage) {
    return <>{children}</>;
  }
  return <DashboardShell>{children}</DashboardShell>;
}
