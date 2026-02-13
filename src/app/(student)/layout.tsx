"use client";

import { usePathname } from "next/navigation";
import { StudentShell } from "@/components/dashboard/student-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname === "/student/chat";

  if (isChatPage) {
    return <>{children}</>;
  }
  return <StudentShell>{children}</StudentShell>;
}
