"use client";

import { useState } from "react";
import {
  GraduationCap,
  Building2,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Award,
  User,
} from "lucide-react";
import { useUniversityDashboard } from "@/hooks/useUniversityDashboard";
import type { RecentStudent } from "@/types/university-student";
import type { DashboardRecentStudent, DashboardRecentCompany } from "@/types/university-dashboard";

function getInitial(student: RecentStudent | DashboardRecentStudent): string {
  const first = student.first_name?.trim()[0];
  const last = student.last_name?.trim()[0];
  if (first) return first.toUpperCase();
  if (last) return last.toUpperCase();
  const part = (student.email ?? "").split("@")[0] ?? "";
  return (part[0] ?? "U").toUpperCase();
}

function getCompanyInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "C";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return trimmed[0].toUpperCase();
}

function formatList(arr: unknown[] | undefined | null): string {
  if (!arr?.length) return "—";
  return arr.every((x) => typeof x === "string") ? (arr as string[]).join(", ") : arr.join(", ");
}

function formatRefNames(items: { name?: string }[] | undefined | null): string {
  if (!items?.length) return "—";
  return items.map((x) => x.name).filter(Boolean).join(", ") || "—";
}

export default function UniversityDashboardPage() {
  const [activeTab, setActiveTab] = useState<"students" | "companies">("students");
  const { data, loading } = useUniversityDashboard();
  const stats = data?.statistics;
  const recentStudents: DashboardRecentStudent[] = data?.recent_students ?? [];
  const recentCompanies: DashboardRecentCompany[] = data?.recent_companies ?? [];

  return (
    <div className="space-y-6">
      {/* Metric cards — solid colors only, no gradients */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-university-accent-muted">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-university-accent text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                My Students
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
                {loading ? "—" : stats?.total_students ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Companies
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
                {loading ? "—" : stats?.total_companies ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Messages
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
                {loading ? "—" : stats?.total_messages ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — solid background for active, no gradient */}
      <div className="flex gap-0 rounded-2xl border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={
            activeTab === "students"
              ? "rounded-xl bg-university-accent px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Recent Students
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("companies")}
          className={
            activeTab === "companies"
              ? "rounded-xl bg-university-accent px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Recent Companies
        </button>
      </div>

      {/* Content panel */}
      <div className="overflow-hidden rounded-b-2xl border border-border bg-card shadow-sm">
        {activeTab === "students" && (
          <>
            <div className="rounded-t-lg bg-university-accent px-5 py-3">
              <h3 className="text-sm font-semibold text-white">
                Recent Students
              </h3>
            </div>
            <div className="space-y-4 p-5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-university-accent" />
                    <div className="flex flex-col gap-3 pl-4 sm:flex-row sm:items-start">
                      <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-muted" />
                      <div className="min-w-0 flex-1 space-y-2.75">
                        <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
                        <div className="flex flex-wrap gap-3">
                          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentStudents.length === 0 ? (
                <div className="rounded-2xl border border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                  No students yet.
                </div>
              ) : (
                recentStudents.map((student, index) => {
                  const name = [student.first_name, student.last_name].filter(Boolean).join(" ") || "—";
                  const skillLabels = (student.skills ?? []).every((x) => typeof x === "string")
                    ? (student.skills as string[])
                    : [];
                  return (
                    <div
                      key={student.id ?? index}
                      className="relative overflow-hidden border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-university-accent" />
                      <div className="flex flex-col gap-4 pl-4 sm:flex-row sm:items-start sm:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-university-accent-muted text-lg font-semibold text-university-accent">
                          {getInitial(student)}
                        </div>
                        <div className="min-w-0 flex-1 space-y-3">
                          <div>
                            <p className="text-base font-semibold text-foreground">
                              {name}
                            </p>
                            {student.qualification ? (
                              <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <Award className="h-3.5 w-3.5 shrink-0" />
                                {student.qualification}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                            {student.email ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {student.email}
                              </span>
                            ) : null}
                            {student.mobile ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                {student.mobile}
                              </span>
                            ) : null}
                            {student.gender ? (
                              <span className="inline-flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 shrink-0" />
                                {student.gender}
                              </span>
                            ) : null}
                            {(student.location?.length ?? 0) > 0 ? (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {formatList(student.location)}
                              </span>
                            ) : null}
                          </div>
                          {skillLabels.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {skillLabels.map((skill, i) => (
                                <span
                                  key={i}
                                  className="rounded-full bg-university-accent-muted px-3 py-1 text-xs font-medium text-university-accent"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
        {activeTab === "companies" && (
          <>
            <div className="rounded-t-lg bg-university-accent px-5 py-3">
              <h3 className="text-sm font-semibold text-white">
                Recent Companies
              </h3>
            </div>
            <div className="space-y-4 p-5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-university-accent" />
                    <div className="flex flex-col gap-4 pl-4 sm:flex-row sm:items-start">
                      <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-muted" />
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
                        <div className="h-3 w-64 animate-pulse rounded bg-muted" />
                        <div className="flex flex-wrap gap-2">
                          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentCompanies.length === 0 ? (
                <div className="border border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                  No recent companies to show.
                </div>
              ) : (
                recentCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="relative overflow-hidden border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-university-accent" />
                    <div className="flex flex-col gap-4 pl-4 sm:flex-row sm:items-start sm:gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
                        {getCompanyInitial(company.name)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {company.name}
                          </p>
                          {company.description ? (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {company.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                          {company.email ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              {company.email}
                            </span>
                          ) : null}
                          {company.mobile ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {company.mobile}
                            </span>
                          ) : null}
                          {company.location?.length ? (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              {formatRefNames(company.location)}
                            </span>
                          ) : null}
                        </div>
                        {company.skills?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {company.skills.slice(0, 6).map((skill) => (
                              <span
                                key={skill.id}
                                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {company.skills.length > 6 ? (
                              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                +{company.skills.length - 6}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
