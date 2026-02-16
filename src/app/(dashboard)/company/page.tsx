"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { CompanyProfileFormModal } from "@/components/ui/company-profile-form-modal";
import { useCompanyProfile } from "@/hooks/useCompany";
import type { CompanyData } from "@/types/company";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const getCompanyInitial = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "C";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return trimmed[0].toUpperCase();
};

export default function CompanyPage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { fetchProfile, loading } = useCompanyProfile();

  useEffect(() => {
    fetchProfile().then((result) => {
      if (!result.ok || !result.data?.data) return;
      setCompanyData(result.data.data);
    });
  }, [fetchProfile]);

  if (loading && !companyData) {
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
                  <div className="flex gap-2">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              </div>
              <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
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

  const companyName = companyData?.name || "Company";
  const companyInitial = getCompanyInitial(companyName);

  return (
    <div className="max-w-5xl">
      <div className="relative border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-muted/20" />
        <div className="relative z-10 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-700">
                {companyData?.image ? (
                  <img
                    src={companyData.image}
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
                {companyData?.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {companyData.description}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
              onClick={() => {
                if (!companyData) return;
                setModalOpen(true);
              }}
              disabled={!companyData}
            >
              Update
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-brand" />
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {companyData?.email && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {companyData.email}
                    </p>
                  </div>
                </div>
              )}
              {companyData?.mobile && (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Mobile
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {companyData.mobile}
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
        onClose={() => setModalOpen(false)}
        initialValues={
          companyData
            ? {
                name: companyData.name,
                email: companyData.email,
                mobile: companyData.mobile,
                description: companyData.description ?? "",
                imagePreview: companyData.image,
              }
            : undefined
        }
        saving={saving}
        isUpdate
        onSubmit={async (values) => {
          setSaving(true);
          try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("mobile", values.mobile);
            formData.append("description", values.description);
            if (values.password) formData.append("password", values.password);
            if (values.image instanceof File) {
              formData.append("image", values.image, values.image.name);
            }

            const response = await api<{ statusCode: number; message: string; data?: CompanyData }>(
              "company_update_api/",
              {
                method: "PATCH",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
              }
            );

            const isSuccess =
              response.statusCode === 200 ||
              (response.message && response.message.toLowerCase().includes("success"));

            if (isSuccess) {
              if (response.data) setCompanyData(response.data);
              else await fetchProfile();
              toast.success(response.message || "Profile updated successfully");
              setModalOpen(false);
            } else {
              toast.error(response.message || "Failed to update profile");
            }
          } catch (error) {
            toast.error("Failed to update profile");
            // console.error(error);
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
