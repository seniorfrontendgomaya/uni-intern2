"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { getPaidStudentsPaginated } from "@/services/paid-students.service";
import type { PaidStudentItem } from "@/services/paid-students.service";

const PER_PAGE = 10;

export function PaidStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<PaidStudentItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search: update debouncedSearch 300ms after user stops typing
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
      const res = await getPaidStudentsPaginated(page, PER_PAGE, debouncedSearch);
      setStudents(res.data);
      setCount(res.count);
      setHasNextPage(res.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load paid students");
      setStudents([]);
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
        title="Paid students"
        subtitle="List of paid students with credit usage."
        searchPlaceholder="Search paid students..."
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
                <div className="px-4 py-8 text-center text-sm text-red-600">{error}</div>
              ) : (
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-brand text-xs uppercase text-white">
                    <tr className="h-11">
                      <th className="w-16 px-4 py-2.5 text-center">S No</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Mobile</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="w-24 px-4 py-2.5 text-center">Total credit</th>
                      <th className="w-24 px-4 py-2.5 text-center">Used credit</th>
                      <th className="w-24 px-4 py-2.5 text-center">Expired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No paid students yet.
                        </td>
                      </tr>
                    ) : (
                      students.map((row, index) => (
                        <tr
                          key={row.id}
                          className="border-t border-border bg-card transition hover:bg-muted/40"
                        >
                          <td className="px-4 py-2.5 text-center text-muted-foreground">
                            {start + index + 1}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-foreground">{row.name ?? "—"}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{row.mobile ?? "—"}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{row.email ?? "—"}</td>
                          <td className="px-4 py-2.5 text-center text-muted-foreground">
                            {typeof row.total_credit === "number" ? row.total_credit : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-center text-muted-foreground">
                            {typeof row.used_credit === "number" ? row.used_credit : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span
                              className={
                                row.expired
                                  ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                                  : "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                              }
                            >
                              {row.expired ? "Yes" : "No"}
                            </span>
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
              Showing {count === 0 ? 0 : start + 1}–{start + students.length} of {count} student
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
