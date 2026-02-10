"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Modal } from "@/components/ui/modal";
import { extractFieldErrors } from "@/lib/validation-errors";
import { getAllCities } from "@/services/city.service";
import { getAllCategories } from "@/services/category.service";
import { getAllJobTypes } from "@/services/jobtype.service";
import { getAllDesignations } from "@/services/designation.service";
import { getAllSkills } from "@/services/skill.service";
import { getAllCourses } from "@/services/course.service";
import { getAllPerks } from "@/services/perk.service";
import {
  useCompaniesPaginated,
  useCreateCompany,
  useUpdateCompany,
} from "@/hooks/useCompanies";
import type { CompanyListItem } from "@/types/company-list";

const columns = [
  { key: "sr", label: "Sr No", headerClassName: "w-20 px-4 py-2 text-center" },
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

type CompanyFormValues = {
  user_type: string;
  name: string;
  description: string;
  location: OptionItem[];
  category: OptionItem[];
  email: string;
  start_day: string;
  mobile: string;
  password: string;
  job_type: OptionItem[];
  designation: OptionItem[];
  skills: OptionItem[];
  course: OptionItem[];
  perk: OptionItem[];
  start_anual_salary: string;
  end_anual_salary: string;
  start_amount: string;
  end_amount: string;
  number_of_opening: string;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date: string;
  apply_end_date: string;
  qualification: string;
  education: string;
  active: boolean;
  placement_gurantee_course: boolean;
};

const emptyFormValues = (): CompanyFormValues => ({
  user_type: "COMPANY",
  name: "",
  description: "",
  email: "",
  start_day: "",
  mobile: "",
  password: "",
  location: [],
  category: [],
  job_type: [],
  designation: [],
  skills: [],
  course: [],
  perk: [],
  start_anual_salary: "",
  end_anual_salary: "",
  start_amount: "",
  end_amount: "",
  number_of_opening: "",
  about: "",
  apply: "",
  key_responsibility: "",
  apply_start_date: "",
  apply_end_date: "",
  qualification: "",
  education: "",
  active: false,
  placement_gurantee_course: false,
});

type OptionItem = {
  id: string | number;
  name: string;
  description?: string | null;
};

const listToOptions = (list?: Array<{ id: string | number; name: string }>) =>
  Array.isArray(list)
    ? list.map((item) => ({ id: item.id, name: item.name }))
    : [];

const toDateInputValue = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  // API sometimes returns ISO timestamps; date input needs YYYY-MM-DD
  const yyyyMMdd = raw.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd) ? yyyyMMdd : "";
};

const getTodayLocalIsoDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const toNonNegativeNumberInput = (raw: string) => {
  if (!raw) return "";
  const value = raw.trim();
  if (!value) return "";
  // prevent negative values (typed or pasted)
  if (value.startsWith("-")) return "0";
  return raw;
};

const toCreatePayload = (values: CompanyFormValues) => ({
  user_type: values.user_type,
  name: values.name,
  mobile: values.mobile,
  email: values.email,
  password: values.password,
  description: values.description,
  start_amount: Number(values.start_amount || 0),
  end_amount: Number(values.end_amount || 0),
  start_day: values.start_day || undefined,
  start_anual_salary: Number(values.start_anual_salary || 0),
  end_anual_salary: Number(values.end_anual_salary || 0),
  active: values.active,
  placement_gurantee_course: values.placement_gurantee_course,
  number_of_opening: Number(values.number_of_opening || 0),
  about: values.about,
  apply: values.apply,
  key_responsibility: values.key_responsibility,
  apply_start_date: values.apply_start_date || undefined,
  apply_end_date: values.apply_end_date || undefined,
  qualification: values.qualification,
  education: values.education,
  is_fast_response: false,
  job_type: values.job_type.map((item) => String(item.id)),
  category: values.category.map((item) => String(item.id)),
  designation: values.designation.map((item) => String(item.id)),
  course: values.course.map((item) => String(item.id)),
  perk: values.perk.map((item) => String(item.id)),
  location: values.location.map((item) => String(item.id)),
  skills: values.skills.map((item) => String(item.id)),
});

