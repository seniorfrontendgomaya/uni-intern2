"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
  list.length > 0 ? list.map((item) => item.name).join(", ") : "—";

const listToArray = (list: CompanyReference[]) =>
  list.map((item) => item.name).filter(Boolean);

const textToList = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name, index) => ({ id: index + 1, name, description: "" }));

const getCompanyInitial = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "C";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return trimmed[0].toUpperCase();
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
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {companyData.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      companyData?.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {companyData?.active ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {companyData?.active ? "Active" : "Inactive"}
                  </span>
                  {companyData?.placement_gurantee_course && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      <Award className="h-3 w-3" />
                      Placement Guarantee
                    </span>
                  )}
                  {companyData?.is_fast_response && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      <Briefcase className="h-3 w-3" />
                      Fast Response
                    </span>
                  )}
                </div>
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
              {companyData?.location?.length ? (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {listToText(companyData.location)}
                    </p>
                  </div>
                </div>
              ) : null}
              {companyData?.number_of_opening ? (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Openings
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {companyData.number_of_opening} positions
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Financial Information */}
          {(companyData?.start_amount ||
            companyData?.end_amount ||
            companyData?.start_anual_salary ||
            companyData?.end_anual_salary) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <DollarSign className="h-5 w-5 text-brand" />
                Financial Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {companyData.start_amount && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Start Amount
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyData.start_amount)}
                    </p>
                  </div>
                )}
                {companyData.end_amount && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      End Amount
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyData.end_amount)}
                    </p>
                  </div>
                )}
                {companyData.start_anual_salary && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Start Annual Salary
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyData.start_anual_salary)}
                    </p>
                  </div>
                )}
                {companyData.end_anual_salary && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      End Annual Salary
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatCurrency(companyData.end_anual_salary)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills, Courses, Perks */}
          {(companyData?.skills?.length ||
            companyData?.course?.length ||
            companyData?.perk?.length ||
            companyData?.designation?.length ||
            companyData?.job_type?.length ||
            companyData?.category?.length) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Briefcase className="h-5 w-5 text-brand" />
                Requirements & Benefits
              </h3>
              <div className="space-y-4">
                {companyData.skills?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.skills.map((skill) => (
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
                {companyData.designation?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Designations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.designation.map((des) => (
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
                {companyData.job_type?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Job Types
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.job_type.map((jt) => (
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
                {companyData.course?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Courses
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.course.map((crs) => (
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
                {companyData.perk?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Perks
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.perk.map((p) => (
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
                {companyData.category?.length ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.category.map((cat) => (
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
          {(companyData?.about ||
            companyData?.apply ||
            companyData?.key_responsibility ||
            companyData?.apply_start_date ||
            companyData?.apply_end_date) && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5 text-brand" />
                About & Application
              </h3>
              <div className="space-y-4">
                {companyData.about && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      About
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyData.about}
                    </p>
                  </div>
                )}
                {companyData.key_responsibility && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Key Responsibilities
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyData.key_responsibility}
                    </p>
                  </div>
                )}
                {companyData.apply && (
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      How to Apply
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {companyData.apply}
                    </p>
                  </div>
                )}
                {(companyData.apply_start_date ||
                  companyData.apply_end_date) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {companyData.apply_start_date && (
                      <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Apply Start Date
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {companyData.apply_start_date}
                          </p>
                        </div>
                      </div>
                    )}
                    {companyData.apply_end_date && (
                      <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Apply End Date
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {companyData.apply_end_date}
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
