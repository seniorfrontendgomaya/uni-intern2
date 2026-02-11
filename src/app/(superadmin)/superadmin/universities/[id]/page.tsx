"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { useGetUniversityById } from "@/hooks/useUniversity";
import type { University } from "@/types/university";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function getInitials(name: string | null) {
  return (
    (name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U"
  );
}

const toSafeHref = (value: string) => {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const universityId = String(params.id ?? "");
  const { data: getUniversity, loading } = useGetUniversityById();
  const [university, setUniversity] = useState<University | null>(null);

  useEffect(() => {
    if (!universityId) return;
    getUniversity(universityId).then((result) => {
      if (result.ok && result.data) {
        setUniversity(result.data);
      }
    });
  }, [universityId, getUniversity]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-md shimmer" />
            <div className="h-4 w-64 rounded-md shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand" />

            <div className="flex flex-col gap-5 pl-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl shimmer" />
                <div className="min-w-0 space-y-2">
                  <div className="h-6 w-48 rounded-md shimmer" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 rounded-md shimmer" />
                    <div className="h-4 w-32 rounded-md shimmer" />
                  </div>
                </div>
              </div>
              <div className="h-6 w-24 rounded-full shimmer" />
            </div>

            <div className="mt-6 pl-4">
              <div className="rounded-2xl border bg-background p-4">
                <div className="h-3 w-16 rounded-md shimmer mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md shimmer" />
                  <div className="h-4 w-full rounded-md shimmer" />
                  <div className="h-4 w-3/4 rounded-md shimmer" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 pl-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <div className="h-3 w-20 rounded-md shimmer mb-3" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-40 rounded-md shimmer" />
                  <div className="h-4 w-32 rounded-md shimmer" />
                </div>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <div className="h-3 w-16 rounded-md shimmer mb-3" />
                <div className="mt-3 h-4 w-36 rounded-md shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">University not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-brand hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const displayLogo = university.logo || null;
  const displayName = university.name ?? "University";
  const initials = getInitials(university.name ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-card text-foreground shadow-sm transition hover:bg-accent"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            University Details
          </h2>
          <p className="text-sm text-muted-foreground">
            View university information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden border bg-card p-5 shadow-sm">
          <div className={cx("absolute left-0 top-0 h-full w-1 bg-brand")} />

          <div className="flex flex-col gap-5 pl-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              {displayLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayLogo}
                  alt={displayName}
                  className="h-16 w-16 rounded-2xl border object-cover"
                />
              ) : (
                <div
                  className={cx(
                    "flex h-16 w-16 items-center justify-center rounded-2xl border text-lg font-semibold bg-muted text-muted-foreground"
                  )}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-foreground">
                  {displayName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  {university.university_location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {university.university_location}
                    </span>
                  ) : null}
                  {university.established_year ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Established {university.established_year}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                University
              </span>
            </div>
          </div>

          <div className="mt-6 pl-4">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {university.description?.trim()
                  ? university.description
                  : "No description available."}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 pl-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contact
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {university.email ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {university.mobile ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              <div className="mt-3 text-sm">
                {university.website ? (
                  <a
                    className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline"
                    href={toSafeHref(university.website)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{university.website}</span>
                  </a>
                ) : (
                  <span className="font-medium text-foreground">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
