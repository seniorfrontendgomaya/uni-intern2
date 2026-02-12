import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";

export const metadata = {
  title: "Privacy Policy | UNIINTERN",
  description: "Privacy Policy for UNIINTERN internship and job placement services.",
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
              Last Updated: January 2025
            </p>
          </header>

          <div className="mt-8 space-y-8 text-base text-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Introduction</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Welcome to UNIINTERN (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our internship and job placement services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. Information We Collect</h2>
              <h3 className="mt-4 text-base font-medium text-foreground">2.1 Personal Information</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We may collect the following types of personal information:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li><strong className="text-foreground">Student Information:</strong> Name, email address, phone number, educational background, skills, resume, and career preferences</li>
                <li><strong className="text-foreground">Company Information:</strong> Company name, contact details, job postings, and hiring requirements</li>
                <li><strong className="text-foreground">University Information:</strong> Institution details, TPO (Training and Placement Officer) contact information, and student enrollment data</li>
                <li><strong className="text-foreground">Account Information:</strong> Username, password, and profile information</li>
              </ul>
              <h3 className="mt-4 text-base font-medium text-foreground">2.2 Usage Information</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We automatically collect certain information when you use our services:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Search queries and application history</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We use the collected information for the following purposes:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li><strong className="text-foreground">Service Provision:</strong> To provide internship and job placement services</li>
                <li><strong className="text-foreground">Matching:</strong> To match students with relevant internship opportunities and companies with suitable candidates</li>
                <li><strong className="text-foreground">Communication:</strong> To send notifications, updates, and important information about opportunities</li>
                <li><strong className="text-foreground">Account Management:</strong> To create and manage user accounts across different user types (students, companies, universities, admins)</li>
                <li><strong className="text-foreground">Analytics:</strong> To improve our services and understand user behavior</li>
                <li><strong className="text-foreground">Security:</strong> To protect against fraud and unauthorized access</li>
                <li><strong className="text-foreground">Compliance:</strong> To comply with legal obligations and industry standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. Information Sharing and Disclosure</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We may share your information in the following circumstances:
              </p>
              <h3 className="mt-4 text-base font-medium text-foreground">4.1 With Other Users</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Student profiles and resumes may be shared with companies for internship matching</li>
                <li>Company information and job postings may be shared with students and universities</li>
                <li>University information may be shared with companies for partnership purposes</li>
              </ul>
              <h3 className="mt-4 text-base font-medium text-foreground">4.2 With Service Providers</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We may share information with third-party service providers who assist us in:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Hosting and maintaining our platform</li>
                <li>Processing payments and transactions</li>
                <li>Email communications and notifications</li>
                <li>Data analytics and reporting</li>
              </ul>
              <h3 className="mt-4 text-base font-medium text-foreground">4.3 Legal Requirements</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We may disclose information when required by law or to:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Comply with legal processes or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Prevent fraud or illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Data Security</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data storage and backup procedures</li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. User Rights and Choices</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                You have the following rights regarding your personal information:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li><strong className="text-foreground">Access:</strong> Request access to your personal information</li>
                <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-foreground">Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-foreground">Account Deactivation:</strong> Deactivate your account at any time</li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Cookies and Tracking Technologies</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Data Retention</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li><strong className="text-foreground">Active user accounts:</strong> Retained until account deletion</li>
                <li><strong className="text-foreground">Application data:</strong> Retained for 2 years after the last activity</li>
                <li><strong className="text-foreground">Communication records:</strong> Retained for 1 year</li>
                <li><strong className="text-foreground">Analytics data:</strong> Retained in aggregated form for up to 3 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">9. International Data Transfers</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">10. Children&apos;s Privacy</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">11. Changes to This Privacy Policy</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-muted-foreground">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on our platform</li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">12. Contact Us</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="mt-3 space-y-1.5 pl-0 text-muted-foreground list-none">
                <li><strong className="text-foreground">Email:</strong>{" "}<a href="mailto:privacy@uniintern.com" className="text-primary underline-offset-4 hover:underline">privacy@uniintern.com</a></li>
                <li><strong className="text-foreground">Phone:</strong> +1 (555) 123-4567</li>
                <li>
                  <strong className="text-foreground">Address:</strong><br />
                  UNIINTERN Privacy Team<br />
                  123 Education Street<br />
                  Tech City, TC 12345
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">13. Governing Law</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                This Privacy Policy is governed by and construed in accordance with the laws of the jurisdiction where UNIINTERN is incorporated, without regard to conflict of law principles.
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
      <LandingFooter />
    </div>
  );
}
