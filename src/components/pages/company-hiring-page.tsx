"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { extractFieldErrors } from "@/lib/validation-errors";
import { getAllCities } from "@/services/city.service";
import { getAllCategories } from "@/services/category.service";
import { getAllJobTypes } from "@/services/jobtype.service";
import { getAllDesignations } from "@/services/designation.service";
import { getAllSkills } from "@/services/skill.service";
import { getAllCourses } from "@/services/course.service";
import { getAllPerks } from "@/services/perk.service";
import {
  useCompanyHiringPaginated,
  useCreateCompanyHiring,
  useUpdateCompanyHiring,
  useDeleteCompanyHiring,
} from "@/hooks/useCompanyHiring";
import type { CompanyHiring } from "@/types/company-hiring";

const columns = [
  { key: "sr", label: "S NO", headerClassName: "w-20 px-4 py-2 text-center" },
  { key: "company", label: "Company", headerClassName: "px-4 py-2" },
  { key: "designation", label: "Designation", headerClassName: "px-4 py-2" },
  { key: "location", label: "Location", headerClassName: "px-4 py-2" },
  { key: "category", label: "Category", headerClassName: "px-4 py-2" },
  { key: "amount", label: "Amount Range", headerClassName: "px-4 py-2" },
  { key: "openings", label: "Openings", headerClassName: "px-4 py-2" },
  { key: "active", label: "Active", headerClassName: "px-4 py-2" },
  { key: "actions", label: "Actions", headerClassName: "w-28 px-4 py-2" },
];

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type OptionItem = {
  id: string | number;
  name: string;
  description?: string | null;
};

type HiringFormValues = {
  description: string;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date: string;
  apply_end_date: string;
  location: OptionItem[];
  category: OptionItem[];
  job_type: OptionItem[];
  designation: OptionItem[];
  skills: OptionItem[];
  course: OptionItem[];
  perk: OptionItem[];
  start_amount: string;
  end_amount: string;
  start_anual_salary: string;
  end_anual_salary: string;
  start_day: string;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: string;
  is_fast_response: boolean;
};

const emptyFormValues = (): HiringFormValues => ({
  description: "",
  about: "",
  apply: "",
  key_responsibility: "",
  apply_start_date: "",
  apply_end_date: "",
  location: [],
  category: [],
  job_type: [],
  designation: [],
  skills: [],
  course: [],
  perk: [],
  start_amount: "",
  end_amount: "",
  start_anual_salary: "",
  end_anual_salary: "",
  start_day: "",
  active: true,
  placement_gurantee_course: false,
  number_of_opening: "",
  is_fast_response: false,
});

const listToOptions = (list?: Array<{ id: string | number; name: string }>) =>
  Array.isArray(list)
    ? list.map((item) => ({ id: item.id, name: item.name }))
    : [];

const toDateInputValue = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const yyyyMMdd = raw.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd) ? yyyyMMdd : "";
};

const toNonNegativeNumberInput = (raw: string) => {
  if (!raw) return "";
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("-")) return "0";
  return raw;
};

const toIds = (items: OptionItem[]) => items.map((item) => Number(item.id));

const toCreatePayload = (values: HiringFormValues) => ({
  description: values.description.trim() || null,
  about: values.about.trim() || null,
  apply: values.apply.trim() || null,
  key_responsibility: values.key_responsibility.trim() || null,
  apply_start_date: values.apply_start_date || null,
  apply_end_date: values.apply_end_date || null,
  location: toIds(values.location),
  category: toIds(values.category),
  job_type: toIds(values.job_type),
  designation: toIds(values.designation),
  skills: toIds(values.skills),
  course: toIds(values.course),
  perk: toIds(values.perk),
  start_amount: values.start_amount ? Number(values.start_amount) : null,
  end_amount: values.end_amount ? Number(values.end_amount) : null,
  start_anual_salary: values.start_anual_salary
    ? Number(values.start_anual_salary)
    : null,
  end_anual_salary: values.end_anual_salary ? Number(values.end_anual_salary) : null,
  start_day: values.start_day || null,
  active: values.active,
  placement_gurantee_course: values.placement_gurantee_course,
  number_of_opening: values.number_of_opening
    ? Number(values.number_of_opening)
    : null,
  is_fast_response: values.is_fast_response,
});

