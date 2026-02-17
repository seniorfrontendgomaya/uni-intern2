"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { CompanyProfileFormModal } from "@/components/ui/company-profile-form-modal";
import type { CompanyProfileFormValues } from "@/components/ui/company-profile-form-modal";
import { getCompanyById, minimalCompanyCreatePayload } from "@/services/companies.service";
import {
  useCompaniesPaginated,
  useCreateCompany,
  useUpdateCompany,
  useUpdateCompanyWithFormData,
} from "@/hooks/useCompanies";
import type { CompanyListItem } from "@/types/company-list";
import { extractFieldErrors } from "@/lib/validation-errors";

const columns = [
  { key: "sr", label: "S NO", headerClassName: "w-20 px-4 py-2 text-center" },
  { key: "image", label: "Image", headerClassName: "w-16 px-2 py-2" },
  { key: "name", label: "Name", headerClassName: "px-4 py-2" },
  { key: "description", label: "Description", headerClassName: "px-4 py-2" },
  { key: "location", label: "Location", headerClassName: "px-4 py-2" },
  { key: "active", label: "Is Active", headerClassName: "px-4 py-2" },
  {
    key: "placement",
    label: "Placement Guaranteed",
    headerClassName: "px-4 py-2",
  },
  { key: "actions", label: "Actions", headerClassName: "w-24 px-4 py-2" },
];

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type ProfileInitialValues = Partial<CompanyProfileFormValues> & {
  imagePreview?: string | null;
};

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [profileInitialValues, setProfileInitialValues] =
    useState<ProfileInitialValues | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
    refresh,
  } = useCompaniesPaginated(10, searchTerm);
  const { data: createCompanyMutation } = useCreateCompany();
  const { data: updateCompanyMutation } = useUpdateCompany();
  const { data: updateCompanyWithFormDataMutation } = useUpdateCompanyWithFormData();

  const getInitial = (name: string) => {
    const t = String(name ?? "").trim();
    if (!t) return "C";
    const parts = t.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
    return t[0].toUpperCase();
  };

  const rows = useMemo(
    () =>
      (items ?? []).map((item, index) => ({
        id: item.id,
        raw: item,
        sr: String((page - 1) * perPage + index + 1),
        image: (item as { image?: string | null }).image ?? null,
        name: item.name,
        description: item.description ?? "-",
        location:
          item.location && item.location.length > 0
            ? item.location.map((entry) => entry.name).join(", ")
            : "-",
        active: item.active ? "Yes" : "No",
        placement: item.placement_gurantee_course ? "Yes" : "No",
      })),
    [items, page, perPage]
  );

  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const visiblePages =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : (() => {
          const start = Math.max(1, Math.min(page - 1, totalPages - 2));
          return [start, start + 1, start + 2];
        })();

  const openCreateModal = () => {
    setProfileInitialValues(undefined);
    setActiveCompanyId(null);
    setModalMode("create");
    setFieldErrors({});
    setModalOpen(true);
  };

  const openUpdateModal = (company: CompanyListItem & Record<string, unknown>) => {
    setActiveCompanyId(String(company.id));
    setModalMode("update");
    setFieldErrors({});
    setModalOpen(false);
    getCompanyById(String(company.id)).then((res) => {
      const d = res.data ?? (res as Record<string, unknown>);
      setProfileInitialValues({
        name: String((d as { name?: string }).name ?? ""),
        email: String((d as { email?: string }).email ?? ""),
        mobile: String((d as { mobile?: string }).mobile ?? ""),
        description: String((d as { description?: string }).description ?? ""),
        imagePreview: (d as { image?: string | null }).image ?? null,
      });
      setModalOpen(true);
    });
  };

  const applyValidationErrors = (error: unknown) => {
    const extracted = extractFieldErrors(error) ?? {};
    setFieldErrors(extracted);
  };

  const handleClose = () => {
    setModalOpen(false);
    setProfileInitialValues(undefined);
    setActiveCompanyId(null);
    setFieldErrors({});
  };

  const handleSubmit = async (values: CompanyProfileFormValues) => {
    setSaving(true);
    try {
      if (modalMode === "create") {
        const payload = minimalCompanyCreatePayload({
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
          description: values.description,
        });
        const result = await createCompanyMutation(payload);
        setSaving(false);
        if (!result.ok) {
          applyValidationErrors(result.error);
          return;
        }
        handleClose();
        refresh();
        return;
      }

      if (!activeCompanyId) {
        setSaving(false);
        return;
      }
      const hasImage = values.image instanceof File;
      const result = hasImage
        ? await updateCompanyWithFormDataMutation({
            companyId: activeCompanyId,
            data: {
              name: values.name,
              email: values.email,
              mobile: values.mobile,
              description: values.description,
              ...(values.password.trim() && { password: values.password }),
              image: values.image,
            },
          })
        : await updateCompanyMutation({
            companyId: activeCompanyId,
            patchData: {
              name: values.name,
              email: values.email,
              mobile: values.mobile,
              description: values.description,
              ...(values.password.trim() && { password: values.password }),
            },
          });
      setSaving(false);
      if (!result.ok) {
        applyValidationErrors(result.error);
        return;
      }
      handleClose();
      refresh();
    } catch (e) {
      setSaving(false);
      applyValidationErrors(e);
    }
  };

  return (
    <>
      <DataTableShell
        title="Companies"
        addLabel="Add company"
        searchPlaceholder="Search companies..."
        onAdd={openCreateModal}
        searchProps={{
          value: searchTerm,
          onChange: (event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          },
        }}
        table={
          <div className="overflow-x-auto rounded-2xl border">
            <div className="min-w-full">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-brand text-xs uppercase text-white">
                  <tr className="h-12">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={column.headerClassName ?? "px-2 py-2 text-xs sm:px-4 sm:text-xs"}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                {loading ? (
                  Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr key={`skeleton-${rowIndex}`} className="h-12">
                      {columns.map((column) => (
                        <td
                          key={`${column.key}-${rowIndex}`}
                          className="px-2 py-2 sm:px-4"
                        >
                          <div className="h-4 w-full rounded-md shimmer" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-2 py-6 text-center text-xs text-muted-foreground sm:px-4 sm:text-sm"
                    >
                      No record found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="h-12">
                      <td className="px-2 py-2 text-center text-xs sm:px-4 sm:text-sm">{row.sr}</td>
                      <td className="px-2 py-2 sm:px-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                          {row.image ? (
                            <img
                              src={row.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitial(row.name)
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs font-medium wrap-break-word sm:px-4 sm:text-sm">{row.name}</td>
                      <td className="px-2 py-2 text-xs text-muted-foreground wrap-break-word whitespace-normal max-w-[360px] sm:px-4 sm:text-sm">
                        {row.description}
                      </td>
                      <td className="px-2 py-2 text-xs wrap-break-word whitespace-normal max-w-[240px] sm:px-4 sm:text-sm">
                        {row.location}
                      </td>
                      <td className="px-2 py-2 text-xs sm:px-4 sm:text-sm">{row.active}</td>
                      <td className="px-2 py-2 text-xs sm:px-4 sm:text-sm">{row.placement}</td>
                      <td className="px-2 py-2 sm:px-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Link
                            href={`/superadmin/companies/${row.id}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-brand/40 text-brand transition hover:bg-brand/10 sm:h-8 sm:w-8"
                            aria-label="View"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            className={cx(
                              "inline-flex h-7 w-7 items-center justify-center rounded-xl border text-brand transition sm:h-8 sm:w-8",
                              "hover:border-brand/40 hover:bg-brand/10"
                            )}
                            aria-label="Edit"
                            title="Edit"
                            onClick={() => {
                              if (row.raw) {
                                openUpdateModal(row.raw);
                              }
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className={cx(
                              "inline-flex h-7 w-7 items-center justify-center rounded-xl border text-muted-foreground sm:h-8 sm:w-8",
                              "cursor-not-allowed opacity-60"
                            )}
                            aria-label="Delete"
                            title="Delete"
                            disabled
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        }
        pagination={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Showing {rows.length} of {count} entries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!hasPrev}
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <div className="flex items-center gap-1">
                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className="h-8 w-8 rounded-xl border text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:h-9 sm:w-9 sm:text-sm"
                    onClick={() => setPage(pageNumber)}
                    disabled={pageNumber === page}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                onClick={() => setPage((current) => current + 1)}
                disabled={!hasNext}
              >
                Next
              </button>
            </div>
          </div>
        }
      />
      <CompanyProfileFormModal
        open={modalOpen}
        title={modalMode === "create" ? "Add company" : "Update company"}
        onClose={handleClose}
        initialValues={profileInitialValues}
        saving={saving}
        onSubmit={handleSubmit}
        isUpdate={modalMode === "update"}
      />
    </>
  );
}
