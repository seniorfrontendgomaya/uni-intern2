import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <section className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-xs uppercase text-muted-foreground">
            Uni-Intern platform
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            One workspace for every stakeholder in the internship journey.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Explore the four dashboard panels and see how companies, students,
            universities, and administrators collaborate in a shared ecosystem.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/company"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Enter company dashboard
            </Link>
            <Link
              href="/student"
              className="rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              View student journey
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Company",
              description: "Manage hiring pipelines and candidate momentum.",
              href: "/company",
            },
            {
              title: "Student",
              description: "Track applications, mentors, and next steps.",
              href: "/student",
            },
            {
              title: "University",
              description: "Align placement outcomes with employer partners.",
              href: "/university",
            },
            {
              title: "Superadmin",
              description: "Oversee governance, compliance, and platform health.",
              href: "/superadmin",
            },
          ].map((panel) => (
            <Link
              key={panel.title}
              href={panel.href}
              className="group rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{panel.title}</h2>
                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition group-hover:border-primary/40 group-hover:text-foreground">
                  Open
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {panel.description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
