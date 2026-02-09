"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Modal } from "@/components/ui/modal";
import { TagInput } from "@/components/ui/tag-input";
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
  name: string;
  email: string;
  mobile: string;
  description: string;
  location: string[];
  category: string[];
  job_type: string[];
  designation: string[];
  skills: string[];
  course: string[];
  perk: string[];
  start_amount: string;
  end_amount: string;
  start_day: string;
  start_anual_salary: string;
  end_anual_salary: string;
  number_of_opening: string;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date: string;
  apply_end_date: string;
  active: boolean;
  placement_gurantee_course: boolean;
  is_fast_response: boolean;
};

const emptyFormValues = (): CompanyFormValues => ({
  name: "",
  email: "",
  mobile: "",
  description: "",
  location: [],
  category: [],
  job_type: [],
  designation: [],
  skills: [],
  course: [],
  perk: [],
  start_amount: "",
  end_amount: "",
  start_day: "",
  start_anual_salary: "",
  end_anual_salary: "",
  number_of_opening: "",
  about: "",
  apply: "",
  key_responsibility: "",
  apply_start_date: "",
  apply_end_date: "",
  active: false,
  placement_gurantee_course: false,
  is_fast_response: false,
});

const listToArray = (list?: Array<{ name: string }>) =>
  Array.isArray(list) ? list.map((item) => item.name).filter(Boolean) : [];

