"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Modal } from "@/components/ui/modal";
import {
  getCourseLeadRequestsPaginated,
  patchCourseLeadRequest,
} from "@/services/course-lead.service";
import type { CourseLeadItem } from "@/services/course-lead.service";

const PER_PAGE = 10;

function statusLabel(row: CourseLeadItem) {
  const raw = row.is_active;
  const status =
    typeof raw === "string"
      ? raw.trim().toLowerCase()
      : raw === true
        ? "approved"
        : "draft";
  return status === "draft" ? "Pending" : status === "approved" ? "Approved" : "Rejected";
}

function statusStyle(row: CourseLeadItem) {
  const raw = row.is_active;
  const status =
    typeof raw === "string"
      ? raw.trim().toLowerCase()
      : raw === true
        ? "approved"
        : "draft";
  return status === "approved"
    ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
    : status === "rejected"
      ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
      : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700";
}

function isPending(row: CourseLeadItem) {
  const raw = row.is_active;
  const status =
    typeof raw === "string"
      ? raw.trim().toLowerCase()
      : raw === true
        ? "approved"
        : "draft";
  return status === "draft";
}

export function CourseLeadPage({
  canApprove = false,
  responseKey = "admin_response",
}: {
  canApprove?: boolean;
  /** Payload key for PATCH: "admin_response" (superadmin) or "company_response" (company). */
  responseKey?: "admin_response" | "company_response";
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<CourseLeadItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalRequest, setModalRequest] = useState<CourseLeadItem | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState<"Approved" | "Rejected" | null>(null);

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
      const res = await getCourseLeadRequestsPaginated(page, PER_PAGE, debouncedSearch);
      setRequests(res.data);
      setCount(res.count);
      setHasNextPage(res.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load course lead requests");
      setRequests([]);
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

  const openModal = useCallback(
    (row: CourseLeadItem) => {
      setModalRequest(row);
      const existing =
        responseKey === "company_response" ? row.company_response : row.admin_response;
      setResponseText(existing ?? "");
    },
    [responseKey]
  );

  const closeModal = useCallback(() => {
    setModalRequest(null);
    setResponseText("");
    setSubmitting(null);
  }, []);

  const handleApproveReject = useCallback(
    async (is_active: "Approved" | "Rejected") => {
      if (!modalRequest) return;
      setSubmitting(is_active);
      try {
        await patchCourseLeadRequest(modalRequest.id, {
          is_active,
          [responseKey]: responseText.trim(),
        } as { is_active: "Approved" | "Rejected"; admin_response: string } | { is_active: "Approved" | "Rejected"; company_response: string });
        toast.success(`Request ${is_active.toLowerCase()} successfully.`);
        closeModal();
        load();
      } catch {
        toast.error(`Failed to ${is_active.toLowerCase()} request.`);
      } finally {
        setSubmitting(null);
      }
    },
    [modalRequest, responseText, responseKey, closeModal, load]
  );

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      <DataTableShell
        title="Course Lead"
        subtitle="Video course requests from students."
        searchPlaceholder="Search course lead..."
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
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-brand text-xs uppercase text-white">
                    <tr className="h-11">
                      <th className="w-16 px-4 py-2.5 text-center">S No</th>
                      <th className="px-4 py-2.5">Student</th>
                      <th className="px-4 py-2.5">Course(s)</th>
                      <th className="max-w-[180px] px-4 py-2.5">Description</th>
                      <th className="max-w-[180px] px-4 py-2.5">
                        {responseKey === "company_response" ? "Company response" : "Admin response"}
                      </th>
                      <th className="w-24 px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                          No course lead requests yet.
                        </td>
                      </tr>
                    ) : (
                      requests.map((row, index) => (
                        <tr
                          key={row.id}
                          className="border-t border-border bg-card transition hover:bg-muted/40"
                        >
                          <td className="px-4 py-2.5 text-center text-muted-foreground">{start + index + 1}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{row.student_name ?? "—"}</td>
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
                      <td className="max-w-[180px] truncate px-4 py-2.5 text-muted-foreground" title={row.description ?? ""}>
                        {row.description || "—"}
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-2.5 text-muted-foreground" title={responseKey === "company_response" ? (row.company_response ?? "") : (row.admin_response ?? "")}>
                        {responseKey === "company_response" ? (row.company_response || "—") : (row.admin_response || "—")}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={statusStyle(row)}>{statusLabel(row)}</span>
                          {canApprove && isPending(row) && (
                            <button
                              type="button"
                              onClick={() => openModal(row)}
                              className="rounded-lg border border-brand bg-brand/10 px-2 py-1 text-xs font-medium text-brand hover:bg-brand/20"
                            >
                              Review
                            </button>
                          )}
                        </div>
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
        }
        pagination={
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Showing {count === 0 ? 0 : start + 1}–{start + requests.length} of {count} request
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

      {/* Approve/Reject modal */}
      <Modal
        open={Boolean(modalRequest)}
        title="Review request"
        onClose={closeModal}
        footer={
          modalRequest ? (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={!!submitting}
                onClick={() => handleApproveReject("Rejected")}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                {submitting === "Rejected" ? "Sending…" : "Reject"}
              </button>
              <button
                type="button"
                disabled={!!submitting}
                onClick={() => handleApproveReject("Approved")}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
              >
                {submitting === "Approved" ? "Sending…" : "Approve"}
              </button>
            </div>
          ) : undefined
        }
      >
        {modalRequest && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Requested by</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{modalRequest.student_name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Courses</p>
              <p className="mt-0.5 text-sm text-foreground">
                {Array.isArray(modalRequest.course) && modalRequest.course.length > 0
                  ? modalRequest.course.map((c) => c.name).join(", ")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Description</p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">
                {modalRequest.description || "—"}
              </p>
            </div>
            <div>
              <label htmlFor="course-lead-admin-response" className="block text-xs font-medium uppercase text-muted-foreground">
                Your response
              </label>
              <textarea
                id="course-lead-admin-response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
                placeholder="Add your response to the student..."
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
