"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudentHeader } from "@/components/ui/student-header";

export function StudentShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "STUDENT") {
      router.replace("/");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return <div className="h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="mx-auto w-full max-w-6xl px-0 pt-0 pb-8 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default StudentShell;

