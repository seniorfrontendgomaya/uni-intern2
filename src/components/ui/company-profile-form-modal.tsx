"use client";

import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";

export type CompanyProfileFormValues = {
  name: string;
  email: string;
  mobile: string;
  description: string;
  password: string;
  image: File | null;
};

const emptyFormValues: CompanyProfileFormValues = {
  name: "",
  email: "",
  mobile: "",
  description: "",
  password: "",
  image: null,
};

export interface CompanyProfileFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  initialValues?: Partial<CompanyProfileFormValues> & { imagePreview?: string | null };
  saving?: boolean;
  onSubmit: (values: CompanyProfileFormValues) => Promise<void>;
  /** Show password hint for update (leave blank to keep current) */
  isUpdate?: boolean;
}

export function CompanyProfileFormModal({
  open,
  title,
  onClose,
  initialValues,
  saving = false,
  onSubmit,
  isUpdate = false,
}: CompanyProfileFormModalProps) {
  const [formValues, setFormValues] = useState<CompanyProfileFormValues>(() =>
    initialValues
      ? {
          name: initialValues.name ?? "",
          email: initialValues.email ?? "",
          mobile: initialValues.mobile ?? "",
          description: initialValues.description ?? "",
          password: initialValues.password ?? "",
          image: initialValues.image ?? null,
        }
      : emptyFormValues
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.imagePreview ?? null
  );
  const [mobileError, setMobileError] = useState<string | null>(null);
  const syncedOpenRef = useRef(false);

  // Only sync from initialValues when the modal first opens. Parent often passes a new initialValues
  // object every render; re-running this on every initialValues change was clearing the selected image
  // (effect ran before the file-selection state update committed, so prev.image was still null).
  useEffect(() => {
    if (!open) {
      syncedOpenRef.current = false;
      return;
    }
    if (!syncedOpenRef.current) {
      syncedOpenRef.current = true;
      setFormValues(
        initialValues
          ? {
              name: initialValues.name ?? "",
              email: initialValues.email ?? "",
              mobile: initialValues.mobile ?? "",
              description: initialValues.description ?? "",
              password: initialValues.password ?? "",
              image: initialValues.image ?? null,
            }
          : { ...emptyFormValues }
      );
      setImagePreview(initialValues?.imagePreview ?? null);
      setMobileError(null);
    }
  }, [open, initialValues]);

  const handleSubmit = async () => {
    setMobileError(null);
    const trimmed: CompanyProfileFormValues = {
      ...formValues,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      mobile: formValues.mobile.replace(/\D/g, "").trim(),
      description: formValues.description.trim(),
      password: formValues.password.trim(),
    };

    // Enforce valid 10-digit mobile number only when adding (not on update)
    if (!isUpdate && trimmed.mobile.length !== 10) {
      setMobileError("Mobile must be exactly 10 digits.");
      return;
    }

    await onSubmit(trimmed);
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      panelClassName="w-[90vw] !max-w-4xl"
      bodyClassName="max-h-[70vh] overflow-y-auto pr-2"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-10 rounded-2xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? "Saving..." : isUpdate ? "Update" : "Create"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={formValues.name}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email (Cannot be changed)</label>
          <input
            type="email"
            disabled={isUpdate}

            className="mt-2 h-10 w-full rounded-lg border bg-gray-100 px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={formValues.email}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">
            Mobile {isUpdate ? "(Cannot be changed)" : "(10 digits)"}
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            disabled={isUpdate}
            className="mt-2 h-10 w-full rounded-lg border bg-gray-100 px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={formValues.mobile}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "").slice(0, 10);
              setMobileError(null);
              setFormValues((prev) => ({ ...prev, mobile: next }));
            }}
          />
          {mobileError ? (
            <p className="mt-1 text-xs text-red-600">{mobileError}</p>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={formValues.description}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">
            Password {isUpdate ? "(leave blank to keep current password)" : ""}
          </label>
          <input
            type="password"
            className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={formValues.password}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={isUpdate ? "Enter new password" : "Password"}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Image</label>
          <div className="mt-2 space-y-3">
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Company logo preview"
                  className="h-24 w-24 rounded-lg border object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand/90 file:cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormValues((prev) => ({ ...prev, image: file }));
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
