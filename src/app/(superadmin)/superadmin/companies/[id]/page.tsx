"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, Mail, Phone, ArrowLeft } from "lucide-react";
import { CompanyProfileFormModal } from "@/components/ui/company-profile-form-modal";
import type { CompanyProfileFormValues } from "@/components/ui/company-profile-form-modal";
import { useGetCompanyById, useUpdateCompany, useUpdateCompanyWithFormData } from "@/hooks/useCompanies";
import type { CompanyListItem } from "@/types/company-list";
import { extractFieldErrors } from "@/lib/validation-errors";

const getCompanyInitial = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "C";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return trimmed[0].toUpperCase();
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = String(params.id ?? "");
  const { data: getCompany, loading } = useGetCompanyById();
  const { data: updateCompanyMutation } = useUpdateCompany();
  const { data: updateCompanyWithFormDataMutation } = useUpdateCompanyWithFormData();
  const [company, setCompany] = useState<CompanyListItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const fetchCompany = () => {
    if (!companyId) return;
    getCompany(companyId).then((result) => {
      if (result.ok && result.data) {
        setCompany(result.data);
      }
    });
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId, getCompany]);

  const applyValidationErrors = (error: unknown) => {
    const extracted = extractFieldErrors(error) ?? {};
    setFieldErrors(extracted);
  };

  if (loading && !company) {
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
              {Array.from({ length: 2 }).map((_, i) => (
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
  const companyExtended = company as CompanyListItem & {
    email?: string;
    mobile?: string;
    image?: string | null;
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
            View and edit company profile
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
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
              onClick={() => setModalOpen(true)}
            >
              Update
            </button>
          </div>

          {/* Contact Information (profile-only) */}
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
            </div>
          </div>
        </div>
      </div>

      <CompanyProfileFormModal
        open={modalOpen}
        title="Update company profile"
        onClose={() => {
          setModalOpen(false);
          setFieldErrors({});
        }}
        initialValues={{
          name: company.name ?? "",
          email: companyExtended.email ?? "",
          mobile: companyExtended.mobile ?? "",
          description: company.description ?? "",
          imagePreview: companyExtended.image ?? null,
        }}
        saving={saving}
        isUpdate
        onSubmit={async (values: CompanyProfileFormValues) => {
          setSaving(true);
          setFieldErrors({});
          try {
            const initial = {
              name: company.name ?? "",
              description: company.description ?? "",
            };
            const patchData: Record<string, string> = {};
            if (values.name !== initial.name) patchData.name = values.name;
            if (values.description !== initial.description) patchData.description = values.description;
            if (values.password.trim()) patchData.password = values.password;

            const hasImage = values.image instanceof File;
            const result = hasImage
              ? await updateCompanyWithFormDataMutation({
                  companyId,
                  data: { ...patchData, image: values.image },
                })
              : await updateCompanyMutation({
                  companyId,
                  patchData,
                });
            if (!result.ok) {
              applyValidationErrors(result.error);
              return;
            }
            setModalOpen(false);
            fetchCompany();
          } catch (e) {
            applyValidationErrors(e);
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
