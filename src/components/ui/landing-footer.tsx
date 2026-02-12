import Link from "next/link";

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
    title: "Placement Guarantee Courses",
    links: [
      { label: "Full‑stack development", href: "#" },
      { label: "Data science & ML", href: "#" },
      { label: "Cloud & DevOps", href: "#" },
      { label: "UI/UX design", href: "#" },
    ],
  },
  {
    title: "Quick links",
    links: [
      { label: "Hire interns for your company", href: "#" },
      { label: "Post a job", href: "#" },
      { label: "Privacy", href: "/privacy" },
      { label: "Contact us", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="mt-16 bg-[#050816] text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
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