const toPayload = (values: CompanyFormValues) => ({
  name: values.name,
  email: values.email,
  mobile: values.mobile,
  description: values.description,
  location: values.location,
  category: values.category,
  job_type: values.job_type,
  designation: values.designation,
  skills: values.skills,
  course: values.course,
  perk: values.perk,
  start_amount: Number(values.start_amount || 0),
  end_amount: Number(values.end_amount || 0),
  start_day: values.start_day,
  start_anual_salary: Number(values.start_anual_salary || 0),
  end_anual_salary: Number(values.end_anual_salary || 0),
  number_of_opening: Number(values.number_of_opening || 0),
  about: values.about,
  apply: values.apply,
  key_responsibility: values.key_responsibility,
  apply_start_date: values.apply_start_date,
  apply_end_date: values.apply_end_date,
  active: values.active,
  placement_gurantee_course: values.placement_gurantee_course,
  is_fast_response: values.is_fast_response,
});

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
    setModalOpen(true);
  };

  const openUpdateModal = (company: CompanyListItem & Record<string, unknown>) => {
    const nextValues: CompanyFormValues = {
      name: String(company.name ?? ""),
      email: String((company as { email?: string }).email ?? ""),
      mobile: String((company as { mobile?: string }).mobile ?? ""),
      description: String(company.description ?? ""),
      location: listToArray(company.location ?? []),
      category: listToArray(
        (company as { category?: Array<{ name: string }> }).category
      ),
      job_type: listToArray(
        (company as { job_type?: Array<{ name: string }> }).job_type
      ),
      designation: listToArray(
        (company as { designation?: Array<{ name: string }> }).designation
      ),
      skills: listToArray(
        (company as { skills?: Array<{ name: string }> }).skills
      ),
      course: listToArray(
        (company as { course?: Array<{ name: string }> }).course
      ),
      perk: listToArray(
        (company as { perk?: Array<{ name: string }> }).perk
      ),
      start_amount: String(
        (company as { start_amount?: number }).start_amount ?? ""
      ),
      end_amount: String(
        (company as { end_amount?: number }).end_amount ?? ""
      ),
      start_day: String((company as { start_day?: string }).start_day ?? ""),
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
      apply_start_date: String(
        (company as { apply_start_date?: string }).apply_start_date ?? ""
      ),
      apply_end_date: String(
        (company as { apply_end_date?: string }).apply_end_date ?? ""
      ),
      active: Boolean(company.active),
      placement_gurantee_course: Boolean(company.placement_gurantee_course),
      is_fast_response: Boolean(
        (company as { is_fast_response?: boolean }).is_fast_response
      ),
    };

    setFormValues(nextValues);
    setInitialValues(nextValues);
    setActiveCompanyId(String(company.id));
    setModalMode("update");
    setModalOpen(true);
  };

  const isEqualValue = (
    left: string | number | boolean | string[],
    right: string | number | boolean | string[]
  ) =>
    Array.isArray(left) && Array.isArray(right)
      ? left.join("|") === right.join("|")
      : left === right;

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
        onClose={() => setModalOpen(false)}
        panelClassName="w-[90vw] !max-w-4xl"
        bodyClassName="max-h-[70vh] overflow-y-auto pr-2"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-10 rounded-2xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90"
              disabled={saving}
              onClick={() => {
                const payload = toPayload(formValues);
                if (modalMode === "create") {
                  setSaving(true);
                  createCompany(payload).then((result) => {
                    setSaving(false);
                    if (!result.ok) return;
                    setModalOpen(false);
                    refresh();
                  });
                  return;
                }

                if (!activeCompanyId) return;
                const initialPayload = toPayload(initialValues);
                const patchData = Object.fromEntries(
                  Object.entries(payload).filter(([key, value]) => {
                    const initialValue =
                      initialPayload[key as keyof typeof initialPayload];
                    return !isEqualValue(
                      value as string | number | boolean | string[],
                      initialValue as string | number | boolean | string[]
                    );
                  })
                );

                setSaving(true);
                updateCompany({
                  companyId: activeCompanyId,
                  patchData,
                }).then((result) => {
                  setSaving(false);
                  if (!result.ok) return;
                  setModalOpen(false);
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mobile</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.mobile}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    mobile: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Amount
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.start_amount}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    start_amount: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                End Amount
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.end_amount}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    end_amount: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Number of Openings
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.number_of_opening}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    number_of_opening: event.target.value,
                  }))
                }
              />
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
                  setFormValues((prev) => ({
                    ...prev,
                    start_day: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Start Annual Salary
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.start_anual_salary}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    start_anual_salary: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                End Annual Salary
              </label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.end_anual_salary}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    end_anual_salary: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TagInput
              label="Location"
              value={formValues.location}
              placeholder="Add location"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, location: next }))
              }
            />
            <TagInput
              label="Category"
              value={formValues.category}
              placeholder="Add category"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, category: next }))
              }
            />
            <TagInput
              label="Job Type"
              value={formValues.job_type}
              placeholder="Add job type"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, job_type: next }))
              }
            />
            <TagInput
              label="Designation"
              value={formValues.designation}
              placeholder="Add designation"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, designation: next }))
              }
            />
            <TagInput
              label="Skills"
              value={formValues.skills}
              placeholder="Add skill"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, skills: next }))
              }
            />
            <TagInput
              label="Courses"
              value={formValues.course}
              placeholder="Add course"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, course: next }))
              }
            />
            <TagInput
              label="Perks"
              value={formValues.perk}
              placeholder="Add perk"
              onChange={(next) =>
                setFormValues((prev) => ({ ...prev, perk: next }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Apply Start Date
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.apply_start_date}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    apply_start_date: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Apply End Date
              </label>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={formValues.apply_end_date}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    apply_end_date: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-xs text-muted-foreground">
                  Show company as active
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formValues.active}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    active: event.target.checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Placement Guarantee
                </p>
                <p className="text-xs text-muted-foreground">
                  Course placement guarantee
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formValues.placement_gurantee_course}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    placement_gurantee_course: event.target.checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Fast Response
                </p>
                <p className="text-xs text-muted-foreground">
                  Prioritize quick responses
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formValues.is_fast_response}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    is_fast_response: event.target.checked,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">About</label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.about}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  about: event.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              How to Apply
            </label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.apply}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  apply: event.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Key Responsibility
            </label>
            <textarea
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={formValues.key_responsibility}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  key_responsibility: event.target.value,
                }))
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
