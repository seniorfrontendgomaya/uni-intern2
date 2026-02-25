"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { CheckCircle } from "lucide-react";

export default function SubscribeReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id") ?? "";

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams?.forEach((value, key) => {
      params[key] = value;
    });
    console.log("Cashfree return response (query params):", params);
    console.log("Full return URL:", typeof window !== "undefined" ? window.location.href : "");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Payment submitted</h1>
          <p className="mt-2 text-sm text-gray-600">
            Thank you. We will confirm your subscription once the payment is verified.
          </p>
          {orderId && (
            <p className="mt-2 text-xs text-gray-500">Order reference: {orderId}</p>
          )}
          <Link
            href="/internships/subscribe"
            className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
          >
            Back to plans
          </Link>
        </div>
      </main>
      <FooterClientMount />
    </div>
  );
}
