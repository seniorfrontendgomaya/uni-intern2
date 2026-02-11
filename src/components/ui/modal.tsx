"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  panelClassName?: string;
  bodyClassName?: string;
  /** Use "university" for violet accent on close button (e.g. university students page). */
  accentVariant?: "brand" | "university";
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  panelClassName,
  bodyClassName,
  accentVariant = "brand",
}: ModalProps) {
  const closeButtonClass =
    accentVariant === "university"
      ? "rounded-xl border px-3 py-1 text-sm text-muted-foreground transition hover:border-university-accent/40 hover:text-foreground"
      : "rounded-xl border px-3 py-1 text-sm text-muted-foreground transition hover:border-brand/40 hover:text-foreground";
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cx(
          "relative flex w-full max-h-[90vh] max-w-lg flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-xl",
          panelClassName
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <button
            type="button"
            className={closeButtonClass}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className={cx("mt-5 min-h-0 flex-1 overflow-y-auto", bodyClassName)}>
          {children}
        </div>
        {footer ? <div className="mt-6 shrink-0">{footer}</div> : null}
      </div>
    </div>
  );
}
