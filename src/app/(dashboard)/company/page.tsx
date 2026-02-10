"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TagInput } from "@/components/ui/tag-input";
import { useCompanyProfile } from "@/hooks/useCompany";
import type { CompanyData, CompanyReference } from "@/types/company";

const toDateInputValue = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const yyyyMMdd = raw.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(yyyyMMdd) ? yyyyMMdd : "";
};

const getTodayLocalIsoDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const emptyCompanyData = (): CompanyData => ({
  id: 0,
  user_type: "COMPANY",
  name: "",
  image: null,
  email: "",
  description: "",
  mobile: "",
  location: [],
  category: [],
  job_type: [],
  designation: [],
  skills: [],
  course: [],
  perk: [],
  start_amount: 0,
  end_amount: 0,
  start_day: "",
  start_anual_salary: 0,
  end_anual_salary: 0,
  active: false,
  placement_gurantee_course: false,
  number_of_opening: 0,
  about: "",
  apply: "",
  key_responsibility: "",
  apply_start_date: "",
  apply_end_date: "",
  is_fast_response: false,
});

const listToText = (list: CompanyReference[]) =>
  list.length > 0 ? list.map((item) => item.name).join(", ") : "-";

const listToArray = (list: CompanyReference[]) =>
  list.map((item) => item.name).filter(Boolean);

