"use client";

import { useState } from "react";
import { UploadCloud, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useBulkUploadUniversityStudents,
  useUniversityStudentsPaginated,
  useDeleteUniversityStudent,
  useUpdateUniversityStudent,
} from "@/hooks/useUniversityStudents";
import type { UniversityStudent } from "@/types/university-student";
import { UNIVERSITY_THEME } from "@/lib/university-theme";

export default function UniversityStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { items, page, setPage, perPage, count, hasNext, hasPrev, loading, refresh } =
    useUniversityStudentsPaginated(10, searchTerm);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { upload, loading: bulkUploading } = useBulkUploadUniversityStudents();
  const { delete: deleteStudent, loading: deleting } = useDeleteUniversityStudent();
  const { update: updateStudent, loading: updating } = useUpdateUniversityStudent();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [studentToUpdate, setStudentToUpdate] = useState<UniversityStudent | null>(null);
  const [formValues, setFormValues] = useState({
    email: "",
    mobile: "",
  });

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
    refresh();
  };

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    const result = await deleteStudent(studentToDelete);
    if (result.ok) {
      toast.success(result.data?.message || "Student deleted successfully");
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      refresh();
    } else {
      toast.error("Failed to delete student");
    }
  };

  const handleUpdateClick = (student: UniversityStudent) => {
    setStudentToUpdate(student);
    setFormValues({
      email: student.email || "",
      mobile: student.mobile || "",
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToUpdate) return;

    const payload = {
      email: formValues.email.trim() || null,
      mobile: formValues.mobile.trim() || null,
    };

    const result = await updateStudent(studentToUpdate.id, payload);
    if (result.ok) {
      toast.success(result.data?.message || "Student updated successfully");
      setUpdateModalOpen(false);
      setStudentToUpdate(null);
      refresh();
    } else {
      toast.error("Failed to update student");
    }
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
              <th className="w-24 px-4 py-2 text-center">Actions</th>
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
                  <td className="px-4 py-2">
                    <div className="mx-auto h-4 w-16 rounded-md shimmer" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-university-accent/40 text-university-accent transition hover:bg-university-accent/10"
                        aria-label="Update"
                        title="Update"
                        onClick={() => handleUpdateClick(student)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-300 text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        aria-label="Delete"
                        title="Delete"
                        disabled={deleting}
                        onClick={() => handleDeleteClick(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Student?"
        description="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setStudentToDelete(null);
        }}
        accentVariant="university"
      />

      <Modal
        open={updateModalOpen}
        title="Update Student"
        onClose={() => {
          setUpdateModalOpen(false);
          setStudentToUpdate(null);
        }}
        accentVariant="university"
        panelClassName="w-[90vw] !max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-9 rounded-full border px-4 text-xs font-medium text-muted-foreground transition hover:border-university-accent/40 hover:text-foreground"
              onClick={() => {
                setUpdateModalOpen(false);
                setStudentToUpdate(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`inline-flex h-9 items-center justify-center rounded-full ${UNIVERSITY_THEME.buttonPrimary} px-4 text-xs font-semibold shadow-sm transition disabled:opacity-60`}
              disabled={updating}
              onClick={handleUpdateSubmit}
            >
              {updating ? "Updating..." : "Update Student"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              className={`mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition ${UNIVERSITY_THEME.inputFocus}`}
              value={formValues.email}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Mobile
            </label>
            <input
              type="text"
              className={`mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition ${UNIVERSITY_THEME.inputFocus}`}
              value={formValues.mobile}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, mobile: e.target.value }))
              }
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

