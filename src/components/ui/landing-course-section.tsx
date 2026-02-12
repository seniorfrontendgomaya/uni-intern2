import type { RecommendedCourseItem } from "@/types/recommended-course";

function formatSalary(value: number | string | null): string {
  if (value == null || value === "") return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}L+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return String(n);
}

interface LandingCourseSectionProps {
  title: string;
  items: RecommendedCourseItem[];
}

export function LandingCourseSection({ title, items }: LandingCourseSectionProps) {
  if (!items.length) return null;

  return (
    <section className="w-full border-t bg-card/50 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border bg-background p-4 shadow-sm"
            >
              <h3 className="font-medium text-foreground">{item.company}</h3>
              {item.courses.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.courses.join(" · ")}
                </p>
              )}
              <p className="mt-2 text-sm font-medium text-primary">
                {formatSalary(item.salaryStart)} – {formatSalary(item.salaryEnd)} per year
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
