"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirect /login to landing page. Login is handled via LoginModal on the landing page. */
export default function LoginRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
