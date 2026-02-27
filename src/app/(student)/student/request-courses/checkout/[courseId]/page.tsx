"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, IndianRupee, Loader2, Wallet } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import { getCourseDetail } from "@/services/course.service";
import type { CourseDetailResponse } from "@/services/course.service";
import { getUserWallet } from "@/services/user-wallet.service";
import { createCourseSubscription } from "@/services/course-subscription.service";
import toast from "react-hot-toast";

type CourseDetail = NonNullable<CourseDetailResponse["data"]>;

/** Format wallet balance for display; shows only amount. */
function formatWalletDisplay(wallet: { balance: string; credits: number } | null): string {
  const balanceNum =
    wallet?.balance != null ? Number.parseFloat(wallet.balance) : 0;
  if (!Number.isFinite(balanceNum) || balanceNum <= 0) return "₹0.00";
  const balanceStr = balanceNum.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${balanceStr}`;
}

export default function RequestCourseCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<{ balance: string; credits: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUserWallet()
      .then((data) => {
        if (!cancelled && data) setWallet({ balance: data.balance, credits: data.credits });
      })
      .catch(() => {
        if (!cancelled) setWallet(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!courseId) {
      setError("Invalid course");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCourseDetail(courseId)
      .then((data) => {
        if (!cancelled) {
          setCourse(data ?? null);
          if (data == null) setError("Course not found");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load course details");
          setCourse(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/request-courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-100 p-2 shadow px-4 rounded-xl">
            <Wallet className="h-4 w-4" />
            {formatWalletDisplay(wallet)}
          </span>
        </div>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/request-courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-100 p-2 shadow px-4 rounded-xl">
            <Wallet className="h-4 w-4" />
            {formatWalletDisplay(wallet)}
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-red-600">{error ?? "Course not found"}</p>
        </div>
      </div>
    );
  }

  const fees = course.fees != null ? Number(course.fees) : 0;
  const hasValidFees = Number.isFinite(fees) && fees >= 0;
  const walletBalanceRaw =
    wallet?.balance != null ? Number.parseFloat(wallet.balance) : 0;
  const walletBalance =
    Number.isFinite(walletBalanceRaw) && walletBalanceRaw > 0
      ? walletBalanceRaw
      : 0;
  // Wallet is always auto-applied up to min(wallet balance, course amount)
  const appliedWalletAmount =
    hasValidFees && walletBalance > 0 ? Math.min(walletBalance, fees) : 0;
  const finalAmount = Math.max(fees - appliedWalletAmount, 0);

  const handleCheckout = async () => {
    if (!hasValidFees) {
      toast.error("Invalid course amount");
      return;
    }
    const numericCourseId = Number(courseId);
    if (!Number.isFinite(numericCourseId)) {
      toast.error("Invalid course id");
      return;
    }
    const courseRequestIdParam = searchParams.get("requestId");
    const numericCourseRequestId = courseRequestIdParam
      ? Number(courseRequestIdParam)
      : NaN;
    if (!Number.isFinite(numericCourseRequestId)) {
      toast.error("Missing course request id for this checkout.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createCourseSubscription(
        numericCourseId,
        numericCourseRequestId
      );
      const statusCode = res.statusCode ?? 0;
      const data = res.data;

      if (statusCode === 201) {
        toast.success(res.message ?? "Course purchased using wallet.");
        router.replace("/student/courses");
        return;
      }

      if (statusCode === 200 && data) {
        const sessionId =
          (data as { payment_session_id?: string }).payment_session_id ?? "";
        const orderId =
          (data as { order_id?: string }).order_id ?? "";
        if (!sessionId) {
          toast.error("Payment session not received from server.");
          return;
        }
        const cfMode =
          (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") ||
          "sandbox";
        const cashfree = await load({ mode: cfMode });
        if (!cashfree) {
          toast.error("Unable to start payment.");
          return;
        }
        const baseReturnUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/student/request-courses/return`
            : "/student/request-courses/return";
        const returnUrl =
          orderId && orderId.trim().length > 0
            ? `${baseReturnUrl}?order_id=${encodeURIComponent(orderId)}`
            : baseReturnUrl;
        const result = await cashfree.checkout({
          paymentSessionId: sessionId,
          payment_session_id: sessionId,
          returnUrl,
        });
        if (result?.error) {
          toast.error(result.error.message ?? "Payment failed to start.");
        }
        return;
      }

      toast.error(res.message ?? "Failed to create course subscription.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Checkout request failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/student/request-courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-gray-100 p-2 shadow px-4 rounded-xl">
          <Wallet className="h-4 w-4" />
          {formatWalletDisplay(wallet)}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr]">
          {course.image && (
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted sm:h-36 sm:w-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.image}
                alt={course.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 space-y-2">
            <h1 className="text-xl font-semibold text-foreground">{course.name}</h1>
            {course.description && (
              <p className="text-sm text-muted-foreground">
                {course.description.length > 50
                  ? `${course.description.slice(0, 50)}…`
                  : course.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-sm">
              {course.duration != null && (
                <span className="text-muted-foreground">
                  Duration: {course.duration} month{course.duration !== 1 ? "s" : ""}
                </span>
              )}
              {hasValidFees && (
                <span className="font-medium text-foreground">
                  <IndianRupee className="inline h-4 w-4" /> {fees.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <div className="space-y-3 text-sm">
            <div className="space-y-1 border-b border-dashed border-border pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Important note
              </p>
              <p className="text-xs text-muted-foreground">
                Wallet balance is auto‑applied first; any remaining amount (if
                any) is paid via the gateway.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Course amount</span>
              <span className="font-medium text-foreground">
                <IndianRupee className="inline h-3.5 w-3.5" />{" "}
                {hasValidFees ? fees.toLocaleString("en-IN") : "—"}
              </span>
            </div>
            {appliedWalletAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Wallet applied
                </span>
                <span className="font-medium text-emerald-600">
                  −<IndianRupee className="inline h-3.5 w-3.5" />{" "}
                  {appliedWalletAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-dashed border-border pt-2">
              <span className="text-sm font-medium text-foreground">Total payable</span>
              <span className="text-base font-semibold text-foreground">
                <IndianRupee className="inline h-4 w-4" />{" "}
                {finalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
              >
                {submitting ? "Processing…" : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
