"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { checkReferralCode } from "@/services/referral.service";
import { submitSubscribeCheckout } from "@/services/subscribe-plan.service";
import { ArrowLeft, IndianRupee, Tag } from "lucide-react";
import toast from "react-hot-toast";

type ReferralStatus = "idle" | "loading" | "valid" | "invalid";

export default function SubscribeCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const planId = params?.planId as string;
  const planName = searchParams?.get("name") || `Plan #${planId}`;
  const priceParam = searchParams?.get("price");
  const planPrice = priceParam != null && priceParam !== "" ? Number(priceParam) : 0;
  const isValidPrice = Number.isFinite(planPrice) && planPrice >= 0;
  const originalAmount = isValidPrice ? planPrice : 0;
  const discountPercent = 20;
  const discountAmount = Math.round(originalAmount * (discountPercent / 100));
  const finalAmount = originalAmount - discountAmount;

  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<ReferralStatus>("idle");
  const [referralMessage, setReferralMessage] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = referralCode.trim();
    if (!code) return;
    setReferralStatus("loading");
    setReferralMessage("");
    try {
      const res = await checkReferralCode(code);
      const exists = res.data?.referral_code_exist === true;
      setReferralStatus(exists ? "valid" : "invalid");
      setReferralMessage(res.message ?? (exists ? "Referral code is valid. 20% discount will apply." : "Referral code not found."));
    } catch (err) {
      setReferralStatus("invalid");
      setReferralMessage(err instanceof Error ? err.message : "Failed to check referral code.");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    const mobileTrimmed = mobile.replace(/\D/g, "");
    const passwordTrimmed = password.trim();
    if (!emailTrimmed) {
      toast.error("Please enter your email");
      return;
    }
    if (mobileTrimmed.length !== 10) {
      toast.error("Mobile must be exactly 10 digits");
      return;
    }
    if (!passwordTrimmed) {
      toast.error("Please enter a password");
      return;
    }
    const payload = {
      subscription_plan_id: Number(planId) || 0,
      referral_codes:
        referralStatus === "valid" && referralCode.trim()
          ? [referralCode.trim()]
          : [],
      email: emailTrimmed,
      mobile: mobileTrimmed,
      password: passwordTrimmed,
    };
    setSubmitting(true);
    try {
      const res = await submitSubscribeCheckout(payload);
      const backendOrderId =
        res?.data?.order_id ?? res?.data?.cashfree_order_id ?? "";
      const sessionId =
        res?.data?.payment_session_id ??
        res?.session_id ??
        res?.payment_session_id ??
        "";

      if (!sessionId) {
        toast.success(res?.message ?? "Checkout submitted.");
        return;
      }

      const cfMode =
        (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") || "sandbox";
      const cashfree = await load({ mode: cfMode });
      if (!cashfree) {
        toast.error("Payment could not be loaded.");
        return;
      }

      const baseReturnUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/internships/subscribe/return`
          : "/internships/subscribe/return";

      const returnUrl =
        backendOrderId && backendOrderId.trim().length > 0
          ? `${baseReturnUrl}?order_id=${encodeURIComponent(backendOrderId)}`
          : baseReturnUrl;

      const result = await cashfree.checkout({
        paymentSessionId: sessionId,
        payment_session_id: sessionId,
        returnUrl,
      });

      if (result?.error) {
        const errMsg = result.error.message ?? "Payment checkout failed.";
        const isSessionInvalid =
          errMsg.toLowerCase().includes("payment_session_id") ||
          errMsg.toLowerCase().includes("invalid");
        toast.error(
          isSessionInvalid
            ? `${errMsg} Ensure backend and frontend use the same Cashfree environment (set NEXT_PUBLIC_CASHFREE_MODE=sandbox or production).`
            : errMsg
        );
      }
      // If result.redirect is true, Cashfree has redirected the user to their hosted page
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/internships/subscribe"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to plans
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-500">Payment plan ID: {planId}</p>

          {/* Plan name */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Selected plan
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{planName}</p>
          </div>

          {/* Instructions */}
          <section className="mt-8">
            <h2 className="text-base font-semibold text-gray-900">Pricing & instructions</h2>
            <ul className="mt-3 space-y-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-sm text-gray-700">
              <li>• For 1 month, one login – INR 500</li>
              <li>• For 6 months, one login – INR 1000</li>
              <li>• 20% instant discount if referral is used</li>
            </ul>
          </section>

          {/* Referral section */}
          <section className="mt-8">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-brand" />
              Referral code
            </h2>
            <form onSubmit={handleCheckReferral} className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value);
                  setReferralStatus("idle");
                }}
                placeholder="Enter referral code"
                className="flex-1 min-w-[180px] rounded-xl border border-gray-300 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="submit"
                disabled={referralStatus === "loading"}
                className="rounded-xl border border-brand bg-white px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/5 disabled:opacity-60"
              >
                {referralStatus === "loading" ? "Checking…" : "Check referral"}
              </button>
            </form>
            {referralStatus === "valid" && (
              <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-800">
                  Referral is valid. 20% discount applied on final payment.
                </p>
              </div>
            )}
            {referralStatus === "invalid" && referralMessage && (
              <p className="mt-2 text-sm text-red-600">{referralMessage}</p>
            )}
          </section>

          {/* Plan amount: with discount if referral valid, otherwise without */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <h2 className="text-base font-semibold text-gray-900">Payment summary</h2>
            {referralStatus === "valid" ? (
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Plan price</span>
                  <span>₹{originalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount applied (20%)</span>
                  <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                  <span>Final amount</span>
                  <span>₹{finalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">₹{originalAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </section>

          {/* Contact form */}
          <form onSubmit={handlePayment} className="mt-8 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Your details</h2>
            <div>
              <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rajeshdata@gmail.com"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label htmlFor="checkout-mobile" className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                id="checkout-mobile"
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="e.g. 5678904321"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label htmlFor="checkout-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="checkout-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
            >
              <IndianRupee className="h-5 w-5" />
              {submitting ? "Submitting…" : "Proceed to payment"}
            </button>
          </form>
        </div>
      </main>
      <FooterClientMount />
    </div>
  );
}
