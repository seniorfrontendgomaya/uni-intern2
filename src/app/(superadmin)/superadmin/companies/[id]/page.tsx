"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ArrowLeft,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetCompanyById } from "@/hooks/useCompanies";
import type { CompanyListItem } from "@/types/company-list";

const getCompanyInitial = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "C";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return trimmed[0].toUpperCase();
};

const listToText = (list: { name?: string }[] | null | undefined): string => {
  if (!list?.length) return "—";
  return list.map((item) => item.name).filter(Boolean).join(", ") || "—";
};

const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === "") return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = String(params.id ?? "");
  const { data: getCompany, loading } = useGetCompanyById();
  const [company, setCompany] = useState<CompanyListItem | null>(null);

  useEffect(() => {
    if (!companyId) return;
    getCompany(companyId).then((result) => {
      if (result.ok && result.data) {
        setCompany(result.data);
      }
    });
  }, [companyId, getCompany]);

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl shimmer" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-md shimmer" />
            <div className="h-4 w-64 rounded-md shimmer" />
          </div>
        </div>
        <div className="relative border bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-muted/20" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
                  </div>
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

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Company not found</p>
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

  const companyName = company.name ?? "Company";
  const companyInitial = getCompanyInitial(companyName);
  const locationText = listToText(company.location);
  // Type assertion to access additional fields that may exist in API response
  const companyExtended = company as CompanyListItem & {
    email?: string;
    mobile?: string;
    image?: string | null;
    category?: Array<{ id: number; name: string }>;
    job_type?: Array<{ id: number; name: string }>;
    designation?: Array<{ id: number; name: string }>;
    skills?: Array<{ id: number; name: string }>;
    course?: Array<{ id: number; name: string }>;
    perk?: Array<{ id: number; name: string }>;
    start_amount?: number | string | null;
    end_amount?: number | string | null;
    start_anual_salary?: number | string | null;
    end_anual_salary?: number | string | null;
    number_of_opening?: number | string | null;
    about?: string | null;
    apply?: string | null;
    key_responsibility?: string | null;
    apply_start_date?: string | null;
    apply_end_date?: string | null;
    is_fast_response?: boolean;
  };

  return (
    <div className="max-w-5xl space-y-6">
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
            Company Details
          </h2>
          <p className="text-sm text-muted-foreground">
            View company information
          </p>
        </div>
      </div>

      <div className="relative border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-muted/20" />
        <div className="relative z-10 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-700">
                {companyExtended.image ? (
                  <img
                    src={companyExtended.image}
                    alt={companyName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  companyInitial
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {companyName}
                </h2>
                {company.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {company.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      company.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {company.active ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {company.active ? "Active" : "Inactive"}
                  </span>
                  {company.placement_gurantee_course && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      <Award className="h-3 w-3" />
                      Placement Guarantee
                    </span>
                  )}
                  {companyExtended.is_fast_response && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      <Briefcase className="h-3 w-3" />
                      Fast Response
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-brand" />
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {companyExtended.email && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {companyExtended.email}
                    </p>
                  </div>
                </div>
              )}
              {companyExtended.mobile && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Mobile
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {companyExtended.mobile}
                    </p>
                  </div>
                </div>
              )}
              {locationText !== "—" && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {locationText}
                    </p>
                  </div>
                </div>
              )}
              {companyExtended.number_of_opening && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Openings
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyExtended.number_of_opening} positions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          {(companyExtended.start_amount ||
            companyExtended.end_amount ||
            companyExtended.start_anual_salary ||
            companyExtended.end_anual_salary) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <DollarSign className="h-5 w-5 text-brand" />
                Financial Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {companyExtended.start_amount && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Start Amount
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyExtended.start_amount)}
                    </p>
                  </div>
                )}
                {companyExtended.end_amount && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      End Amount
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyExtended.end_amount)}
                    </p>
                  </div>
                )}
                {companyExtended.start_anual_salary && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Start Annual Salary
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyExtended.start_anual_salary)}
                    </p>
                  </div>
                )}
                {companyExtended.end_anual_salary && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      End Annual Salary
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyExtended.end_anual_salary)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills, Courses, Perks */}
          {(companyExtended.skills?.length ||
            companyExtended.course?.length ||
            companyExtended.perk?.length ||
            companyExtended.designation?.length ||
            companyExtended.job_type?.length ||
            companyExtended.category?.length) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Briefcase className="h-5 w-5 text-brand" />
                Requirements & Benefits
              </h3>
              <div className="space-y-4">
                {companyExtended.skills?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {companyExtended.designation?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Designations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.designation.map((des) => (
                        <span
                          key={des.id}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {des.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {companyExtended.job_type?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Job Types
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.job_type.map((jt) => (
                        <span
                          key={jt.id}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {jt.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {companyExtended.course?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Courses
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.course.map((crs) => (
                        <span
                          key={crs.id}
                          className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                        >
                          {crs.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {companyExtended.perk?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Perks
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.perk.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {companyExtended.category?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyExtended.category.map((cat) => (
                        <span
                          key={cat.id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* About & Application Details */}
          {(companyExtended.about ||
            companyExtended.apply ||
            companyExtended.key_responsibility ||
            companyExtended.apply_start_date ||
            companyExtended.apply_end_date) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5 text-brand" />
                About & Application
              </h3>
              <div className="space-y-4">
                {companyExtended.about && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      About
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyExtended.about}
                    </p>
                  </div>
                )}
                {companyExtended.key_responsibility && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Key Responsibilities
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyExtended.key_responsibility}
                    </p>
                  </div>
                )}
                {companyExtended.apply && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      How to Apply
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyExtended.apply}
                    </p>
                  </div>
                )}
                {(companyExtended.apply_start_date ||
                  companyExtended.apply_end_date) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {companyExtended.apply_start_date && (
                      <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Apply Start Date
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {companyExtended.apply_start_date}
                          </p>
                        </div>
                      </div>
                    )}
                    {companyExtended.apply_end_date && (
                      <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Apply End Date
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {companyExtended.apply_end_date}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