const toUpdatePayload = (values: HiringFormValues) => ({
  description: values.description.trim() || null,
  about: values.about.trim() || null,
  apply: values.apply.trim() || null,
  key_responsibility: values.key_responsibility.trim() || null,
  apply_start_date: values.apply_start_date || null,
  apply_end_date: values.apply_end_date || null,
  location: toIds(values.location),
  category: toIds(values.category),
  job_type: toIds(values.job_type),
  designation: toIds(values.designation),
  skills: toIds(values.skills),
  course: toIds(values.course),
  perk: toIds(values.perk),
  start_amount: values.start_amount ? Number(values.start_amount) : null,
  end_amount: values.end_amount ? Number(values.end_amount) : null,
  start_anual_salary: values.start_anual_salary
    ? Number(values.start_anual_salary)
    : null,
  end_anual_salary: values.end_anual_salary ? Number(values.end_anual_salary) : null,
  start_day: values.start_day || null,
  active: values.active,
  placement_gurantee_course: values.placement_gurantee_course,
  number_of_opening: values.number_of_opening
    ? Number(values.number_of_opening)
    : null,
  is_fast_response: values.is_fast_response,
});

const SearchTagInput = ({
  label,
  value,
  placeholder,
  fetchOptions,
  onChange,
}: {
  label: string;
  value: OptionItem[];
  placeholder?: string;
  fetchOptions: (query: string) => Promise<OptionItem[]>;
  onChange: (next: OptionItem[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (!open) return;
    const query = inputValue.trim();

    const id = ++requestId.current;
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetchOptions(query)
        .then((result) => {
          if (requestId.current !== id) return;
          setOptions(result || []);
          setOpen(true);
        })
        .catch(() => {
          if (requestId.current !== id) return;
          setOptions([]);
          setOpen(false);
        })
        .finally(() => {
          if (requestId.current === id) setLoading(false);
        });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchOptions, inputValue, open]);

  const addOption = (option: OptionItem) => {
    const nextName = option.name.trim();
    if (!nextName) return;
    if (value.some((item) => String(item.id) === String(option.id))) {
      setInputValue("");
      setOpen(false);
      return;
    }
    onChange([...value, option]);
    setInputValue("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2 space-y-2">
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2 rounded-lg bg-background px-3 py-2">
            {value.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
              >
                {item.name}
                <button
                  type="button"
                  className="text-muted-foreground transition hover:text-foreground"
                  onClick={() =>
                    onChange(value.filter((entry) => entry.id !== item.id))
                  }
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center rounded-lg border bg-background px-3 py-2">
          <input
            type="text"
            className="w-full bg-transparent text-sm outline-none"
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onFocus={() => {
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const match = options.find(
                  (option) =>
                    option.name.toLowerCase() === inputValue.trim().toLowerCase()
                );
                if (match) {
                  addOption(match);
                }
              }
              if (event.key === "Backspace" && !inputValue && value.length > 0) {
                event.preventDefault();
              }
            }}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 150);
            }}
          />
        </div>
      </div>
      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-auto rounded-xl border bg-background shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Searching...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-muted/70"
                onMouseDown={(event) => {
                  event.preventDefault();
                  addOption(option);
                }}
              >
                <span>{option.name}</span>
                {option.description ? (
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

export function CompanyHiringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [activeHiringId, setActiveHiringId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [hiringToDelete, setHiringToDelete] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<HiringFormValues>(() =>
    emptyFormValues()
  );
  const [initialValues, setInitialValues] = useState<HiringFormValues>(() =>
    emptyFormValues()
  );
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
  } = useCompanyHiringPaginated(10, searchTerm);
  const { create: createHiring } = useCreateCompanyHiring();
  const { update: updateHiring } = useUpdateCompanyHiring();
  const { delete: deleteHiring, loading: deleting } = useDeleteCompanyHiring();

  const cityFetcher = useCallback(
    (query: string) =>
      getAllCities(query).then((result) => result.data || []),
    []
  );
  const categoryFetcher = useCallback(
    (query: string) =>
      getAllCategories(query).then((result) => result.data || []),
    []
  );
  const jobTypeFetcher = useCallback(
    (query: string) =>
      getAllJobTypes(query).then((res) =>
        (res.data || []).map((item) => ({ id: item.id, name: item.name }))
      ),
    []
  );
  const designationFetcher = useCallback(
    (query: string) =>
      getAllDesignations(query).then((res) =>
        (res.data || []).map((item) => ({ id: item.id, name: item.name }))
      ),
    []
  );
  const skillFetcher = useCallback(
    (query: string) =>
      getAllSkills(query).then((res) =>
        (res.data || []).map((item) => ({ id: item.id, name: item.name }))
      ),
    []
  );
  const courseFetcher = useCallback(
    (query: string) =>
      getAllCourses(query, formValues.placement_gurantee_course).then((res) =>
        (res.data || []).map((item) => ({ id: item.id, name: item.name }))
      ),
    [formValues.placement_gurantee_course]
  );
  const perkFetcher = useCallback(
    (query: string) =>
      getAllPerks(query).then((res) =>
        (res.data || []).map((item) => ({ id: item.id, name: item.name }))
      ),
    []
  );

  const rows = useMemo(
    () =>
      (items ?? []).map((item, index) => ({
        id: item.id,
        raw: item,
        sr: String((page - 1) * perPage + index + 1),
        company: item.comapany?.name ?? "-",
        designation:
          item.designation && item.designation.length > 0
            ? item.designation.map((d) => d.name).join(", ")
            : "-",
        location:
          item.location && item.location.length > 0
            ? item.location.map((loc) => loc.name).join(", ")
            : "-",
        category:
          item.category && item.category.length > 0
            ? item.category.map((cat) => cat.name).join(", ")
            : "-",
        amount: `₹${item.start_amount?.toLocaleString() ?? 0} - ₹${item.end_amount?.toLocaleString() ?? 0}`,
        openings: item.number_of_opening ?? "-",
        active: item.active ? "Yes" : "No",
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
    const nextValues = emptyFormValues();
    setFormValues(nextValues);
    setInitialValues(nextValues);
    setActiveHiringId(null);
    setModalMode("create");
    setFieldErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const openUpdateModal = (hiring: CompanyHiring) => {
    const nextValues: HiringFormValues = {
      description: String(hiring.description ?? ""),
      about: String((hiring as unknown as { about?: string | null }).about ?? ""),
      apply: String((hiring as unknown as { apply?: string | null }).apply ?? ""),
      key_responsibility: String(
        (hiring as unknown as { key_responsibility?: string | null })
          .key_responsibility ?? ""
      ),
      apply_start_date: toDateInputValue(
        (hiring as unknown as { apply_start_date?: string | null }).apply_start_date
      ),
      apply_end_date: toDateInputValue(
        (hiring as unknown as { apply_end_date?: string | null }).apply_end_date
      ),
      location: listToOptions(hiring.location),
      category: listToOptions(hiring.category),
      job_type: listToOptions(hiring.job_type),
      designation: listToOptions(hiring.designation),
      skills: listToOptions(hiring.skills),
      course: listToOptions(hiring.course),
      perk: listToOptions(hiring.perk),
      start_amount: String(hiring.start_amount ?? ""),
      end_amount: String(hiring.end_amount ?? ""),
      start_anual_salary: String(
        (hiring as unknown as { start_anual_salary?: number | null }).start_anual_salary ??
          ""
      ),
      end_anual_salary: String(
        (hiring as unknown as { end_anual_salary?: number | null }).end_anual_salary ??
          ""
      ),
      start_day: toDateInputValue(hiring.start_day),
      active: Boolean(hiring.active),
      placement_gurantee_course: Boolean(hiring.placement_gurantee_course),
      number_of_opening: String(hiring.number_of_opening ?? ""),
      is_fast_response: Boolean(hiring.is_fast_response),
    };

    setFormValues(nextValues);
    setInitialValues(nextValues);
    setActiveHiringId(hiring.id);
    setModalMode("update");
    setFieldErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (hiringId: number) => {
    setHiringToDelete(hiringId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hiringToDelete) return;

    const result = await deleteHiring(hiringToDelete);
    if (result.ok) {
      toast.success(result.data?.message || "Hiring deleted successfully");
      setDeleteConfirmOpen(false);
      setHiringToDelete(null);
      refresh();
    } else {
      toast.error("Failed to delete hiring");
    }
  };

  const isEqualValue = (
    left: string | number | boolean | OptionItem[],
    right: string | number | boolean | OptionItem[]
  ) => {
    if (Array.isArray(left) && Array.isArray(right)) {
      const leftIds = left.map((item) =>
        typeof item === "object" ? String(item.id) : String(item)
      );
      const rightIds = right.map((item) =>
        typeof item === "object" ? String(item.id) : String(item)
      );
      return leftIds.join("|") === rightIds.join("|");
    }
    return left === right;
  };

  const clearFieldError = (key: string) => {
    if (!fieldErrors[key]) return;
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const renderFieldErrors = (key: string) =>
    fieldErrors[key]?.length ? (
      <div className="mt-1 space-y-0.5">
        {fieldErrors[key].map((message, index) => (
          <p key={index} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
    ) : null;

  const applyValidationErrors = (error: unknown) => {
    const extracted = extractFieldErrors(error) ?? {};
    setFieldErrors(extracted);

    const knownKeys = new Set<string>([
      "description",
      "about",
      "apply",
      "key_responsibility",
      "apply_start_date",
      "apply_end_date",
      "location",
      "category",
      "job_type",
      "designation",
      "skills",
      "course",
      "perk",
      "start_amount",
      "end_amount",
      "start_anual_salary",
      "end_anual_salary",
      "start_day",
      "active",
      "placement_gurantee_course",
      "number_of_opening",
      "is_fast_response",
    ]);

    const unknownEntries = Object.entries(extracted).filter(
      ([key]) => !knownKeys.has(key)
    );
    if (unknownEntries.length === 0) {
      setFormError(null);
      return;
    }

    setFormError(
      unknownEntries
        .map(([key, messages]) => `${key}: ${messages.join(" ")}`)
        .join("\n")
    );
  };

  return (
    <>
      <DataTableShell
        title="Hiring"
        addLabel="Add hiring"
        searchPlaceholder="Search hiring..."
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
              <table className="w-full min-w-[1000px] text-left text-sm">
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
                        <td className="px-2 py-2 text-center text-xs sm:px-4 sm:text-sm">
                          {row.sr}
                        </td>
                        <td className="px-2 py-2 text-xs font-medium text-foreground wrap-break-word whitespace-normal max-w-[240px] sm:px-4 sm:text-sm">
                          {row.company}
                        </td>
                        <td className="px-2 py-2 text-xs wrap-break-word whitespace-normal max-w-[240px] sm:px-4 sm:text-sm">
                          {row.designation}
                        </td>
                        <td className="px-2 py-2 text-xs wrap-break-word whitespace-normal max-w-[240px] sm:px-4 sm:text-sm">
                          {row.location}
                        </td>
                        <td className="px-2 py-2 text-xs wrap-break-word whitespace-normal max-w-[240px] sm:px-4 sm:text-sm">
                          {row.category}
                        </td>
                        <td className="px-2 py-2 text-xs sm:px-4 sm:text-sm">
                          {row.amount}
                        </td>
                        <td className="px-2 py-2 text-xs sm:px-4 sm:text-sm">
                          {row.openings}
                        </td>
                        <td className="px-2 py-2 text-xs sm:px-4 sm:text-sm">
                          {row.active}
                        </td>
                        <td className="px-2 py-2 sm:px-4">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <Link
                              href={`/company/hiring/${row.id}`}
                              className={cx(
                                "inline-flex h-7 w-7 items-center justify-center rounded-xl border text-muted-foreground transition sm:h-8 sm:w-8",
                                "hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                              )}
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
                                "inline-flex h-7 w-7 items-center justify-center rounded-xl border text-red-600 transition sm:h-8 sm:w-8",
                                "hover:border-red-300 hover:bg-red-50"
                              )}
                              aria-label="Delete"
                              title="Delete"
                              onClick={() => handleDeleteClick(row.id)}
                              disabled={deleting}
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
      <Modal
        open={modalOpen}
        title={modalMode === "create" ? "Add hiring" : "Update hiring"}
        onClose={() => {
          setModalOpen(false);
          setFieldErrors({});
          setFormError(null);
        }}
        panelClassName="w-[90vw] !max-w-4xl"
        bodyClassName="max-h-[70vh] overflow-y-auto pr-2"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
              onClick={() => {
                setModalOpen(false);
                setFieldErrors({});
                setFormError(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-10 rounded-2xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90"
              disabled={saving}
              onClick={() => {
                if (modalMode === "create") {
                  const payload = toCreatePayload(formValues);
                  setSaving(true);
                  createHiring(payload).then((result) => {
                    setSaving(false);
                    if (!result.ok) {
                      applyValidationErrors(result.error);
                      return;
                    }
                    setModalOpen(false);
                    setFieldErrors({});
                    setFormError(null);
                    refresh();
                    toast.success("Hiring created successfully");
                  });
                  return;
                }

                if (!activeHiringId) return;
                const payload = toUpdatePayload(formValues);
                const initialPayload = toUpdatePayload(initialValues);
                const patchData = Object.fromEntries(
                  Object.entries(payload).filter(([key, value]) => {
                    const initialValue =
                      initialPayload[key as keyof typeof initialPayload];
                    return !isEqualValue(
                      value as string | number | boolean | OptionItem[],
                      initialValue as string | number | boolean | OptionItem[]
                    );
                  })
                );

                setSaving(true);
                updateHiring(activeHiringId, patchData).then((result) => {
                  setSaving(false);
                  if (!result.ok) {
                    applyValidationErrors(result.error);
                    return;
                  }
                  setModalOpen(false);
                  setFieldErrors({});
                  setFormError(null);
                  refresh();
                  toast.success("Hiring updated successfully");
                });
              }}
            >
              {saving ? "Saving..." : modalMode === "create" ? "Create" : "Update"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {formError ? (
            <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          <SearchTagInput
            label="Designation"
            value={formValues.designation}
            placeholder="Search designation..."
            fetchOptions={designationFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("designation");
                return { ...prev, designation: next };
              })
            }
          />
          {renderFieldErrors("designation")}

          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("description");
                  return { ...prev, description: event.target.value };
                })
              }
            />
            {renderFieldErrors("description")}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">About</label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.about}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("about");
                  return { ...prev, about: event.target.value };
                })
              }
            />
            {renderFieldErrors("about")}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">How to apply</label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.apply}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("apply");
                  return { ...prev, apply: event.target.value };
                })
              }
            />
            {renderFieldErrors("apply")}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Key responsibility
            </label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.key_responsibility}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("key_responsibility");
                  return { ...prev, key_responsibility: event.target.value };
                })
              }
            />
            {renderFieldErrors("key_responsibility")}
          </div>

          <SearchTagInput
            label="Location"
            value={formValues.location}
            placeholder="Search city..."
            fetchOptions={cityFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("location");
                return { ...prev, location: next };
              })
            }
          />
          {renderFieldErrors("location")}

          <SearchTagInput
            label="Category"
            value={formValues.category}
            placeholder="Search category..."
            fetchOptions={categoryFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("category");
                return { ...prev, category: next };
              })
            }
          />
          {renderFieldErrors("category")}

          <SearchTagInput
            label="Job Type"
            value={formValues.job_type}
            placeholder="Search job type..."
            fetchOptions={jobTypeFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("job_type");
                return { ...prev, job_type: next };
              })
            }
          />
          {renderFieldErrors("job_type")}


          <SearchTagInput
            label="Certifications/Perk"
            value={formValues.skills}
            placeholder="Search Certifications/Perk..."
            fetchOptions={skillFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("skills");
                return { ...prev, skills: next };
              })
            }
          />
          {renderFieldErrors("skills")}


          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={formValues.placement_gurantee_course}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("placement_gurantee_course");
                  return {
                    ...prev,
                    placement_gurantee_course: event.target.checked,
                  };
                })
              }
            />
            <label className="text-sm font-medium text-foreground">
              Placement Guarantee Course (If selected, the below course will be guaranteed for placement)
            </label>
          </div>
          {renderFieldErrors("placement_gurantee_course")}

          <SearchTagInput
            label="Certification Courses"
            value={formValues.course}
            placeholder="Search certification courses..."
            fetchOptions={courseFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("course");
                return { ...prev, course: next };
              })
            }
          />
          {renderFieldErrors("course")}

          <SearchTagInput
            label="Certification/Perk"
            value={formValues.perk}
            placeholder="Search certification/perk..."
            fetchOptions={perkFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("perk");
                return { ...prev, perk: next };
              })
            }
          />
          {renderFieldErrors("perk")}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Amount  (₹)
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={0}
                value={formValues.start_amount}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("start_amount");
                    return {
                      ...prev,
                      start_amount: toNonNegativeNumberInput(event.target.value),
                    };
                  })
                }
              />
              {renderFieldErrors("start_amount")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                End Amount (₹)
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={0}
                value={formValues.end_amount}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("end_amount");
                    return {
                      ...prev,
                      end_amount: toNonNegativeNumberInput(event.target.value),
                    };
                  })
                }
              />
              {renderFieldErrors("end_amount")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Day
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.start_day}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("start_day");
                    return { ...prev, start_day: event.target.value };
                  })
                }
              />
              {renderFieldErrors("start_day")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Number of Openings
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={0}
                value={formValues.number_of_opening}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("number_of_opening");
                    return {
                      ...prev,
                      number_of_opening: toNonNegativeNumberInput(
                        event.target.value
                      ),
                    };
                  })
                }
              />
              {renderFieldErrors("number_of_opening")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Apply Start Date
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={new Date().toISOString().slice(0, 10)}
                value={formValues.apply_start_date}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("apply_start_date");
                    const nextStart = event.target.value;
                    const nextEnd =
                      prev.apply_end_date &&
                      nextStart &&
                      prev.apply_end_date < nextStart
                        ? ""
                        : prev.apply_end_date;
                    if (nextEnd !== prev.apply_end_date) {
                      clearFieldError("apply_end_date");
                    }
                    return {
                      ...prev,
                      apply_start_date: nextStart,
                      apply_end_date: nextEnd,
                    };
                  })
                }
              />
              {renderFieldErrors("apply_start_date")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Apply End Date
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={
                  formValues.apply_start_date
                    ? formValues.apply_start_date
                    : new Date().toISOString().slice(0, 10)
                }
                value={formValues.apply_end_date}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("apply_end_date");
                    return { ...prev, apply_end_date: event.target.value };
                  })
                }
              />
              {renderFieldErrors("apply_end_date")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Annual Salary (₹)
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={0}
                value={formValues.start_anual_salary}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("start_anual_salary");
                    return {
                      ...prev,
                      start_anual_salary: toNonNegativeNumberInput(event.target.value),
                    };
                  })
                }
              />
              {renderFieldErrors("start_anual_salary")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                End Annual Salary (₹)
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={0}
                value={formValues.end_anual_salary}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("end_anual_salary");
                    return {
                      ...prev,
                      end_anual_salary: toNonNegativeNumberInput(event.target.value),
                    };
                  })
                }
              />
              {renderFieldErrors("end_anual_salary")}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={formValues.active}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("active");
                  return { ...prev, active: event.target.checked };
                })
              }
            />
            <label className="text-sm font-medium text-foreground">
              Is Active
            </label>
          </div>
          {renderFieldErrors("active")}


          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={formValues.is_fast_response}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("is_fast_response");
                  return { ...prev, is_fast_response: event.target.checked };
                })
              }
            />
            <label className="text-sm font-medium text-foreground">
              Fast Response
            </label>
          </div>
          {renderFieldErrors("is_fast_response")}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Hiring?"
        description="Are you sure you want to delete this hiring? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setHiringToDelete(null);
        }}
      />
    </>
  );
}
