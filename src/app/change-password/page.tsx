"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/student/change-password");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Redirecting to change password…</p>
    </div>
  );
}
