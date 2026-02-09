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
}: ModalProps) {
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
          "relative w-full max-h-[90vh] max-w-lg overflow-hidden rounded-2xl border bg-card p-6 shadow-xl",
          panelClassName
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className={cx("mt-5", bodyClassName)}>{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
