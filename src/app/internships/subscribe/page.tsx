"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { fetchSubscribePlans } from "@/services/subscribe-plan.service";
import type { SubscribePlanItem } from "@/types/subscribe-plan";
import { IndianRupee, ArrowLeft } from "lucide-react";

export default function InternshipsSubscribePage() {
  const [plans, setPlans] = useState<SubscribePlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSubscribePlans()
      .then((res) => {
        if (!cancelled && res.data) {
          setPlans(res.data.filter((p) => p.is_active));
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load plans");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/internships"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to internships
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Choose a plan</h1>
          <p className="mt-1 text-gray-600">
            Subscribe to view internship details and apply. Select a plan below.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
            <p>{error}</p>
            <Link
              href="/internships"
              className="mt-3 inline-block text-sm font-medium text-red-800 underline"
            >
              Back to internships
            </Link>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
            <p>No plans available at the moment.</p>
            <Link
              href="/internships"
              className="mt-3 inline-block text-sm font-medium text-foreground underline"
            >
              Back to internships
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm font-medium capitalize text-gray-500">
                  {plan.plan_name}
                </p>
                {plan.description ? (
                  <p className="mt-3 flex-1 text-sm text-gray-600">{plan.description}</p>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="mt-4 flex items-center gap-1.5 text-2xl font-bold text-gray-900">
                  <IndianRupee className="h-7 w-7 text-gray-600" />
                  <span>{plan.price.toLocaleString("en-IN")}</span>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
                >
                  Pay now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <FooterClientMount />
    </div>
  );
}
