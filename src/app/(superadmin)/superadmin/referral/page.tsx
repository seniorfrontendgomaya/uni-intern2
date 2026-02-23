"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { getReferrals, updateReferralActive } from "@/services/referral.service";
import type { ReferralItem } from "@/types/referral";

const PER_PAGE = 10;

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-brand" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function ReferralPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ReferralItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = useCallback(async (row: ReferralItem, is_active: boolean) => {
    const studentId = row.student_id;
    if (studentId == null) return;
    setTogglingId(studentId);
    try {
      const res = await updateReferralActive(studentId, is_active);
      const updated = res?.data;
      if (updated != null) {
        setRows((prev) =>
          prev.map((r) => {
            if (r.student_id !== studentId) return r;
            return {
              ...r,
              ...updated,
              is_active: updated.is_active ?? is_active,
              student_id: studentId,
            };
          })
        );
      }
    } catch {
      // keep current state on error
    } finally {
      setTogglingId(null);
    }
  }, []);

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
      const res = await getReferrals(page, PER_PAGE, debouncedSearch);
      const data = res?.data ?? [];
      setRows(Array.isArray(data) ? data : []);
      setCount(Number(res?.count) ?? 0);
      setHasNextPage(Boolean(res?.hasNextPage));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load referrals");
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

  return (
    <DataTableShell
      title="Referral"
      searchPlaceholder="Search user..."
      searchProps={{
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
      }}
      table={
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-brand text-xs uppercase text-white">
              <tr className="h-12">
                <th className="w-16 px-4 py-2 text-center">S NO</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Referral Code</th>
                <th className="px-4 py-2 text-right">Count</th>
                <th className="px-4 py-2 text-right">Total Earning</th>
                <th className="w-24 px-4 py-2 text-center">Active</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border bg-card">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No referrals found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-t border-border bg-card transition hover:bg-muted/40"
                  >
                    <td className="px-4 py-2 text-center">
                      {start + index + 1}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {[row.first_name, row.last_name].filter(Boolean).join(" ") || "-"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.mobile ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.email ?? "-"}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {row.referral_code ?? row.refferal_code ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {row.student_code_count ?? 0}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      -
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={row.is_active ?? true}
                          onChange={(checked) => handleToggle(row, checked)}
                          disabled={row.student_id == null || row.student_id === togglingId}
                        />
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
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {start + 1}–{start + rows.length} of {count} referral
            {count !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      }
    />
  );
}
