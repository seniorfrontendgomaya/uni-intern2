"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { getCompanyHiringDetail } from "@/services/company-hiring.service";
import type { CompanyHiringDetail } from "@/types/company-hiring";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function DetailSection({
  title,
  text,
  items,
}: {
  title: string;
  text?: string | null;
  items?: string[];
}) {
  const hasText = text != null && String(text).trim() !== "";
  const hasItems = Array.isArray(items) && items.length > 0;
  if (!hasText && !hasItems) return null;
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      {hasText && (
        <p className="whitespace-pre-wrap text-sm text-foreground">{text}</p>
      )}
      {hasItems && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((name, i) => (
            <span
              key={i}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl">
      <div className="relative border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-muted/20" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyHiringDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const [data, setData] = useState<CompanyHiringDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null || id === undefined) {
      setLoading(false);
      setError("Missing hiring id");
      return;
    }
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      setError("Invalid hiring id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getCompanyHiringDetail(numId)
      .then((res) => {
        if (res?.data) setData(res.data);
        else setError("Failed to load hiring details");
      })
      .catch(() => setError("Failed to load hiring details"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/company/hiring"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to hiring
      </Link>

      {loading && <DetailSkeleton />}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="relative border bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-muted/20" />
          <div className="relative z-10 space-y-6">
            {/* Header Section - same as company profile */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-700">
                  {data.comapany?.image ? (
                    <img
                      src={data.comapany.image}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    (data.comapany?.name ?? "?").charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {data.comapany?.name ?? "—"}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-brand" />
                    Hiring details
                  </p>
                </div>
              </div>
            </div>

          <div className="space-y-6">
            <DetailSection title="Description" text={data.description} />
            <DetailSection
              title="Location"
              items={data.location?.map((l) => l.name)}
            />
            <DetailSection
              title="Category"
              items={data.category?.map((c) => c.name)}
            />
            <DetailSection
              title="Job type"
              items={data.job_type?.map((j) => j.name)}
            />
            <DetailSection
              title="Designation"
              items={data.designation?.map((d) => d.name)}
            />
            <DetailSection
              title="Skills"
              items={data.skills?.map((s) => s.name)}
            />
            <DetailSection
              title="Course"
              items={data.course?.map((c) => c.name)}
            />
            <DetailSection
              title="Perk"
              items={data.perk?.map((p) => p.name)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailSection
                title="Amount range"
                text={
                  data.start_amount != null || data.end_amount != null
                    ? `₹${data.start_amount ?? "—"} – ₹${data.end_amount ?? "—"}`
                    : undefined
                }
              />
              <DetailSection
                title="Annual salary range"
                text={
                  data.start_anual_salary != null ||
                  data.end_anual_salary != null
                    ? `₹${data.start_anual_salary ?? "—"} – ₹${data.end_anual_salary ?? "—"}`
                    : undefined
                }
              />
              <DetailSection title="Start day" text={data.start_day} />
              <DetailSection
                title="Openings"
                text={
                  data.number_of_opening != null
                    ? String(data.number_of_opening)
                    : undefined
                }
              />
              <DetailSection
                title="Apply start date"
                text={data.apply_start_date}
              />
              <DetailSection
                title="Apply end date"
                text={data.apply_end_date}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={cx(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  data.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {data.active ? "Active" : "Inactive"}
              </span>
              {data.placement_gurantee_course && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Placement guarantee course
                </span>
              )}
              {data.is_fast_response && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Fast response
                </span>
              )}
            </div>

            <DetailSection title="About" text={data.about} />
            <DetailSection title="How to apply" text={data.apply} />
            <DetailSection
              title="Key responsibility"
              text={data.key_responsibility}
            />

            <p className="text-xs text-muted-foreground">
              Updated{" "}
              {data.updated_at
                ? new Date(data.updated_at).toLocaleString()
                : "—"}
            </p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