const toUpdatePayload = (values: CompanyFormValues) => ({
  location: values.location.map((item) => String(item.id)),
  category: values.category.map((item) => String(item.id)),
  job_type: values.job_type.map((item) => String(item.id)),
  designation: values.designation.map((item) => String(item.id)),
  skills: values.skills.map((item) => String(item.id)),
  course: values.course.map((item) => String(item.id)),
  perk: values.perk.map((item) => String(item.id)),
  name: values.name,
  description: values.description,
  active: values.active,
  start_day: values.start_day || undefined,
  start_anual_salary: Number(values.start_anual_salary || 0),
  end_anual_salary: Number(values.end_anual_salary || 0),
  start_amount: Number(values.start_amount || 0),
  end_amount: Number(values.end_amount || 0),
  placement_gurantee_course: values.placement_gurantee_course,
  number_of_opening: Number(values.number_of_opening || 0),
  about: values.about,
  apply: values.apply,
  key_responsibility: values.key_responsibility,
  apply_start_date: values.apply_start_date || undefined,
  apply_end_date: values.apply_end_date || undefined,
  qualification: values.qualification,
  education: values.education,
  mobile: values.mobile,
  email: values.email,
  password: values.password || undefined,
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
    const query = inputValue.trim();
    if (!query) {
      setOptions([]);
      setOpen(false);
      return;
    }

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
  }, [fetchOptions, inputValue]);

  const addOption = (option: OptionItem) => {
    const nextName = option.name.trim();
    if (!nextName) return;
    if (
      value.some(
        (item) => String(item.id) === String(option.id)
      )
    ) {
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
              if (options.length > 0) setOpen(true);
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
              No city found
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

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const todayLocalIso = useMemo(() => getTodayLocalIsoDate(), []);
  const [formValues, setFormValues] = useState<CompanyFormValues>(() =>
    emptyFormValues()
  );
  const [initialValues, setInitialValues] = useState<CompanyFormValues>(() =>
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
  } = useCompaniesPaginated(10, searchTerm);
  const { data: createCompany } = useCreateCompany();
  const { data: updateCompany } = useUpdateCompany();

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
      getAllJobTypes(query).then((result) => result.data || []),
    []
  );
  const designationFetcher = useCallback(
    (query: string) =>
      getAllDesignations(query).then((result) => result.data || []),
    []
  );
  const skillFetcher = useCallback(
    (query: string) =>
      getAllSkills(query).then((result) => result.data || []),
    []
  );
  const courseFetcher = useCallback(
    (query: string) =>
      getAllCourses(query).then((result) => result.data || []),
    []
  );
  const perkFetcher = useCallback(
    (query: string) =>
      getAllPerks(query).then((result) => result.data || []),
    []
  );

  const rows = useMemo(
    () =>
      (items ?? []).map((item, index) => ({
        id: item.id,
        raw: item,
        sr: String((page - 1) * perPage + index + 1),
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
    const nextValues = emptyFormValues();
    setFormValues(nextValues);
    setInitialValues(nextValues);
    setActiveCompanyId(null);
    setModalMode("create");
    setFieldErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const openUpdateModal = (company: CompanyListItem & Record<string, unknown>) => {
    const nextValues: CompanyFormValues = {
      user_type: String(
        (company as { user_type?: string }).user_type ?? "COMPANY"
      ),
      name: String(company.name ?? ""),
      description: String(company.description ?? ""),
      location: listToOptions(company.location ?? []),
      category: listToOptions(
        (company as { category?: Array<{ id: string | number; name: string }> })
          .category
      ),
      email: String((company as { email?: string }).email ?? ""),
      start_day: toDateInputValue((company as { start_day?: string | null }).start_day),
      mobile: String((company as { mobile?: string }).mobile ?? ""),
      password: "",
      job_type: listToOptions(
        (company as { job_type?: Array<{ id: string | number; name: string }> })
          .job_type
      ),
      designation: listToOptions(
        (company as {
          designation?: Array<{ id: string | number; name: string }>;
        }).designation
      ),
      skills: listToOptions(
        (company as { skills?: Array<{ id: string | number; name: string }> })
          .skills
      ),
      course: listToOptions(
        (company as { course?: Array<{ id: string | number; name: string }> })
          .course
      ),
      perk: listToOptions(
        (company as { perk?: Array<{ id: string | number; name: string }> })
          .perk
      ),
      start_amount: String(
        (company as { start_amount?: number }).start_amount ?? ""
      ),
      end_amount: String(
        (company as { end_amount?: number }).end_amount ?? ""
      ),
      start_anual_salary: String(
        (company as { start_anual_salary?: number }).start_anual_salary ?? ""
      ),
      end_anual_salary: String(
        (company as { end_anual_salary?: number }).end_anual_salary ?? ""
      ),
      number_of_opening: String(
        (company as { number_of_opening?: number }).number_of_opening ?? ""
      ),
      about: String((company as { about?: string }).about ?? ""),
      apply: String((company as { apply?: string }).apply ?? ""),
      key_responsibility: String(
        (company as { key_responsibility?: string }).key_responsibility ?? ""
      ),
      apply_start_date: toDateInputValue(
        (company as { apply_start_date?: string }).apply_start_date ?? ""
      ),
      apply_end_date: toDateInputValue(
        (company as { apply_end_date?: string }).apply_end_date ?? ""
      ),
      qualification: String(
        (company as { qualification?: string }).qualification ?? ""
      ),
      education: String((company as { education?: string }).education ?? ""),
      active: Boolean(company.active),
      placement_gurantee_course: Boolean(company.placement_gurantee_course),
    };

    setFormValues(nextValues);
    setInitialValues(nextValues);
    setActiveCompanyId(String(company.id));
    setModalMode("update");
    setFieldErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const isEqualValue = (
    left: string | number | boolean | OptionItem[] | number[] | string[],
    right: string | number | boolean | OptionItem[] | number[] | string[]
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
      "user_type",
      "name",
      "description",
      "location",
      "category",
      "email",
      "start_day",
      "mobile",
      "password",
      "job_type",
      "designation",
      "skills",
      "course",
      "perk",
      "start_anual_salary",
      "end_anual_salary",
      "start_amount",
      "end_amount",
      "number_of_opening",
      "about",
      "apply",
      "key_responsibility",
      "apply_start_date",
      "apply_end_date",
      "qualification",
      "education",
      "active",
      "placement_gurantee_course",
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
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand text-xs uppercase text-white">
                <tr className="h-12">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={column.headerClassName ?? "px-4 py-2"}
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
                          className="px-4 py-2"
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
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      No record found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="h-12">
                      <td className="px-4 py-2 text-center">{row.sr}</td>
                      <td className="px-4 py-2 font-medium">{row.name}</td>
                      <td className="px-4 py-2 text-muted-foreground wrap-break-word whitespace-normal max-w-[360px]">
                        {row.description}
                      </td>
                      <td className="px-4 py-2 wrap-break-word whitespace-normal max-w-[240px]">
                        {row.location}
                      </td>
                      <td className="px-4 py-2">{row.active}</td>
                      <td className="px-4 py-2">{row.placement}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className={cx(
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl border text-brand transition",
                              "hover:border-brand/40 hover:bg-brand/10"
                            )}
                            aria-label="Edit"
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
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl border text-muted-foreground",
                              "cursor-not-allowed opacity-60"
                            )}
                            aria-label="Delete"
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
        }
        pagination={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {rows.length} of {count} entries
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded-xl border px-3 py-1 text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!hasPrev}
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className="h-9 w-9 rounded-xl border text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
                    onClick={() => setPage(pageNumber)}
                    disabled={pageNumber === page}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                className="rounded-xl border px-3 py-1 text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
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
        title={modalMode === "create" ? "Add company" : "Update company"}
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
                  createCompany(payload).then((result) => {
                    setSaving(false);
                    if (!result.ok) {
                      applyValidationErrors(result.error);
                      return;
                    }
                    setModalOpen(false);
                    setFieldErrors({});
                    setFormError(null);
                    refresh();
                  });
                  return;
                }

                if (!activeCompanyId) return;
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
                updateCompany({
                  companyId: activeCompanyId,
                  patchData,
                }).then((result) => {
                  setSaving(false);
                  if (!result.ok) {
                    applyValidationErrors(result.error);
                    return;
                  }
                  setModalOpen(false);
                  setFieldErrors({});
                  setFormError(null);
                  refresh();
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
          <div>
            <label className="text-sm font-medium text-foreground">
              Company Name
            </label>
            <input
              type="text"
              className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((prev) => {
                  clearFieldError("name");
                  return { ...prev, name: event.target.value };
                })
              }
            />
            {renderFieldErrors("name")}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Company Description
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Mobile
              </label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.mobile}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("mobile");
                    return { ...prev, mobile: event.target.value };
                  })
                }
              />
              {renderFieldErrors("mobile")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("email");
                    return { ...prev, email: event.target.value };
                  })
                }
              />
              {renderFieldErrors("email")}
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
                Password
              </label>
              <input
                type="password"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("password");
                    return { ...prev, password: event.target.value };
                  })
                }
              />
              {renderFieldErrors("password")}
              {modalMode === "update" ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave blank to keep the current password.
                </p>
              ) : null}
            </div>
          </div>

          <SearchTagInput
            label="JobType"
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

          <SearchTagInput
            label="Skills"
            value={formValues.skills}
            placeholder="Search skill..."
            fetchOptions={skillFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("skills");
                return { ...prev, skills: next };
              })
            }
          />
          {renderFieldErrors("skills")}

          <SearchTagInput
            label="Courses"
            value={formValues.course}
            placeholder="Search course..."
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
            label="Perks"
            value={formValues.perk}
            placeholder="Search perk..."
            fetchOptions={perkFetcher}
            onChange={(next) =>
              setFormValues((prev) => {
                clearFieldError("perk");
                return { ...prev, perk: next };
              })
            }
          />
          {renderFieldErrors("perk")}

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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Annual Salary
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
                      start_anual_salary: toNonNegativeNumberInput(
                        event.target.value
                      ),
                    };
                  })
                }
              />
              {renderFieldErrors("start_anual_salary")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                End Annual Salary
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
                      end_anual_salary: toNonNegativeNumberInput(
                        event.target.value
                      ),
                    };
                  })
                }
              />
              {renderFieldErrors("end_anual_salary")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Amount
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
                End Amount
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
          </div>

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
              Is Placement Guaranteed
            </label>
          </div>
          {renderFieldErrors("placement_gurantee_course")}

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
            <label className="text-sm font-medium text-foreground">
              How to Apply
            </label>
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
              Key Responsibility
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Apply Start Date
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                min={todayLocalIso}
                value={formValues.apply_start_date}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("apply_start_date");
                    return { ...prev, apply_start_date: event.target.value };
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
                min={formValues.apply_start_date || todayLocalIso}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Qualification
              </label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.qualification}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("qualification");
                    return { ...prev, qualification: event.target.value };
                  })
                }
              />
              {renderFieldErrors("qualification")}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Education
              </label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.education}
                onChange={(event) =>
                  setFormValues((prev) => {
                    clearFieldError("education");
                    return { ...prev, education: event.target.value };
                  })
                }
              />
              {renderFieldErrors("education")}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
