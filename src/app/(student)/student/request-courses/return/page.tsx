"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { confirmSubscribePayment } from "@/services/subscribe-plan.service";

type PaymentStatus = "idle" | "loading" | "success" | "error";

export default function RequestCoursesReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id") ?? "";

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!orderId) return;

    let isCancelled = false;
    const run = async () => {
      setStatus("loading");
      setMessage("");
      try {
        const res = await confirmSubscribePayment(orderId);
        if (isCancelled) return;
        if (res.statusCode === 200) {
          setStatus("success");
          setMessage(
            res.message ||
              "Payment confirmed successfully. Your course subscription is now active."
          );
        } else {
          setStatus("error");
          setMessage(
            res.message ||
              "Payment could not be confirmed. If the amount was deducted, please contact support."
          );
        }
      } catch {
        if (isCancelled) return;
        setStatus("error");
        setMessage(
          "Something went wrong while confirming your payment. Please refresh the page or try again later."
        );
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [orderId]);

  const isSuccess = status === "success";
  const isError = status === "error";
  const isLoading = status === "loading";

  const title = !orderId
    ? "Payment status pending"
    : isLoading
    ? "Checking payment status…"
    : isSuccess
    ? "Payment confirmed"
    : isError
    ? "Payment not confirmed"
    : "Payment submitted";

  const description =
    !orderId && !message
      ? "We could not detect an order reference. If your amount was deducted, please contact support."
      : message ||
        "Thank you. We will confirm your subscription once the payment is verified.";

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {isError ? (
          <AlertCircle className="mx-auto h-14 w-14 text-red-600" />
        ) : (
          <CheckCircle
            className={`mx-auto h-14 w-14 ${
              isSuccess ? "text-green-600" : "text-yellow-500"
            }`}
          />
        )}
        <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {orderId && (
          <p className="mt-2 text-xs text-muted-foreground">
            Order reference: {orderId}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link
            href="/student/request-courses"
            className="inline-block font-medium text-brand hover:underline"
          >
            Back to requests
          </Link>
          <Link
            href="/student/courses"
            className="inline-block text-xs text-muted-foreground hover:underline"
          >
            Go to my courses
          </Link>
        </div>
      </div>
    </div>
  );
}

