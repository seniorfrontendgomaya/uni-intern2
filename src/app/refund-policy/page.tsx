import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterSSR } from "@/components/ui/footer-ssr";

export const metadata = {
  title: "Refund & Cancellation Policy | UNIINTERN",
  description: "Refund and cancellation policy for UNIINTERN student membership plans and services (India-compliant).",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 md:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <header className="border-b pb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              India-Compliant
            </p>
          </header>

          <div className="mt-8 space-y-8 text-base text-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Student Membership Plans</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[280px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">Plan</th>
                      <th className="py-2 text-left font-semibold text-foreground">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-2.5 pr-4">1 Month Access</td>
                      <td className="py-2.5">INR 500</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2.5 pr-4">6 Months Access</td>
                      <td className="py-2.5">INR 1000</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2.5 pr-4">Outreach from 3 Companies</td>
                      <td className="py-2.5">INR 5000</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2.5 pr-4">Outreach from 5 Companies</td>
                      <td className="py-2.5">INR 10000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">Referral Discounts:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>25% — Single verified referral</li>
                <li>50% — Two or more verified referrals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Nature of Service</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>All subscriptions grant digital access rights and platform usage.</li>
                <li>Under Indian e-commerce norms, digital services once activated are non-returnable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Refund Eligibility</h2>
              <p className="mt-2 text-muted-foreground">Refunds allowed only where:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Duplicate payment occurs</li>
                <li>Unauthorized transaction verified</li>
                <li>Technical failure prevents access within 7 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Non-Refundable Conditions</h2>
              <p className="mt-2 text-muted-foreground">Payments are non-refundable once:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Login credentials are issued</li>
                <li>Platform access begins</li>
                <li>Outreach visibility is enabled</li>
                <li>Membership period starts</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                Outreach memberships are performance-linked access models and not employment guarantees.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Company Listings</h2>
              <p className="mt-2 text-muted-foreground">
                Currently offered at INR 0 onboarding fee. Future paid plans will be governed by revised commercial terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Cancellation</h2>
              <p className="mt-2 text-muted-foreground">Users may cancel anytime. Cancellation:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Stops future billing</li>
                <li>Does not refund past payments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Chargebacks</h2>
              <p className="mt-2 text-muted-foreground">
                Fraudulent or bad-faith chargebacks may result in:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Immediate suspension</li>
                <li>Account termination</li>
                <li>Recovery proceedings</li>
                <li>Reporting to payment networks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Refund Processing</h2>
              <p className="mt-2 text-muted-foreground">
                Approved refunds processed within 7–10 business days via original payment method.
              </p>
            </section>

            <section className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <h2 className="text-base font-semibold text-foreground">No Employment Guarantee</h2>
              <p className="text-sm text-muted-foreground">
                Prevents lawsuits claiming placement promise.
              </p>
              <h2 className="text-base font-semibold text-foreground">Platform Decision Finality</h2>
              <p className="text-sm text-muted-foreground">
                Protects outreach counting disputes.
              </p>
            </section>
          </div>
        </article>
      </main>
      <FooterSSR />
    </div>
  );
}
