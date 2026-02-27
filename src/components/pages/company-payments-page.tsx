"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import {
  getCourseSubscriptionListPaginated,
  type CourseSubscriptionListItem,
} from "@/services/course-subscription-list.service";

const PER_PAGE = 10;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function CompanyPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<CourseSubscriptionListItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourseSubscriptionListPaginated(
        page,
        PER_PAGE,
        debouncedSearch
      );
      setRows(res.data);
      setCount(res.count);
      setHasNextPage(res.hasNextPage);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load course subscriptions"
      );
      setRows([]);
      setCount(0);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const hasPrev = page > 1;
  const start = (page - 1) * PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE));

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      <DataTableShell
        title="Course subscriptions"
        subtitle="Payments for your course subscriptions."
        searchPlaceholder="Search by name, email, course..."
        searchProps={{
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }}
        table={
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center px-4 py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </div>
              ) : error ? (
                <div className="px-4 py-8 text-center text-sm text-red-600">
                  {error}
                </div>
              ) : (
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-brand text-xs uppercase text-white">
                    <tr className="h-11">
                      <th className="w-16 px-4 py-2.5 text-center">S No</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Mobile</th>
                      <th className="px-4 py-2.5">Course</th>
                      <th className="w-24 px-4 py-2.5 text-right">
                        Fees (₹)
                      </th>
                      <th className="w-24 px-4 py-2.5 text-center">Paid</th>
                      <th className="px-4 py-2.5">Payment order</th>
                      <th className="px-4 py-2.5">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          No course subscriptions found.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, index) => (
                        <tr
                          key={row.id}
                          className="border-t border-border bg-card transition hover:bg-muted/40"
                        >
                          <td className="px-4 py-2.5 text-center text-muted-foreground">
                            {start + index + 1}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {row.full_name ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {row.email ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {row.mobile ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {row.course_name ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                            {typeof row.fees === "number"
                              ? row.fees.toLocaleString("en-IN")
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
                            {row.payment_order_id ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {formatDate(row.created_at)}
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
              Showing {count === 0 ? 0 : start + 1}–{start + rows.length} of{" "}
              {count} subscription
              {count !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="rounded border border-border px-2 py-1.5 transition hover:bg-muted disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

