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
  /** Optional: style the header row (e.g. gradient to match profile card). */
  headerClassName?: string;
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
  headerClassName,
  accentVariant = "brand",
}: ModalProps) {
  const closeButtonDefault =
    accentVariant === "university"
      ? "rounded-xl border px-3 py-1 text-sm text-muted-foreground transition hover:border-university-accent/40 hover:text-foreground"
      : "rounded-xl border px-3 py-1 text-sm text-muted-foreground transition hover:border-brand/40 hover:text-foreground";
  const closeButtonOnGradient =
    "rounded-xl border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20";
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const hasHeaderStyle = Boolean(headerClassName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cx(
          "relative flex w-full max-h-[90vh] max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl",
          !hasHeaderStyle && "p-6",
          panelClassName
        )}
      >
        <div
          className={cx(
            "flex items-start justify-between gap-4",
            hasHeaderStyle ? headerClassName : "mb-5"
          )}
        >
          <div>
            <h3 className={cx("text-lg font-semibold", hasHeaderStyle ? "text-white" : "text-foreground")}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            className={hasHeaderStyle ? closeButtonOnGradient : closeButtonDefault}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className={cx("min-h-0 flex-1 overflow-y-auto", hasHeaderStyle ? "px-6 pb-6" : "", bodyClassName)}>
          {children}
        </div>
        {footer ? <div className={cx("shrink-0", hasHeaderStyle ? "px-6 pb-6" : "mt-6")}>{footer}</div> : null}
      </div>
    </div>
  );
}
