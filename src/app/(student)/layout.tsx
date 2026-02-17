"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { StudentShell } from "@/components/dashboard/student-shell";
import { useEffect, useState } from "react";

/** Prefetch courses path so the URL is cached when user opens megamenu or navigates. */
function CoursesPathPrefetch() {
  return (
    <Link
      href="/student/courses"
      prefetch
      className="sr-only"
      aria-hidden
    />
  );
}

function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "STUDENT") {
      router.replace("/");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return <div className="h-screen bg-background" />;
  return <>{children}</>;
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname === "/student/chat";

  if (isChatPage) {
    return <StudentAuthGuard>{children}</StudentAuthGuard>;
  }
  return (
    <StudentShell>
      <CoursesPathPrefetch />
      {children}
    </StudentShell>
  );
}
