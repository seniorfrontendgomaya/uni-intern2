"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import {
  useBulkUploadUniversityStudents,
  useUniversityStudentsPaginated,
} from "@/hooks/useUniversityStudents";
import { UNIVERSITY_THEME } from "@/lib/university-theme";

export default function UniversityStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { items, page, setPage, perPage, count, hasNext, hasPrev, loading } =
    useUniversityStudentsPaginated(10, searchTerm);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { upload, loading: bulkUploading } = useBulkUploadUniversityStudents();

  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const visiblePages =
    totalPages <= 3
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : (() => {
          const start = Math.max(1, Math.min(page - 1, totalPages - 2));
          return [start, start + 1, start + 2];
        })();

  const handleBulkUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await upload(formData);
    if (!res.ok) return;

    toast.success("Students uploaded successfully");
    setBulkModalOpen(false);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Students</h2>
          <p className="text-sm text-muted-foreground">
            {count} students found
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <input
            type="search"
            placeholder="Search students..."
            className={`h-10 w-full rounded-full border bg-background px-4 text-sm outline-none transition ${UNIVERSITY_THEME.inputFocus} sm:w-72`}
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />
          <button
            type="button"
            className={`inline-flex h-10 items-center justify-center rounded-full ${UNIVERSITY_THEME.buttonPrimary} px-4 text-xs font-semibold shadow-sm transition`}
            onClick={() => setBulkModalOpen(true)}
          >
            Bulk upload
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-left text-sm">
          <thead className={UNIVERSITY_THEME.tableHeader}>
            <tr className="h-12">
              <th className="w-20 px-4 py-2 text-center">Sr No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              Array.from({ length: 10 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="h-12">
                  <td className="px-4 py-2 text-center">
                    <div className="mx-auto h-4 w-8 rounded-md shimmer" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-40 rounded-md shimmer" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-56 rounded-md shimmer" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-32 rounded-md shimmer" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-muted-foreground"
                >
                  No record found
                </td>
              </tr>
            ) : (
              items.map((student, index) => (
                <tr key={student.id} className="h-12">
                  <td className="px-4 py-2 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {student.mobile}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
            className="rounded-xl border px-3 py-1 text-sm transition hover:border-university-accent/40 hover:text-foreground disabled:opacity-60"
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
                className="h-9 w-9 rounded-xl border text-sm transition hover:border-university-accent/40 hover:text-foreground disabled:opacity-60"
                onClick={() => setPage(pageNumber)}
                disabled={pageNumber === page}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm transition hover:border-university-accent/40 hover:text-foreground disabled:opacity-60"
            onClick={() => setPage(page + 1)}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={bulkModalOpen}
        title="Bulk Student Upload"
        onClose={() => setBulkModalOpen(false)}
        panelClassName="w-[90vw] !max-w-2xl"
        accentVariant="university"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-9 rounded-full border px-4 text-xs font-medium text-muted-foreground transition hover:border-university-accent/40 hover:text-foreground"
              onClick={() => setBulkModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`inline-flex h-9 items-center justify-center rounded-full ${UNIVERSITY_THEME.buttonPrimary} px-4 text-xs font-semibold shadow-sm transition disabled:opacity-60`}
              disabled={!file || bulkUploading}
              onClick={handleBulkUpload}
            >
              {bulkUploading ? "Uploading..." : "Upload Students"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-university-accent-muted text-university-accent">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Upload Student Data
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload an Excel file with student email and password columns to
                create multiple student accounts at once.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Select Excel File
            </p>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border bg-background px-4 py-2 text-sm">
              <span className="text-muted-foreground">
                {file ? file.name : "Choose File"}
              </span>
              <span className="rounded-full bg-university-accent px-3 py-1 text-xs font-semibold text-white">
                Browse
              </span>
              <input
                type="file"
                accept=".xls,.xlsx"
                className="hidden"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                }}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              File must be in Excel format (.xls or .xlsx) with columns:{" "}
              <span className="font-mono text-foreground">email</span>,{" "}
              <span className="font-mono text-foreground">password</span>
            </p>
          </div>

          <div className="rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Prepare an Excel file with two columns:{" "}
                <span className="font-mono text-foreground">email</span> and{" "}
                <span className="font-mono text-foreground">password</span>.
              </li>
              <li>Each row represents one student account.</li>
              <li>
                Emails must be unique and not already registered in the system.
              </li>
              <li>Passwords should be at least 8 characters long.</li>
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}

