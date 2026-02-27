"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import toast from "react-hot-toast";
import {
  getStudentSubscriptionsPaginated,
  cancelStudentInternshipSubscription,
  type StudentSubscriptionListItem,
} from "@/services/student-subscription-list.service";
import {
  getStudentCourseSubscriptionsPaginated,
  cancelStudentCourseSubscription,
  type StudentCourseSubscriptionItem,
} from "@/services/student-course-subscription.service";

const PER_PAGE = 10;

type OrdersTab = "internships" | "courses";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "short",
        });
  } catch {
    return iso;
  }
}

export function StudentOrdersPage() {
  const [otherUser, setOtherUser] = useState<boolean | null>(null);

  // Internship subscriptions state
  const [internshipTab, setInternshipTab] = useState<OrdersTab>("internships");
  const [internSearch, setInternSearch] = useState("");
  const [internDebouncedSearch, setInternDebouncedSearch] = useState("");
  const [internPage, setInternPage] = useState(1);
  const [internRows, setInternRows] = useState<StudentSubscriptionListItem[]>([]);
  const [internCount, setInternCount] = useState(0);
  const [internHasNext, setInternHasNext] = useState(false);
  const [internLoading, setInternLoading] = useState(false);
  const [internError, setInternError] = useState<string | null>(null);

  // Course subscriptions state
  const [courseSearch, setCourseSearch] = useState("");
  const [courseDebouncedSearch, setCourseDebouncedSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);
  const [courseRows, setCourseRows] = useState<StudentCourseSubscriptionItem[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [courseHasNext, setCourseHasNext] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<StudentCourseSubscriptionItem | null>(null);
  const [internCancelDialogOpen, setInternCancelDialogOpen] = useState(false);
  const [internCancelTarget, setInternCancelTarget] = useState<StudentSubscriptionListItem | null>(null);

  // Detect other_user flag from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("other_user");
    if (!raw) {
      setOtherUser(false);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setOtherUser(Boolean(parsed));
    } catch {
      setOtherUser(false);
    }
  }, []);

  // Debounce internship search
  useEffect(() => {
    const t = setTimeout(() => {
      setInternDebouncedSearch(internSearch);
      setInternPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [internSearch]);

  // Debounce course search
  useEffect(() => {
    const t = setTimeout(() => {
      setCourseDebouncedSearch(courseSearch);
      setCoursePage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [courseSearch]);

  const loadInternships = useCallback(async () => {
    setInternLoading(true);
    setInternError(null);
    try {
      const res = await getStudentSubscriptionsPaginated(
        internPage,
        PER_PAGE,
        internDebouncedSearch
      );
      setInternRows(res.data);
      setInternCount(res.count);
      setInternHasNext(res.hasNextPage);
    } catch (e) {
      setInternError(
        e instanceof Error ? e.message : "Failed to load internship subscriptions"
      );
      setInternRows([]);
      setInternCount(0);
      setInternHasNext(false);
    } finally {
      setInternLoading(false);
    }
  }, [internPage, internDebouncedSearch]);

  const loadCourses = useCallback(async () => {
    setCourseLoading(true);
    setCourseError(null);
    try {
      const res = await getStudentCourseSubscriptionsPaginated(
        coursePage,
        PER_PAGE,
        courseDebouncedSearch
      );
      setCourseRows(res.data);
      setCourseCount(res.count);
      setCourseHasNext(res.hasNextPage);
    } catch (e) {
      setCourseError(
        e instanceof Error ? e.message : "Failed to load course subscriptions"
      );
      setCourseRows([]);
      setCourseCount(0);
      setCourseHasNext(false);
    } finally {
      setCourseLoading(false);
    }
  }, [coursePage, courseDebouncedSearch]);

  // Load based on flags
  useEffect(() => {
    if (otherUser === null) return;
    if (!otherUser) {
      // Only courses table
      loadCourses();
      return;
    }
    // other_user true: tabbed layout
    if (internshipTab === "internships") {
      loadInternships();
    } else {
      loadCourses();
    }
  }, [otherUser, internshipTab, loadInternships, loadCourses]);

  const internHasPrev = internPage > 1;
  const internStart = (internPage - 1) * PER_PAGE;
  const internTotalPages = Math.max(1, Math.ceil(internCount / PER_PAGE));

  const courseHasPrev = coursePage > 1;
  const courseStart = (coursePage - 1) * PER_PAGE;
  const courseTotalPages = Math.max(1, Math.ceil(courseCount / PER_PAGE));

  if (otherUser === null) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-muted-foreground">
        Loading your orders...
      </div>
    );
  }

  // Helper to render the course subscriptions table (shared between layouts)
  const courseTableShell = (
    <DataTableShell
      title="Course subscriptions"
      subtitle="Your course payment history."
      searchPlaceholder="Search by course or admin name..."
      searchProps={{
        value: courseSearch,
        onChange: (e) => setCourseSearch(e.target.value),
      }}
      table={
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            {courseLoading ? (
              <div className="flex justify-center px-4 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              </div>
            ) : courseError ? (
              <div className="px-4 py-8 text-center text-sm text-red-600">
                {courseError}
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
                <thead className="bg-brand text-xs uppercase text-white">
                  <tr className="h-11">
                    <th className="w-16 px-4 py-2.5 text-center">S No</th>
                    <th className="px-4 py-2.5">Course</th>
                    <th className="w-28 px-4 py-2.5 text-right">Course fees (₹)</th>
                    <th className="px-4 py-2.5">Admin name</th>
                    <th className="w-24 px-4 py-2.5 text-center">Paid</th>
                    <th className="px-4 py-2.5">Payment order</th>
                    <th className="px-4 py-2.5">Time</th>
                    <th className="w-28 px-4 py-2.5 text-center">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {courseRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
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
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {row.course_name ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                          {typeof row.course_fees === "number"
                            ? row.course_fees.toLocaleString("en-IN")
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {row.admin_name ?? "—"}
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
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {row.is_subscription_cancelled ? (
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                              Cancelled
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center rounded-full border border-red-700 bg-red-700 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-red-800 disabled:opacity-50"
                              disabled={!row.is_paid}
                              onClick={() => {
                                if (!row.is_paid) return;
                                setCancelTarget(row);
                                setCancelDialogOpen(true);
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
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
              disabled={!courseHasNext}
              className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      }
    />
  );

  const mainContent = !otherUser ? (
    <div className="w-full space-y-6 px-4 sm:px-0">{courseTableShell}</div>
  ) : (
    <div className="w-full space-y-6 px-4 sm:px-0">
      <div>
        <h2 className="text-lg font-semibold text-foreground">My orders</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          View your internship and course subscriptions.
        </p>
      </div>

      <div className="inline-flex w-fit gap-0 rounded-2xl border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setInternshipTab("internships")}
          className={
            internshipTab === "internships"
              ? "rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Internship subscriptions
        </button>
        <button
          type="button"
          onClick={() => setInternshipTab("courses")}
          className={
            internshipTab === "courses"
              ? "rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white"
              : "rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          Course subscriptions
        </button>
      </div>

      {internshipTab === "internships" && (
        <DataTableShell
          title="Internship subscriptions"
          subtitle="Your internship plan subscription history."
          searchPlaceholder="Search by order id or plan..."
          searchProps={{
            value: internSearch,
            onChange: (e) => setInternSearch(e.target.value),
          }}
          table={
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                {internLoading ? (
                  <div className="flex justify-center px-4 py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  </div>
                ) : internError ? (
                  <div className="px-4 py-8 text-center text-sm text-red-600">
                    {internError}
                  </div>
                ) : (
                    <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
                    <thead className="bg-brand text-xs uppercase text-white">
                      <tr className="h-11">
                        <th className="w-20 px-4 py-2.5 text-center">S No</th>
                          <th className="px-4 py-2.5">Order id</th>
                          <th className="px-4 py-2.5">Plan type</th>
                          <th className="px-4 py-2.5">Plan name</th>
                          <th className="w-24 px-4 py-2.5 text-right">Price (₹)</th>
                          <th className="w-20 px-4 py-2.5 text-center">Paid</th>
                          <th className="px-4 py-2.5">Time</th>
                          <th className="w-28 px-4 py-2.5 text-center">Subscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internRows.length === 0 ? (
                        <tr>
                          <td
                              colSpan={8}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No internship subscriptions found.
                          </td>
                        </tr>
                      ) : (
                        internRows.map((row, index) => (
                          <tr
                            key={row.id}
                            className="border-t border-border bg-card transition hover:bg-muted/40"
                          >
                            <td className="px-4 py-2.5 text-center text-muted-foreground">
                              {internStart + index + 1}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {row.payment_order_id ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {row.subcription_plan_type ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 font-medium text-foreground">
                              {row.subscription_plan_name ?? "—"}
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
                            <td className="px-4 py-2.5 text-center">
                              {row.is_subscription_cancelled ? (
                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                                  Cancelled
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center rounded-full border border-red-700 bg-red-700 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-red-800 disabled:opacity-50"
                                  disabled={!row.is_paid}
                                  onClick={() => {
                                    if (!row.is_paid) return;
                                    setInternCancelTarget(row);
                                    setInternCancelDialogOpen(true);
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
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
                Showing {internCount === 0 ? 0 : internStart + 1}–
                {internStart + internRows.length} of {internCount} subscription
                {internCount !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInternPage((p) => Math.max(1, p - 1))}
                  disabled={!internHasPrev}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {internPage} of {internTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setInternPage((p) => p + 1)}
                  disabled={!internHasNext}
                  className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          }
        />
      )}

      {internshipTab === "courses" && courseTableShell}
    </div>
  );

  return (
    <>
      {mainContent}
      <ConfirmDialog
        open={internCancelDialogOpen}
        title="Cancel internship subscription?"
        description="Your current internship subscription is active. If you confirm, the subscription will be cancelled permanently."
        confirmText="Yes, cancel internship"
        cancelText="Keep subscription"
        onConfirm={async () => {
          if (!internCancelTarget) return;
          try {
            const res = await cancelStudentInternshipSubscription(internCancelTarget.id);
            toast.success(res.message || "Internship subscription cancelled successfully");
            await loadInternships();
          } catch (error) {
            const e = error as { message?: string };
            toast.error(e?.message || "Failed to cancel internship subscription");
          } finally {
            setInternCancelDialogOpen(false);
            setInternCancelTarget(null);
          }
        }}
        onCancel={() => {
          setInternCancelDialogOpen(false);
          setInternCancelTarget(null);
        }}
      />
      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel subscription?"
        description="Your current subscription is active. If you confirm, the subscription will be cancelled permanently."
        confirmText="Yes, cancel subscription"
        cancelText="Keep subscription"
        onConfirm={async () => {
          if (!cancelTarget) return;
          try {
            const res = await cancelStudentCourseSubscription(cancelTarget.course_request);
            toast.success(res.message || "Subscription cancelled successfully");
            await loadCourses();
          } catch (error) {
            const e = error as { message?: string };
            toast.error(e?.message || "Failed to cancel subscription");
          } finally {
            setCancelDialogOpen(false);
            setCancelTarget(null);
          }
        }}
        onCancel={() => {
          setCancelDialogOpen(false);
          setCancelTarget(null);
        }}
      />
    </>
  );
}

