"use client";

import React from "react";
import Link from "next/link";
import { getFooterData } from "@/services/footer.service";
import type { FooterLink } from "@/services/footer.service";

const QUICK_LINKS: FooterLink[] = [
  // { label: "Hire interns for your company", href: "#" },
  { label: "Post a job", href: "#" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund policy", href: "/refund-policy" },
  { label: "Refer & Earn", href: "/refer-earn" },
  { label: "Contact us", href: "/contact-us" },
];

const COMPANY_NAME = "Uni-Intern";
const COMPANY_DESCRIPTION =
  "Connecting students with internships and companies with talent. Find your next opportunity or hire the best candidates.";

export interface FooterClientProps {
  locations: FooterLink[];
  skills: FooterLink[];
}

/** Presentational footer: no API calls, only renders the data it receives. */
export function FooterClient({ locations, skills }: FooterClientProps) {
  return (
    <footer className="mt-16 bg-[#050816] text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {COMPANY_NAME}
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {COMPANY_DESCRIPTION}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Internships by location
            </p>
            <ul className="mt-3 space-y-2">
              {locations.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Internships by skills
            </p>
            <ul className="mt-3 space-y-2">
              {skills.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Quick links
            </p>
            <ul className="mt-3 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-500">
            © 2025, UNIINTERN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Client-mounted footer: fetches on mount (deduped by getFooterData cache). Use on public internships list. */
export function FooterClientMount() {
  const [data, setData] = React.useState<FooterClientProps | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    getFooterData()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData({ locations: [], skills: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <footer className="mt-16 bg-[#050816] text-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">{COMPANY_NAME}</p>
              <p className="mt-3 text-sm text-slate-500">Loading…</p>
            </div>
            {["Internships by location", "Internships by skills", "Quick links"].map((title) => (
              <div key={title}>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">Loading…</ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">© 2025, UNIINTERN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return <FooterClient {...data} />;
}

type FooterSection = {
  title: string;
  links: { label: string; href: string }[];
};

const sections: FooterSection[] = [
  {
    title: "Internships by location",
    links: [
      { label: "Internships in Patna", href: "#" },
      { label: "Internships in Delhi", href: "#" },
      { label: "Internships in Gurgaon", href: "#" },
      { label: "Internships in Pune", href: "#" },
      { label: "Internships in Mohali", href: "#" },
      { label: "Internships in Mirzapur", href: "#" },
      { label: "Internships in Bengaluru", href: "#" },
    ],
  },
  {
    title: "Internships by skills",
    links: [
      { label: "JavaScript internships", href: "#" },
      { label: "TypeScript internships", href: "#" },
      { label: "C++ internships", href: "#" },
      { label: "PHP internships", href: "#" },
      { label: "Python internships", href: "#" },
      { label: "C# internships", href: "#" },
      { label: "Java internships", href: "#" },
      { label: "Django internships", href: "#" },
    ],
  },
  {
    title: "Quick links",
    links: [
      // { label: "Hire interns for your company", href: "#" },
      { label: "Post a job", href: "#" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refund policy", href: "/refund-policy" },
      { label: "Refer & Earn", href: "/refer-earn" },
      { label: "Contact us", href: "/contact-us" },
    ],
  },
];

/** Static footer (fallback). Prefer FooterSSR or FooterClientMount for dynamic links. */
export function LandingFooter() {
  return (
    <footer className="mt-16 bg-[#050816] text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {COMPANY_NAME}
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {COMPANY_DESCRIPTION}
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-slate-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-500">
            © 2025, UNIINTERN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
