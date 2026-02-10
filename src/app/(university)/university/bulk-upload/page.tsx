"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useBulkUploadUniversityStudents } from "@/hooks/useUniversityStudents";

export default function UniversityBulkUploadPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { upload, loading } = useBulkUploadUniversityStudents();

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await upload(formData);
    if (!res.ok) return;

    toast.success("Students uploaded successfully");
    setModalOpen(false);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Bulk Student Upload
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload an Excel file to create multiple student accounts at once.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
          onClick={() => setModalOpen(true)}
        >
          Open bulk upload
        </button>
      </div>

      <Modal
        open={modalOpen}
        title="Bulk Student Upload"
        onClose={() => setModalOpen(false)}
        panelClassName="w-[90vw] !max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-9 rounded-full border px-4 text-xs font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-full bg-brand px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? "Uploading..." : "Upload Students"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
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
              <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
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

