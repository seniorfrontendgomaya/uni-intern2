"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, Plus, Shield, X } from "lucide-react";
import toast from "react-hot-toast";
import { getAllCourses } from "@/services/course.service";
import { getDropdownCompanies, getDropdownCourses } from "@/services/companies.service";
import {
  getStudentVideoCourseRequests,
  studentSendRequestForVideoCourse,
} from "@/services/student-request-course.service";
import type { StudentVideoCourseRequestItem } from "@/services/student-request-course.service";
import type { ICourse } from "@/types/course";

type TabType = "superadmin" | "company";

type OptionItem = { id: string | number; name: string };

export default function RequestCoursesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [requests, setRequests] = useState<StudentVideoCourseRequestItem[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("company");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCoursesSuperadmin, setSelectedCoursesSuperadmin] = useState<OptionItem[]>([]);
  const [descriptionSuperadmin, setDescriptionSuperadmin] = useState("");
  const [coursesSuperadminQuery, setCoursesSuperadminQuery] = useState("");
  const [coursesSuperadminOptions, setCoursesSuperadminOptions] = useState<OptionItem[]>([]);
  const [coursesSuperadminOpen, setCoursesSuperadminOpen] = useState(false);
  const [coursesSuperadminLoading, setCoursesSuperadminLoading] = useState(false);
  const [submitting, setSubmitting] = useState<TabType | null>(null);
  const coursesSuperadminDropdownRef = useRef<HTMLDivElement>(null);
  const coursesSuperadminFetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Company tab form
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyOptions, setCompanyOptions] = useState<OptionItem[]>([]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<OptionItem | null>(null);
  const [selectedCoursesCompany, setSelectedCoursesCompany] = useState<OptionItem[]>([]);
  const [coursesCompanyQuery, setCoursesCompanyQuery] = useState("");
  const [coursesCompanyOptions, setCoursesCompanyOptions] = useState<OptionItem[]>([]);
  const [coursesCompanyOpen, setCoursesCompanyOpen] = useState(false);
  const [coursesCompanyLoading, setCoursesCompanyLoading] = useState(false);
  const [descriptionCompany, setDescriptionCompany] = useState("");
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);
  const companyFetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coursesFetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const res = await getAllCourses();
      setCourses(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setCourses([]);
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const list = await getStudentVideoCourseRequests();
      setRequests(list);
    } catch (e) {
      setRequestsError(e instanceof Error ? e.message : "Failed to load requests");
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Superadmin courses dropdown: search on query change (debounced, no company param)
  useEffect(() => {
    if (!coursesSuperadminOpen) return;
    if (coursesSuperadminFetchTimeout.current) clearTimeout(coursesSuperadminFetchTimeout.current);
    coursesSuperadminFetchTimeout.current = setTimeout(() => {
      setCoursesSuperadminLoading(true);
      getAllCourses(coursesSuperadminQuery.trim() || undefined)
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : [];
          setCoursesSuperadminOptions(list.map((c) => ({ id: c.id, name: c.name })));
        })
        .catch(() => setCoursesSuperadminOptions([]))
        .finally(() => setCoursesSuperadminLoading(false));
    }, 300);
    return () => {
      if (coursesSuperadminFetchTimeout.current) clearTimeout(coursesSuperadminFetchTimeout.current);
    };
  }, [coursesSuperadminOpen, coursesSuperadminQuery]);

  // Company dropdown: search on query change (debounced)
  useEffect(() => {
    if (!companyOpen) return;
    if (companyFetchTimeout.current) clearTimeout(companyFetchTimeout.current);
    companyFetchTimeout.current = setTimeout(() => {
      setCompanyLoading(true);
      getDropdownCompanies(companyQuery.trim())
        .then((list) => setCompanyOptions(list.map((c) => ({ id: c.id, name: c.name }))))
        .catch(() => setCompanyOptions([]))
        .finally(() => setCompanyLoading(false));
    }, 300);
    return () => {
      if (companyFetchTimeout.current) clearTimeout(companyFetchTimeout.current);
    };
  }, [companyOpen, companyQuery]);

  // When company changes, clear selected courses and options
  useEffect(() => {
    if (!selectedCompany) {
      setSelectedCoursesCompany([]);
      setCoursesCompanyOptions([]);
      setCoursesCompanyQuery("");
    }
  }, [selectedCompany]);

  // Courses (company tab) dropdown: fetch by company id when a company is selected
  useEffect(() => {
    if (!coursesCompanyOpen || !selectedCompany) {
      if (!selectedCompany) setCoursesCompanyOptions([]);
      return;
    }
    setCoursesCompanyLoading(true);
    getDropdownCourses(selectedCompany.id)
      .then((list) => setCoursesCompanyOptions(list.map((c) => ({ id: c.id, name: c.name }))))
      .catch(() => setCoursesCompanyOptions([]))
      .finally(() => setCoursesCompanyLoading(false));
  }, [coursesCompanyOpen, selectedCompany]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) setCompanyOpen(false);
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(e.target as Node)) setCoursesCompanyOpen(false);
      if (coursesSuperadminDropdownRef.current && !coursesSuperadminDropdownRef.current.contains(e.target as Node)) setCoursesSuperadminOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmitSuperadmin = useCallback(async () => {
    if (selectedCoursesSuperadmin.length === 0) {
      toast.error("Please select at least one course");
      return;
    }
    setSubmitting("superadmin");
    try {
      await studentSendRequestForVideoCourse({
        is_superuser: true,
        course_ids: selectedCoursesSuperadmin.map((c) => Number(c.id)),
        description: descriptionSuperadmin.trim(),
      });
      toast.success("Course request submitted to Superadmin.");
      setSelectedCoursesSuperadmin([]);
      setDescriptionSuperadmin("");
      loadRequests();
      setFormOpen(false);
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(null);
    }
  }, [selectedCoursesSuperadmin, descriptionSuperadmin, loadRequests]);

  const handleSubmitCompany = useCallback(async () => {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }
    if (selectedCoursesCompany.length === 0) {
      toast.error("Please select at least one course");
      return;
    }
    setSubmitting("company");
    try {
      await studentSendRequestForVideoCourse({
        is_company: true,
        company: Number(selectedCompany.id),
        course_ids: selectedCoursesCompany.map((c) => Number(c.id)),
        description: descriptionCompany.trim(),
      });
      toast.success("Course request submitted to Company.");
      setSelectedCompany(null);
      setCompanyQuery("");
      setSelectedCoursesCompany([]);
      setCoursesCompanyQuery("");
      setDescriptionCompany("");
      loadRequests();
      setFormOpen(false);
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(null);
    }
  }, [selectedCompany, selectedCoursesCompany, descriptionCompany, loadRequests]);

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Request courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your video course requests or submit a new one.
        </p>
      </div>

      {/* Button + form (when open) + table */}
      <div className="w-full space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
          >
            <Plus className="h-4 w-4 shrink-0" />
            New request
          </button>
        </div>

        {/* Form — only when formOpen */}
        {formOpen && (
          <div className="w-full space-y-6 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Submit a new request</p>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Superadmin | Company tabs — only inside new request container */}
            <div className="grid w-full grid-cols-2 gap-0 rounded-2xl border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("superadmin")}
                className={
                  activeTab === "superadmin"
                    ? "flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white"
                    : "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              >
                <Shield className="h-4 w-4 shrink-0" />
                Superadmin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("company")}
                className={
                  activeTab === "company"
                    ? "flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white"
                    : "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              >
                <Building2 className="h-4 w-4 shrink-0" />
                Company
              </button>
            </div>

            <div className="pt-2">
        {activeTab === "superadmin" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitSuperadmin();
            }}
            className="space-y-5"
          >
            <div ref={coursesSuperadminDropdownRef} className="relative">
              <label className="block text-sm font-medium text-foreground">Courses</label>
              <div className="mt-1.5 space-y-2">
                {selectedCoursesSuperadmin.length > 0 && (
                  <div className="flex flex-wrap gap-2 rounded-lg bg-muted/30 px-3 py-2">
                    {selectedCoursesSuperadmin.map((item) => (
                      <span
                        key={String(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {item.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCoursesSuperadmin((prev) => prev.filter((p) => String(p.id) !== String(item.id)))
                          }
                          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={coursesSuperadminOpen ? coursesSuperadminQuery : ""}
                  onChange={(e) => {
                    setCoursesSuperadminQuery(e.target.value);
                    setCoursesSuperadminOpen(true);
                  }}
                  onFocus={() => setCoursesSuperadminOpen(true)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              {coursesSuperadminOpen && (
                <div className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                  {coursesSuperadminLoading ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                  ) : coursesSuperadminOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No results</div>
                  ) : (
                    coursesSuperadminOptions
                      .filter((opt) => !selectedCoursesSuperadmin.some((s) => String(s.id) === String(opt.id)))
                      .map((opt) => (
                        <button
                          key={String(opt.id)}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                          onClick={() => {
                            setSelectedCoursesSuperadmin((prev) => [...prev, opt]);
                            setCoursesSuperadminQuery("");
                          }}
                        >
                          {opt.name}
                        </button>
                      ))
                  )}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="description-superadmin" className="block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description-superadmin"
                value={descriptionSuperadmin}
                onChange={(e) => setDescriptionSuperadmin(e.target.value)}
                rows={3}
                placeholder="e.g. Please approve my request for this course."
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <button
              type="submit"
              disabled={coursesSuperadminLoading || submitting === "superadmin"}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {submitting === "superadmin" ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}

        {activeTab === "company" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitCompany();
            }}
            className="space-y-5"
          >
            {/* Company search dropdown (single select) */}
            <div ref={companyDropdownRef} className="relative">
              <label className="block text-sm font-medium text-foreground">Company</label>
              <div className="relative mt-1.5 w-full">
                <input
                  type="text"
                  placeholder="Search company..."
                  value={companyOpen ? companyQuery : (selectedCompany?.name ?? companyQuery)}
                  onChange={(e) => {
                    setCompanyQuery(e.target.value);
                    setCompanyOpen(true);
                    if (selectedCompany) setSelectedCompany(null);
                  }}
                  onFocus={() => {
                    setCompanyOpen(true);
                    if (!selectedCompany) setCompanyQuery(companyQuery);
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                {selectedCompany && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCompany(null);
                      setCompanyQuery("");
                      setCompanyOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear company"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {companyOpen && (
                <div className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                  {companyLoading ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                  ) : companyOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No results</div>
                  ) : (
                    companyOptions.map((opt) => (
                      <button
                        key={String(opt.id)}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => {
                          setSelectedCompany(opt);
                          setCompanyQuery("");
                          setCompanyOpen(false);
                        }}
                      >
                        {opt.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Courses multi-select with pills */}
            <div ref={coursesDropdownRef} className="relative">
              <label className="block text-sm font-medium text-foreground">Courses</label>
              <div className="mt-1.5 space-y-2">
                {selectedCoursesCompany.length > 0 && (
                  <div className="flex flex-wrap gap-2 rounded-lg bg-muted/30 px-3 py-2">
                    {selectedCoursesCompany.map((item) => (
                      <span
                        key={String(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {item.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCoursesCompany((prev) => prev.filter((e) => String(e.id) !== String(item.id)))
                          }
                          className="rounded-full p-0.5 text-muted-foreground hover:bg-brand/20 hover:text-foreground"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder={selectedCompany ? "Search and select courses..." : "Select a company first"}
                  value={coursesCompanyQuery}
                  onChange={(e) => {
                    setCoursesCompanyQuery(e.target.value);
                    setCoursesCompanyOpen(true);
                  }}
                  onFocus={() => selectedCompany && setCoursesCompanyOpen(true)}
                  onBlur={() => setTimeout(() => setCoursesCompanyOpen(false), 150)}
                  disabled={!selectedCompany}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {coursesCompanyOpen && selectedCompany && (
                <div className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                  {coursesCompanyLoading ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                  ) : coursesCompanyOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No courses found</div>
                  ) : (
                    coursesCompanyOptions.map((opt) => (
                      <button
                        key={String(opt.id)}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (selectedCoursesCompany.some((c) => String(c.id) === String(opt.id))) return;
                          setSelectedCoursesCompany((prev) => [...prev, opt]);
                          setCoursesCompanyQuery("");
                          setCoursesCompanyOpen(true);
                        }}
                      >
                        {opt.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Description textarea */}
            <div>
              <label htmlFor="description-company" className="block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description-company"
                placeholder="Describe your course request..."
                value={descriptionCompany}
                onChange={(e) => setDescriptionCompany(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <button
              type="submit"
              disabled={submitting === "company"}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {submitting === "company" ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
          </div>
        )}

        {/* Datatable: list of requests */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
          <p className="text-sm font-medium text-foreground">Your requests</p>
        </div>
        <div className="overflow-x-auto">
          {requestsLoading ? (
            <div className="flex items-center justify-center px-4 py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : requestsError ? (
            <div className="px-4 py-8 text-center text-sm text-red-600">{requestsError}</div>
          ) : (
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-brand text-xs uppercase text-white">
                <tr className="h-11">
                  <th className="w-20 px-4 py-2.5 text-center">S No</th>
                  <th className="px-4 py-2.5">Requested to</th>
                  <th className="px-4 py-2.5">Course(s)</th>
                  <th className="max-w-[200px] px-4 py-2.5">Description</th>
                  <th className="w-24 px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No requests yet. Click &quot;New request&quot; to submit one.
                    </td>
                  </tr>
                ) : (
                  requests.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-t border-border bg-card transition hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{index + 1}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.admin_name != null && row.admin_name !== ""
                          ? "Uniintern"
                          : `${row.company_name ?? "—"}`}
                      </td>
                      <td
                        className="max-w-[200px] truncate px-4 py-2.5 text-muted-foreground"
                        title={
                          Array.isArray(row.course) && row.course.length > 0
                            ? row.course.map((c) => c.name).join(", ")
                            : undefined
                        }
                      >
                        {Array.isArray(row.course) && row.course.length > 0 ? (
                          <>
                            {row.course.slice(0, 2).map((c) => c.name).join(", ")}
                            {row.course.length > 2 ? ` +${row.course.length - 2} more` : ""}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-2.5 text-muted-foreground" title={row.description}>
                        {row.description || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {(() => {
                          const raw = row.is_active;
                          const status =
                            typeof raw === "string"
                              ? raw.trim().toLowerCase()
                              : raw === true
                                ? "approved"
                                : "draft";
                          const label = status === "draft" ? "Pending" : status === "approved" ? "Approved" : "Rejected";
                          const style =
                            status === "approved"
                              ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                              : status === "rejected"
                                ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                                : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700";
                          return <span className={style}>{label}</span>;
                        })()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
