"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/student/profile");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Redirecting to profile…</p>
    </div>
  );
}
