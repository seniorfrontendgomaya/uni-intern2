"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { CheckCircle, AlertCircle } from "lucide-react";
import { confirmSubscribePayment } from "@/services/subscribe-plan.service";

type PaymentStatus = "idle" | "loading" | "success" | "error";

export default function SubscribeReturnPage() {
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
            res.message || "Payment confirmed successfully. You can now log in using your email and password."
          );
        } else {
          setStatus("error");
          setMessage(res.message || "Payment could not be confirmed. Please contact support if amount was deducted.");
        }
      } catch (err) {
        if (isCancelled) return;
        setStatus("error");
        setMessage("Something went wrong while confirming your payment. Please try again in a moment.");
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
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {isError ? (
            <AlertCircle className="mx-auto h-14 w-14 text-red-600" />
          ) : (
            <CheckCircle
              className={`mx-auto h-14 w-14 ${
                isSuccess ? "text-green-600" : "text-yellow-500"
              }`}
            />
          )}
          <h1 className="mt-4 text-xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSuccess
              ? `${description} You can now log in using the email and password you entered during checkout.`
              : description}
          </p>
          {orderId && (
            <p className="mt-2 text-xs text-gray-500">Order reference: {orderId}</p>
          )}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link
              href="/internships/subscribe"
              className="inline-block font-medium text-brand hover:underline"
            >
              Back to plans
            </Link>
            <Link
              href="/"
              className="inline-block text-xs text-muted-foreground hover:underline"
            >
              Go to homepage / login
            </Link>
          </div>
        </div>
      </main>
      <FooterClientMount />
    </div>
  );
}