const textToList = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name, index) => ({ id: index + 1, name, description: "" }));

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="grid gap-1 text-sm sm:grid-cols-[160px_1fr] sm:gap-3">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default function CompanyPage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { fetchProfile, loading } = useCompanyProfile();
  const todayLocalIso = useMemo(() => getTodayLocalIsoDate(), []);
  const [formValues, setFormValues] = useState(() => {
    const seed = emptyCompanyData();
    return {
      name: seed.name,
      email: seed.email,
      mobile: seed.mobile,
      description: seed.description ?? "",
      location: listToArray(seed.location),
      category: listToArray(seed.category),
      job_type: listToArray(seed.job_type),
      designation: listToArray(seed.designation),
      skills: listToArray(seed.skills),
      course: listToArray(seed.course),
      perk: listToArray(seed.perk),
      start_amount: String(seed.start_amount),
      end_amount: String(seed.end_amount),
      start_day: toDateInputValue(seed.start_day),
      start_anual_salary: String(seed.start_anual_salary),
      end_anual_salary: String(seed.end_anual_salary),
      number_of_opening: String(seed.number_of_opening),
      about: seed.about,
      apply: seed.apply,
      key_responsibility: seed.key_responsibility,
      apply_start_date: toDateInputValue(seed.apply_start_date),
      apply_end_date: toDateInputValue(seed.apply_end_date),
      active: seed.active,
      placement_gurantee_course: seed.placement_gurantee_course,
      is_fast_response: seed.is_fast_response,
    };
  });

  const hasProfile = useMemo(() => Boolean(companyData?.id), [companyData]);

  useEffect(() => {
    fetchProfile().then((result) => {
      if (!result.ok || !result.data?.data) return;
      setCompanyData(result.data.data);
    });
  }, [fetchProfile]);

  useEffect(() => {
    if (!companyData) return;
    setFormValues({
      name: companyData.name,
      email: companyData.email,
      mobile: companyData.mobile,
      description: companyData.description ?? "",
      location: listToArray(companyData.location),
      category: listToArray(companyData.category),
      job_type: listToArray(companyData.job_type),
      designation: listToArray(companyData.designation),
      skills: listToArray(companyData.skills),
      course: listToArray(companyData.course),
      perk: listToArray(companyData.perk),
      start_amount: String(companyData.start_amount),
      end_amount: String(companyData.end_amount),
      start_day: toDateInputValue(companyData.start_day),
      start_anual_salary: String(companyData.start_anual_salary),
      end_anual_salary: String(companyData.end_anual_salary),
      number_of_opening: String(companyData.number_of_opening),
      about: companyData.about,
      apply: companyData.apply,
      key_responsibility: companyData.key_responsibility,
      apply_start_date: toDateInputValue(companyData.apply_start_date),
      apply_end_date: toDateInputValue(companyData.apply_end_date),
      active: companyData.active,
      placement_gurantee_course: companyData.placement_gurantee_course,
      is_fast_response: companyData.is_fast_response,
    });
  }, [companyData]);

  if (loading && !companyData) {
    return (
      <div className="max-w-5xl">
        <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="h-6 w-48 rounded-md shimmer" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full shimmer" />
                <div className="h-6 w-36 rounded-full shimmer" />
              </div>
            </div>
            <div className="h-10 w-24 rounded-xl shimmer" />
          </div>
          <div className="my-6 border-t" />
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, col) => (
              <div key={col} className="space-y-4">
                {Array.from({ length: 7 }).map((__, row) => (
                  <div
                    key={row}
                    className="grid gap-3 sm:grid-cols-[160px_1fr] items-center"
                  >
                    <div className="h-6 w-24 rounded-md shimmer" />
                    <div className="h-6 w-32 rounded-md shimmer" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="my-6 border-t" />
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, col) => (
              <div key={col} className="space-y-4">
                {Array.from({ length: 3 }).map((__, row) => (
                  <div key={row} className="grid gap-3 sm:grid-cols-[160px_1fr]">
                    <div className="h-6 w-24 rounded-md shimmer" />
                    <div className="h-6 w-40 rounded-md shimmer" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {companyData?.name || "Company"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {companyData?.active ? "Active" : "Inactive"}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {companyData?.placement_gurantee_course
                  ? "Placement Guarantee"
                  : "No Placement Guarantee"}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
            onClick={() => {
              if (!companyData) return;
              setFormValues({
                name: companyData.name,
                email: companyData.email,
                mobile: companyData.mobile,
                description: companyData.description ?? "",
                location: listToArray(companyData.location),
                category: listToArray(companyData.category),
                job_type: listToArray(companyData.job_type),
                designation: listToArray(companyData.designation),
                skills: listToArray(companyData.skills),
                course: listToArray(companyData.course),
                perk: listToArray(companyData.perk),
                start_amount: String(companyData.start_amount),
                end_amount: String(companyData.end_amount),
                start_day: companyData.start_day,
                start_anual_salary: String(companyData.start_anual_salary),
                end_anual_salary: String(companyData.end_anual_salary),
                number_of_opening: String(companyData.number_of_opening),
                about: companyData.about,
                apply: companyData.apply,
                key_responsibility: companyData.key_responsibility,
                apply_start_date: companyData.apply_start_date,
                apply_end_date: companyData.apply_end_date,
                active: companyData.active,
                placement_gurantee_course:
                  companyData.placement_gurantee_course,
                is_fast_response: companyData.is_fast_response,
              });
              setModalOpen(true);
            }}
            disabled={!hasProfile}
          >
            Update
          </button>
        </div>

        <div className="my-6 border-t" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Contact & Basic Info
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <InfoRow label="Email" value={companyData?.email || "-"} />
              <InfoRow label="Mobile" value={companyData?.mobile || "-"} />
              <InfoRow
                label="Number of Openings"
                value={companyData ? String(companyData.number_of_opening) : "-"}
              />
              <InfoRow
                label="Start Amount"
                value={companyData ? String(companyData.start_amount) : "-"}
              />
              <InfoRow
                label="End Amount"
                value={companyData ? String(companyData.end_amount) : "-"}
              />
              <InfoRow
                label="Start Annual Salary"
                value={companyData ? String(companyData.start_anual_salary) : "-"}
              />
              <InfoRow
                label="End Annual Salary"
                value={companyData ? String(companyData.end_anual_salary) : "-"}
              />
            </div>
            <div className="space-y-4">
              <InfoRow
                label="Location"
                value={companyData ? listToText(companyData.location) : "-"}
              />
              <InfoRow
                label="Category"
                value={companyData ? listToText(companyData.category) : "-"}
              />
              <InfoRow
                label="Job Type"
                value={companyData ? listToText(companyData.job_type) : "-"}
              />
              <InfoRow
                label="Designation"
                value={companyData ? listToText(companyData.designation) : "-"}
              />
              <InfoRow
                label="Skills"
                value={companyData ? listToText(companyData.skills) : "-"}
              />
              <InfoRow
                label="Courses"
                value={companyData ? listToText(companyData.course) : "-"}
              />
              <InfoRow
                label="Perks"
                value={companyData ? listToText(companyData.perk) : "-"}
              />
            </div>
          </div>
        </div>

        <div className="my-6 border-t" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            About & Application
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <InfoRow label="About" value={companyData?.about || "-"} />
              <InfoRow
                label="How to Apply"
                value={companyData?.apply || "-"}
              />
              <InfoRow
                label="Key Responsibility"
                value={companyData?.key_responsibility || "-"}
              />
            </div>
            <div className="space-y-4">
              <InfoRow
                label="Apply Start Date"
                value={companyData?.apply_start_date || "-"}
              />
              <InfoRow
                label="Apply End Date"
                value={companyData?.apply_end_date || "-"}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Update company profile"
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
              onClick={() => {
                if (!companyData) return;
                setCompanyData({
                  ...companyData,
                  name: formValues.name,
                  email: formValues.email,
                  mobile: formValues.mobile,
                  description: formValues.description,
                  location: textToList(formValues.location),
                  category: textToList(formValues.category),
                  job_type: textToList(formValues.job_type),
                  designation: textToList(formValues.designation),
                  skills: textToList(formValues.skills),
                  course: textToList(formValues.course),
                  perk: textToList(formValues.perk),
                  start_amount: Number(formValues.start_amount || 0),
                  end_amount: Number(formValues.end_amount || 0),
                  start_day: formValues.start_day,
                  start_anual_salary: Number(formValues.start_anual_salary || 0),
                  end_anual_salary: Number(formValues.end_anual_salary || 0),
                  number_of_opening: Number(formValues.number_of_opening || 0),
                  about: formValues.about,
                  apply: formValues.apply,
                  key_responsibility: formValues.key_responsibility,
                  apply_start_date: formValues.apply_start_date,
                  apply_end_date: formValues.apply_end_date,
                  active: formValues.active,
                  placement_gurantee_course: formValues.placement_gurantee_course,
                  is_fast_response: formValues.is_fast_response,
                });
                setModalOpen(false);
              }}
            >
              Update
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
                  setFormValues((prev) => ({ ...prev, name: event.target.value }))
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
                  setFormValues((prev) => ({ ...prev, email: event.target.value }))
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
                  setFormValues((prev) => ({ ...prev, mobile: event.target.value }))
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
                min={todayLocalIso}
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
                min={formValues.apply_start_date || todayLocalIso}
                value={formValues.apply_end_date}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    apply_end_date: event.target.value,
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
                setFormValues((prev) => ({ ...prev, about: event.target.value }))
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
                setFormValues((prev) => ({ ...prev, apply: event.target.value }))
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
    </div>
  );
}
