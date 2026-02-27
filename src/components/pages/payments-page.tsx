"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import {
  getCourseSubscriptionListPaginated,
  type CourseSubscriptionListItem,
} from "@/services/course-subscription-list.service";
import {
  getUnregisteredSubscriptionListPaginated,
  type UnregisteredSubscriptionListItem,
} from "@/services/unregistered-subscription-list.service";

const PER_PAGE = 10;

type TabId = "unregistered" | "courses";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("unregistered");

  // Unregistered users state
  const [unregSearchTerm, setUnregSearchTerm] = useState("");
  const [unregDebouncedSearch, setUnregDebouncedSearch] = useState("");
  const [unregPage, setUnregPage] = useState(1);
  const [unregRows, setUnregRows] = useState<UnregisteredSubscriptionListItem[]>([]);
  const [unregCount, setUnregCount] = useState(0);
  const [unregHasNextPage, setUnregHasNextPage] = useState(false);
  const [unregLoading, setUnregLoading] = useState(false);
  const [unregError, setUnregError] = useState<string | null>(null);

  // Course subscriptions state
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [courseDebouncedSearch, setCourseDebouncedSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);
  const [courseRows, setCourseRows] = useState<CourseSubscriptionListItem[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [courseHasNextPage, setCourseHasNextPage] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Debounce search for unregistered users
  useEffect(() => {
    const t = setTimeout(() => {
      setUnregDebouncedSearch(unregSearchTerm);
      setUnregPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [unregSearchTerm]);

  // Debounce search for courses
  useEffect(() => {
    const t = setTimeout(() => {
      setCourseDebouncedSearch(courseSearchTerm);
      setCoursePage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [courseSearchTerm]);

  const loadUnregistered = useCallback(async () => {
    setUnregLoading(true);
    setUnregError(null);
    try {
      const res = await getUnregisteredSubscriptionListPaginated(
        unregPage,
        PER_PAGE,
        unregDebouncedSearch
      );
      setUnregRows(res.data);
      setUnregCount(res.count);
      setUnregHasNextPage(res.hasNextPage);
    } catch (e) {
      setUnregError(
        e instanceof Error ? e.message : "Failed to load unregistered users"
      );
      setUnregRows([]);
      setUnregCount(0);
      setUnregHasNextPage(false);
    } finally {
      setUnregLoading(false);
    }
  }, [unregPage, unregDebouncedSearch]);

  const loadCourses = useCallback(async () => {
    setCourseLoading(true);
    setCourseError(null);
    try {
      const res = await getCourseSubscriptionListPaginated(
        coursePage,
        PER_PAGE,
        courseDebouncedSearch
      );
      setCourseRows(res.data);
      setCourseCount(res.count);
      setCourseHasNextPage(res.hasNextPage);
    } catch (e) {
      setCourseError(
        e instanceof Error ? e.message : "Failed to load course subscriptions"
      );
      setCourseRows([]);
      setCourseCount(0);
      setCourseHasNextPage(false);
    } finally {
      setCourseLoading(false);
    }
  }, [coursePage, courseDebouncedSearch]);

  useEffect(() => {
    if (activeTab === "unregistered") loadUnregistered();
  }, [activeTab, loadUnregistered]);

  useEffect(() => {
    if (activeTab === "courses") loadCourses();
  }, [activeTab, loadCourses]);

  const unregHasPrev = unregPage > 1;
  const unregStart = (unregPage - 1) * PER_PAGE;
  const unregTotalPages = Math.max(1, Math.ceil(unregCount / PER_PAGE));

  const courseHasPrev = coursePage > 1;
  const courseStart = (coursePage - 1) * PER_PAGE;
  const courseTotalPages = Math.max(1, Math.ceil(courseCount / PER_PAGE));

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Payments</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Unregistered users and course subscription payments.
        </p>
      </div>

      <div className="inline-flex w-fit gap-0 rounded-2xl border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("unregistered")}
          className={
            activeTab === "unregistered"
              ? "rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Unregistered Users
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={
            activeTab === "courses"
              ? "rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Courses
        </button>
      </div>

      {activeTab === "unregistered" && (
        <DataTableShell
          title="Unregistered users"
          subtitle="Subscriptions created without registered student accounts."
          searchPlaceholder="Search by user or plan..."
          searchProps={{
            value: unregSearchTerm,
            onChange: (e) => setUnregSearchTerm(e.target.value),
          }}
          table={
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                {unregLoading ? (
                  <div className="flex justify-center px-4 py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  </div>
                ) : unregError ? (
                  <div className="px-4 py-8 text-center text-sm text-red-600">
                    {unregError}
                  </div>
                ) : (
                  <table className="w-full min-w-[1100px] text-left text-sm">
                    <thead className="bg-brand text-xs uppercase text-white">
                      <tr className="h-11">
                        <th className="w-20 px-4 py-2.5 text-center">S No</th>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Email</th>
                        <th className="px-4 py-2.5">Mobile</th>
                        <th className="px-4 py-2.5">Order id</th>
                        <th className="px-4 py-2.5">Plan type</th>
                        <th className="px-4 py-2.5">Plan name</th>
                        <th className="w-24 px-4 py-2.5 text-right">Price (₹)</th>
                        <th className="w-20 px-4 py-2.5 text-center">Paid</th>
                        <th className="px-4 py-2.5">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unregRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={10}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No unregistered subscriptions found.
                          </td>
                        </tr>
                      ) : (
                        unregRows.map((row, index) => {
                          const name = row.subscription_plan_name ?? "—";
                          const truncatedName =
                            name && name.length > 40 ? `${name.slice(0, 40)}…` : name;
                          return (
                            <tr
                              key={row.id}
                              className="border-t border-border bg-card transition hover:bg-muted/40"
                            >
                              <td className="px-4 py-2.5 text-center text-muted-foreground">
                                {unregStart + index + 1}
                              </td>
                              <td className="px-4 py-2.5 font-medium text-foreground">
                                {row.user_name ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.user_email ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.user_mobile ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.payment_order_id ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.subcription_plan_type ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 font-medium text-foreground max-w-[280px] truncate">
                                {truncatedName}
                              </td>
                              <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                                {typeof row.subscription_plan_price === "number"
                                  ? row.subscription_plan_price.toLocaleString("en-IN")
                                  : "—"}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span
                                  className={
                                    row.is_paid
                                      ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                      : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                                  }
                                >
                                  {row.is_paid ? "Yes" : "No"}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {formatDate(row.created_at)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          }
          pagination={
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Showing {unregCount === 0 ? 0 : unregStart + 1}–
                {unregStart + unregRows.length} of {unregCount} record
                {unregCount !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUnregPage((p) => Math.max(1, p - 1))}
                  disabled={!unregHasPrev}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {unregPage} of {unregTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setUnregPage((p) => p + 1)}
                  disabled={!unregHasNextPage}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          }
        />
      )}

      {activeTab === "courses" && (
        <DataTableShell
          title="Course subscriptions"
          subtitle="List of course subscriptions (admin)."
          searchPlaceholder="Search by name, email, course..."
          searchProps={{
            value: courseSearchTerm,
            onChange: (e) => setCourseSearchTerm(e.target.value),
          }}
          table={
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                {courseLoading ? (
                  <div className="flex justify-center px-4 py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  </div>
                ) : courseError ? (
                  <div className="px-4 py-8 text-center text-sm text-red-600">{courseError}</div>
                ) : (
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-brand text-xs uppercase text-white">
                      <tr className="h-11">
                        <th className="w-16 px-4 py-2.5 text-center">S No</th>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Email</th>
                        <th className="px-4 py-2.5">Mobile</th>
                        <th className="px-4 py-2.5">Course</th>
                        <th className="w-24 px-4 py-2.5 text-right">Fees (₹)</th>
                        <th className="w-24 px-4 py-2.5 text-center">Paid</th>
                        <th className="px-4 py-2.5">Payment order</th>
                        <th className="px-4 py-2.5">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseRows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            No course subscriptions found.
                          </td>
                        </tr>
                      ) : (
                        courseRows.map((row, index) => (
                          <tr
                            key={row.id}
                            className="border-t border-border bg-card transition hover:bg-muted/40"
                          >
                            <td className="px-4 py-2.5 text-center text-muted-foreground">
                              {courseStart + index + 1}
                            </td>
                            <td className="px-4 py-2.5 font-medium text-foreground">{row.full_name ?? "—"}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{row.email ?? "—"}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{row.mobile ?? "—"}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{row.course_name ?? "—"}</td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                              {typeof row.fees === "number" ? row.fees.toLocaleString("en-IN") : "—"}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span
                                className={
                                  row.is_paid
                                    ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                    : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                                }
                              >
                                {row.is_paid ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {row.payment_order_id ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">{formatDate(row.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          }
          pagination={
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Showing {courseCount === 0 ? 0 : courseStart + 1}–
                {courseStart + courseRows.length} of {courseCount} subscription
                {courseCount !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoursePage((p) => Math.max(1, p - 1))}
                  disabled={!courseHasPrev}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {coursePage} of {courseTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCoursePage((p) => p + 1)}
                  disabled={!courseHasNextPage}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
