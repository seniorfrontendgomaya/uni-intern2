import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterSSR } from "@/components/ui/footer-ssr";

export const metadata = {
  title: "Privacy Policy | UNIINTERN",
  description: "Privacy Policy for UniIntern platform. Issued in compliance with IT Act 2000, IT Rules 2011, and DPDP Act 2023.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Effective Date: Jan 01, 2026
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Platform Name: UniIntern
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Registered Office / Contact:{" "}
              <a href="mailto:shesparksteckwork@gmail.com" className="text-primary underline-offset-4 hover:underline">
                shesparksteckwork@gmail.com
              </a>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              This Privacy Policy is issued in compliance with:
            </p>
            <ul className="mt-2 list-disc space-y-0.5 pl-6 text-sm text-muted-foreground">
              <li>Information Technology Act, 2000</li>
              <li>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
              <li>Digital Personal Data Protection Act, 2023</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              By accessing or using the Platform, you consent to processing of your personal data as described below.
            </p>
          </header>

          <div className="mt-8 space-y-8 text-base text-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Definitions (DPDP Act Alignment)</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li><strong className="text-foreground">Personal Data:</strong> Any data about an identifiable individual.</li>
                <li><strong className="text-foreground">Data Principal:</strong> Student or company representative using the Platform.</li>
                <li><strong className="text-foreground">Data Fiduciary:</strong> UniIntern, determining purpose and means of processing.</li>
                <li><strong className="text-foreground">Processing:</strong> Collection, storage, usage, sharing, or deletion of data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Categories of Personal Data Collected</h2>
              <h3 className="mt-4 text-base font-medium text-foreground">Students</h3>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Name, email, phone number</li>
                <li>Educational and professional details</li>
                <li>Resume/profile information</li>
                <li>Login credentials</li>
                <li>Referral information</li>
                <li>Platform interaction data</li>
              </ul>
              <h3 className="mt-4 text-base font-medium text-foreground">Companies</h3>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Company details</li>
                <li>Authorized personnel information</li>
                <li>Course and instructor details</li>
                <li>Business contact information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Financial Information</h2>
              <p className="mt-2 text-muted-foreground">
                Payments are processed via Stripe. The Platform:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Does not store card or banking details</li>
                <li>Uses PCI-DSS compliant payment processors</li>
                <li>Receives only transaction confirmation data</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                Financial data handling complies with IT Act SPDI Rules.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Purpose of Data Processing</h2>
              <p className="mt-2 text-muted-foreground">
                Personal data is processed only for lawful purposes including:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Account creation and authentication</li>
                <li>Subscription management</li>
                <li>Outreach facilitation between students and companies</li>
                <li>Course hosting and discovery</li>
                <li>Referral discount validation</li>
                <li>Fraud prevention</li>
                <li>Legal compliance</li>
                <li>Service improvement</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                We process data under consent and legitimate business use, as permitted under the DPDP Act.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Outreach-Based Membership Logic</h2>
              <p className="mt-2 text-muted-foreground">
                Certain memberships remain valid until outreach from a specified number of companies. Users acknowledge:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Outreach determination relies on platform records.</li>
                <li>Platform methodology shall be final and binding.</li>
                <li>No guarantee of employment, internship, or selection is provided.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Data Sharing</h2>
              <p className="mt-2 text-muted-foreground">
                We may share data with:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Companies and students for platform functionality</li>
                <li>Payment processors</li>
                <li>Cloud hosting providers</li>
                <li>Analytics vendors</li>
                <li>Government or regulatory authorities when legally required</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Cross-Border Data Transfers</h2>
              <p className="mt-2 text-muted-foreground">
                Data may be processed or stored outside India using secure global infrastructure providers compliant with applicable Indian law and DPDP requirements. Users consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Data Retention</h2>
              <p className="mt-2 text-muted-foreground">
                Data is retained only for:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Active membership duration</li>
                <li>Outreach verification</li>
                <li>Legal, accounting, or dispute resolution obligations</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                Data is deleted or anonymized when no longer necessary.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">9. Rights of Data Principals (DPDP Act)</h2>
              <p className="mt-2 text-muted-foreground">
                Users have the right to:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Access personal data</li>
                <li>Request correction or erasure</li>
                <li>Withdraw consent</li>
                <li>Nominate another person for data rights exercise</li>
                <li>File grievance</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                Requests may be sent to the Grievance Officer (see Section 10).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">10. Grievance Officer (Mandatory Under IT Rules)</h2>
              <p className="mt-2 text-muted-foreground">
                Email:{" "}
                <a href="mailto:shesparksteckwork@gmail.com" className="text-primary underline-offset-4 hover:underline">
                  shesparksteckwork@gmail.com
                </a>
              </p>
              <p className="mt-2 text-muted-foreground">
                Complaints will be addressed within statutory timelines.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">11. Security Practices</h2>
              <p className="mt-2 text-muted-foreground">
                We implement reasonable security safeguards including:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Encryption</li>
                <li>Access control</li>
                <li>Secure hosting</li>
                <li>Payment tokenization</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                As required under Rule 8 of SPDI Rules.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">12. Limitation of Liability</h2>
              <p className="mt-2 text-muted-foreground">
                The Platform acts solely as a technology intermediary facilitating interaction between students and companies. The Platform:
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-6 text-muted-foreground">
                <li>Does not guarantee outreach outcomes</li>
                <li>Does not guarantee course quality</li>
                <li>Is not responsible for hiring decisions</li>
                <li>Is not liable for company conduct or student performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">13. Policy Updates</h2>
              <p className="mt-2 text-muted-foreground">
                Continued use after updates constitutes acceptance.
              </p>
            </section>
          </div>
        </article>

        <div className="mt-12 border-t pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
      <FooterSSR />
    </div>
  );
}
