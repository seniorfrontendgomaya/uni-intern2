"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Use "university" for violet accent on buttons (e.g. university students page). */
  accentVariant?: "brand" | "university";
};

export function ConfirmDialog({
  open,
  title = "Confirm action",
  description = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  accentVariant = "brand",
}: ConfirmDialogProps) {
  const cancelButtonClass =
    accentVariant === "university"
      ? "h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-university-accent/40 hover:text-foreground"
      : "h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground";
  
  const confirmButtonClass =
    accentVariant === "university"
      ? "h-10 rounded-2xl bg-university-accent px-4 text-sm font-medium text-white shadow-sm transition hover:bg-university-accent/90"
      : "h-10 rounded-2xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90";
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={cancelButtonClass}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={confirmButtonClass}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
