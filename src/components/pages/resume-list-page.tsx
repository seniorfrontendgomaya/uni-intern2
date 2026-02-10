"use client";

import { useResumeListPaginated } from "@/hooks/useResume";
import { Download, Eye, Mail, Phone, UserRound } from "lucide-react";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export function ResumeListPage() {
  const {
    items,
    count,
    loading,
    page,
    setPage,
    perPage,
    hasNext,
    hasPrev,
  } = useResumeListPaginated(10);

  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const visiblePages =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : (() => {
          const start = Math.max(1, Math.min(page - 1, totalPages - 2));
          return [start, start + 1, start + 2];
        })();

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role") ?? ""
      : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Resume List</h2>
          <p className="text-sm text-muted-foreground">{count} resumes found</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground">
          Total: {count}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-brand" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full shimmer" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded-md shimmer" />
                    <div className="h-3 w-24 rounded-md shimmer" />
                    <div className="h-3 w-40 rounded-md shimmer" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="h-6 w-24 rounded-full shimmer" />
                  <div className="h-9 w-28 rounded-xl shimmer" />
                  <div className="h-9 w-28 rounded-xl shimmer" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No record found
          </div>
        ) : (
          items.map((item) => {
            const resumeUrl = item.resume_url || item.resume || "#";
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-brand" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                      {getInitials(item.user_name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.user_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        description: {item.description}
                      </p>
                      {role === "UNIVERSITY" ? (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-[16px] text-foreground">
                            {item.company_name}
                          </span>
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          {item.user_email}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          {item.user_mobile}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.is_available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90"
                    >
                      <Eye className="h-4 w-4" />
                      View Resume
                    </a>
                    <a
                      href={resumeUrl}
                      download
                      className="inline-flex items-center gap-2 rounded-xl border border-brand/30 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/10"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {count === 0
            ? "Showing 0 of 0"
            : `Showing ${(page - 1) * perPage + 1}-${Math.min(
                page * perPage,
                count
              )} of ${count}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className="h-9 w-9 rounded-xl border text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
                onClick={() => setPage(pageNumber)}
                disabled={pageNumber === page}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm transition hover:border-brand/40 hover:text-foreground disabled:opacity-60"
            onClick={() => setPage(page + 1)}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
