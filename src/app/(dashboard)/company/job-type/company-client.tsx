"use client";

import type { InputHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { IJobType } from "@/types/job.type";
import { useDeleteJobType, useJobType, useUpdateJobType } from "@/hooks/useJobType";

type CompanyClientProps = {
  data: IJobType[];
  loading: boolean;
  page: number;
  perPage: number;
  count: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPageSelect?: (page: number) => void;
  onRefresh?: () => void;
  searchProps?: InputHTMLAttributes<HTMLInputElement>;
};

export function CompanyClient({
  data,
  loading,
  page,
  perPage,
  count,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onPageSelect,
  onRefresh,
  searchProps,
}: CompanyClientProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeJobTypeId, setActiveJobTypeId] = useState<string | null>(null);
  const [initialName, setInitialName] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: createJobType } = useJobType();
  const { data: updateJobType } = useUpdateJobType();
  const { data: deleteJobType } = useDeleteJobType();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const showingStart = count === 0 ? 0 : (page - 1) * perPage + 1;
  const showingEnd = Math.min(page * perPage, count);
  const visiblePages = (() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(page - 1, totalPages - 2));
    return [start, start + 1, start + 2];
  })();


  return (
    <>
      <DataTableShell
        title="Job Type"
        addLabel="Add job Type"
        searchPlaceholder="Search job type..."
        searchProps={searchProps}
        onAdd={() => {
          setModalMode("create");
          setActiveJobTypeId(null);
          setName("");
          setDescription("");
          setInitialName("");
          setInitialDescription("");
          setModalOpen(true);
        }}
        table={
          <div className="overflow-x-auto rounded-2xl border">
            <div className="min-w-full">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-brand text-xs uppercase text-white">
                  <tr className="h-12">
                    <th className="w-20 px-2 py-2 text-center text-xs sm:px-4 sm:text-xs">Sr No</th>
                    <th className="px-2 py-2 text-xs sm:px-4 sm:text-xs">Name</th>
                    <th className="px-2 py-2 text-xs sm:px-4 sm:text-xs">Description</th>
                    <th className="w-24 px-2 py-2 text-center text-xs sm:px-4 sm:text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="border-t">
                        <td className="w-16 px-2 py-2 text-center sm:px-4">
                          <div className="mx-auto h-4 w-6 rounded-md shimmer" />
                        </td>
                        <td className="px-2 py-2 sm:px-4">
                          <div className="h-4 w-24 rounded-md shimmer" />
                        </td>
                        <td className="px-2 py-2 sm:px-4">
                          <div className="h-4 w-40 rounded-md shimmer" />
                        </td>
                        <td className="w-24 px-2 py-2 sm:px-4">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <div className="h-7 w-7 rounded-xl shimmer sm:h-8 sm:w-8" />
                            <div className="h-7 w-7 rounded-xl shimmer sm:h-8 sm:w-8" />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : data.length === 0 ? (
                  <tr className="border-t">
                    <td
                      colSpan={4}
                      className="px-2 py-6 text-center text-xs text-muted-foreground sm:px-4 sm:text-sm"
                    >
                      No record found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t transition hover:bg-brand/10 even:bg-muted/40"
                      >
                        <td className="w-16 px-2 py-2 text-center text-xs sm:px-4 sm:text-sm">
                          {(page - 1) * perPage + index + 1}
                        </td>
                        <td className="px-2 py-2 text-xs font-medium wrap-break-word sm:px-4 sm:text-sm">{item.name}</td>
                        <td className="px-2 py-2 text-xs text-muted-foreground wrap-break-word whitespace-normal max-w-[360px] sm:px-4 sm:text-sm">
                          {item.description}
                        </td>
                        <td className="w-24 px-2 py-2 sm:px-4">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <button
                              className="inline-flex h-7 w-7 items-center justify-center rounded-xl border text-brand transition hover:border-brand/40 hover:bg-brand/10 sm:h-8 sm:w-8"
                              aria-label="Edit"
                              title="Edit"
                              onClick={() => {
                                setModalMode("update");
                                setActiveJobTypeId(item.id);
                                setName(item.name ?? "");
                                setDescription(item.description ?? "");
                                setInitialName(item.name ?? "");
                                setInitialDescription(item.description ?? "");
                                setModalOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-brand/30 text-brand transition hover:bg-brand/10 sm:h-8 sm:w-8"
                              aria-label="Delete"
                              title="Delete"
                              onClick={() => {
                                setDeleteTargetId(item.id);
                                setConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        }
        pagination={
          loading ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="h-4 w-32 rounded-md shimmer" />
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 rounded-xl shimmer" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-9 w-9 rounded-xl shimmer"
                    />
                  ))}
                </div>
                <div className="h-9 w-20 rounded-xl shimmer" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground sm:text-sm">
                Showing {showingStart}-{showingEnd} of {count}
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                  onClick={onPrev}
                  disabled={!hasPrev}
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <div className="flex items-center gap-1">
                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className="h-8 w-8 rounded-xl border text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:h-9 sm:w-9 sm:text-sm"
                      onClick={() => onPageSelect?.(pageNumber)}
                      disabled={pageNumber === page}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <button
                  className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                  onClick={onNext}
                  disabled={!hasNext}
                >
                  Next
                </button>
              </div>
            </div>
          )
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete job type?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!deleteTargetId) {
            setConfirmOpen(false);
            return;
          }

          const result = await deleteJobType(deleteTargetId);
          if (!result.ok) return;
          setConfirmOpen(false);
          setDeleteTargetId(null);
          if (result.data?.message) {
            toast.success(result.data.message);
          }
          onRefresh?.();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      <Modal
        open={modalOpen}
        title={modalMode === "create" ? "Add job type" : "Update job type"}
        onClose={() => setModalOpen(false)}
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
              disabled={saving}
              onClick={async () => {
                if (modalMode === "create") {
                  setSaving(true);
                  const result = await createJobType({
                    name,
                    description,
                  });
                  setSaving(false);

                  if (!result.ok) return;
                  setModalOpen(false);
                  setName("");
                  setDescription("");
                  if (result.data?.message) {
                    toast.success(result.data.message);
                  }
                  onRefresh?.();
                  return;
                }

                if (!activeJobTypeId) {
                  return;
                }

                setSaving(true);
                const result = await updateJobType({
                  jobTypeId: activeJobTypeId,
                  patchData: {
                    ...(name !== initialName ? { name } : {}),
                    ...(description !== initialDescription
                      ? { description }
                      : {}),
                  },
                });
                setSaving(false);

                if (!result.ok) return;
                setModalOpen(false);
                setName("");
                setDescription("");
                if (result.data?.message) {
                  toast.success(result.data.message);
                }
                onRefresh?.();
              }}
            >
              {saving
                ? "Saving..."
                : modalMode === "create"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              placeholder="Enter job type name"
              className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              placeholder="Add a short description"
              className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
