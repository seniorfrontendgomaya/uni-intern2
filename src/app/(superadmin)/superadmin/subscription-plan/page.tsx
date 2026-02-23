"use client";

import { useSearchParams } from "next/navigation";
import { SubscriptionPlanPage } from "@/components/pages/subscription-plan-page";

export default function SuperadminSubscriptionPlanPage() {
  const searchParams = useSearchParams();
  const planTypeId = searchParams.get("planTypeId") ?? "";

  if (!planTypeId) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">
          No plan type selected. Please navigate from the Plan Type table to
          manage plan names under a type.
        </p>
      </main>
    );
  }

  return <SubscriptionPlanPage planTypeId={planTypeId} />;
}
