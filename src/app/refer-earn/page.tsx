import Link from "next/link";
import { ArrowLeft, Gift, Users, Percent, Zap, ShieldCheck } from "lucide-react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterSSR } from "@/components/ui/footer-ssr";

export const metadata = {
  title: "Refer & Earn | UNIINTERN",
  description: "Share UNIINTERN with friends and earn rewards. Get referral discounts on membership and help others find internships.",
};

const BENEFITS = [
  {
    icon: Gift,
    title: "Earn rewards",
    description: "Get credited for every friend who joins through your referral. Rewards can be used toward membership or other benefits.",
  },
  {
    icon: Percent,
    title: "Referral discounts",
    description: "Unlock 25% off with one verified referral and 50% off with two or more. The more you refer, the more you save on plans.",
  },
  {
    icon: Users,
    title: "Help friends get started",
    description: "Your friends get access to internships, company outreach, and placement support. You help them while earning.",
  },
  {
    icon: Zap,
    title: "Simple process",
    description: "Share your unique referral code or link. When they sign up and get verified, you both benefit—no extra steps.",
  },
  {
    icon: ShieldCheck,
    title: "Track in your dashboard",
    description: "See your referred users, referral count, and earnings in one place. Transparent and easy to manage.",
  },
];

export default function ReferEarnPublicPage() {
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
          <header className="border-b pb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Refer &amp; Earn
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-2xl">
              Share UNIINTERN with friends and classmates. When they sign up using your referral code, you earn rewards and unlock discounts on your own membership—and they get a head start on finding internships.
            </p>
          </header>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground mb-6">Benefits</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {BENEFITS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-brand/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">How it works</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Sign up or log in to UNIINTERN and go to Refer &amp; Earn in your dashboard.</li>
              <li>Copy your unique referral code or share link with friends.</li>
              <li>When they register using your code and get verified, you earn rewards and referral discounts.</li>
              <li>Track referred users and earnings in your Refer &amp; Earn section.</li>
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              Already a member?{" "}
              <Link href="/student/refer-earn" className="font-medium text-brand hover:underline">
                Go to Refer &amp; Earn in your dashboard
              </Link>{" "}
              to get your code and start earning.
            </p>
          </section>
        </article>
      </main>
      <FooterSSR />
    </div>
  );
}
