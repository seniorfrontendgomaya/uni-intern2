"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { DataTableShell } from "@/components/ui/data-table-shell";

type Column = {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
};

export type SearchSelectOption = { value: string | number; label: string };

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "file" | "password" | "search_select";
  placeholder?: string;
  min?: number;
  max?: number;
  /** For type "search_select": fetch options by search query. Call with "" for initial/default list. */
  searchSelectFetch?: (query: string) => Promise<SearchSelectOption[]>;
};

type FormValue = string | boolean | File | null;
type RowValue = React.ReactNode;

/** Trim string values before sending to API; leave numbers, booleans, and File unchanged. */
function trimFormValues(
  values: Record<string, FormValue>
): Record<string, FormValue> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  ) as Record<string, FormValue>;
}

type CrudActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  formError?: string;
};

type CrudTableProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  addLabel: string;
  searchPlaceholder: string;
  columns: Column[];
  rows: Array<Record<string, RowValue>>;
  fields: Field[];
  loading?: boolean;
  skeletonRows?: number;
  searchProps?: React.InputHTMLAttributes<HTMLInputElement>;
  modalPanelClassName?: string;
  modalBodyClassName?: string;
  extraActions?: (row: Record<string, RowValue>) => React.ReactNode;
  headerRightExtra?: React.ReactNode;
  onCreate?: (
    values: Record<string, FormValue>
  ) => Promise<CrudActionResult>;
  onUpdate?: (
    id: string,
    patchData: Record<string, FormValue>
  ) => Promise<CrudActionResult>;
  onDelete?: (id: string) => Promise<CrudActionResult>;
  pagination?: {
    page: number;
    perPage: number;
    count: number;
    hasNext: boolean;
    hasPrev: boolean;
    onNext: () => void;
    onPrev: () => void;
    onPageSelect?: (page: number) => void;
  };
};

type SearchSelectState = {
  options: SearchSelectOption[];
  open: boolean;
  query: string;
  selectedLabel: string;
  loading: boolean;
};

function SearchSelectField({
  field,
  formValues,
  setFormValues,
  fieldErrors,
  setFieldErrors,
  searchSelectState,
  setSearchSelectState,
  searchSelectFetchTimeout,
}: {
  field: Field & { searchSelectFetch: (q: string) => Promise<SearchSelectOption[]> };
  formValues: Record<string, FormValue>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, FormValue>>>;
  fieldErrors: Record<string, string[]>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  searchSelectState: Record<string, SearchSelectState>;
  setSearchSelectState: React.Dispatch<React.SetStateAction<Record<string, SearchSelectState>>>;
  searchSelectFetchTimeout: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}) {
  const state = searchSelectState[field.name] ?? {
    options: [],
    open: false,
    query: "",
    selectedLabel: "",
    loading: false,
  };
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultFieldState = (): SearchSelectState => ({
    options: [],
    open: false,
    query: "",
    selectedLabel: "",
    loading: false,
  });

  const fetchOptions = useCallback(
    (query: string) => {
      setSearchSelectState((prev) => ({
        ...prev,
        [field.name]: { ...(prev[field.name] ?? defaultFieldState()), loading: true },
      }));
      field
        .searchSelectFetch!(query)
        .then((options) => {
          setSearchSelectState((prev) => ({
            ...prev,
            [field.name]: {
              ...(prev[field.name] ?? defaultFieldState()),
              options,
              loading: false,
            },
          }));
        })
        .catch(() => {
          setSearchSelectState((prev) => ({
            ...prev,
            [field.name]: {
              ...(prev[field.name] ?? defaultFieldState()),
              options: [],
              loading: false,
            },
          }));
        });
    },
    [field.name, field.searchSelectFetch]
  );

  useEffect(() => {
    if (!state.open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchSelectState((prev) => ({
          ...prev,
          [field.name]: { ...(prev[field.name] ?? state), open: false },
        }));
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [state.open, field.name]);

  const displayText = state.open ? state.query : (state.selectedLabel || state.query || "");

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-medium text-foreground">{field.label}</label>
      <input
        type="text"
        placeholder={field.placeholder}
        className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        value={displayText}
        onFocus={() => {
          setSearchSelectState((prev) => ({
            ...prev,
            [field.name]: {
              ...(prev[field.name] ?? state),
              open: true,
              query: state.selectedLabel ? "" : state.query,
            },
          }));
          if ((searchSelectState[field.name] ?? state).options.length === 0 && !state.loading) {
            fetchOptions("");
          }
        }}
        onChange={(e) => {
          const query = e.target.value;
          setSearchSelectState((prev) => ({
            ...prev,
            [field.name]: {
              ...(prev[field.name] ?? state),
              query,
              open: true,
              selectedLabel: "",
            },
          }));
          if (fieldErrors[field.name]) {
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next[field.name];
              return next;
            });
          }
          if (searchSelectFetchTimeout.current) clearTimeout(searchSelectFetchTimeout.current);
          searchSelectFetchTimeout.current = setTimeout(() => {
            fetchOptions(query);
          }, 300);
        }}
      />
      {state.open && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-card py-1 shadow-lg">
          {state.loading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
          ) : state.options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results</div>
          ) : (
            state.options.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  setFormValues((prev) => ({ ...prev, [field.name]: String(opt.value) }));
                  setSearchSelectState((prev) => ({
                    ...prev,
                    [field.name]: {
                      ...(prev[field.name] ?? state),
                      selectedLabel: opt.label,
                      query: "",
                      open: false,
                    },
                  }));
                }}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function CrudTable({
  title,
  subtitle,
  addLabel,
  searchPlaceholder,
  columns,
  rows,
  fields,
  loading = false,
  skeletonRows = 10,
  searchProps,
  modalPanelClassName,
  modalBodyClassName,
  extraActions,
  headerRightExtra,
  onCreate,
  onUpdate,
  onDelete,
  pagination,
}: CrudTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [saving, setSaving] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, FormValue>>(() =>
    fields.reduce<Record<string, FormValue>>((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.name] = false;
        return acc;
      }
      if (field.type === "file") {
        acc[field.name] = null;
        return acc;
      }
      acc[field.name] = "";
      return acc;
    }, {})
  );
  const [initialValues, setInitialValues] = useState<Record<string, FormValue>>(
    {}
  );
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [searchSelectState, setSearchSelectState] = useState<Record<string, SearchSelectState>>({});
  const searchSelectFetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSelectDropdownRef = useRef<HTMLDivElement | null>(null);

  const totalRows = rows.length;
  const showCount = rows.length;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.count / pagination.perPage))
    : 1;
  const visiblePages = pagination
    ? (() => {
        if (totalPages <= 3)
          return Array.from({ length: totalPages }, (_, i) => i + 1);
        const start = Math.max(
          1,
          Math.min(pagination.page - 1, totalPages - 2)
        );
        return [start, start + 1, start + 2];
      })()
    : [1, 2, 3];

  return (
    <>
      <DataTableShell
        title={title}
        subtitle={subtitle}
        addLabel={addLabel}
        searchPlaceholder={searchPlaceholder}
        searchProps={searchProps}
        headerRightExtra={headerRightExtra}
        onAdd={() => {
          setModalMode("create");
          setActiveRowId(null);
          const emptyValues = fields.reduce<Record<string, FormValue>>(
            (acc, field) => {
              if (field.type === "checkbox") {
                acc[field.name] = false;
                return acc;
              }
              if (field.type === "file") {
                acc[field.name] = null;
                return acc;
              }
              acc[field.name] = "";
              return acc;
            },
            {}
          );
          setFormValues(emptyValues);
          setInitialValues(emptyValues);
          setFieldErrors({});
          setFormError(null);
          setImagePreviews({});
          setSearchSelectState({});
          setModalOpen(true);
        }}
        table={
          <div className="overflow-x-auto rounded-2xl border">
            <div className="min-w-full">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-brand text-xs uppercase text-white">
                  <tr className="h-12">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={column.headerClassName ?? "px-2 py-2 text-xs sm:px-4 sm:text-xs"}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                {loading ? (
                  Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {columns.map((column, columnIndex) => {
                          if (column.key === "actions") {
                            return (
                              <td
                                key={column.key}
                                className={
                                  column.cellClassName ?? "w-24 px-4 py-2"
                                }
                              >
                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                  <div className="h-7 w-7 rounded-xl shimmer sm:h-8 sm:w-8" />
                                  <div className="h-7 w-7 rounded-xl shimmer sm:h-8 sm:w-8" />
                                </div>
                              </td>
                            );
                          }

                          const widthClass =
                            columnIndex === 0
                              ? "w-8"
                              : columnIndex === 1
                                ? "w-28"
                                : "w-48";

                          return (
                            <td
                              key={column.key}
                              className={
                                column.cellClassName ??
                                "px-4 py-2 wrap-break-word whitespace-normal"
                              }
                            >
                              <div
                                className={`h-4 rounded-md shimmer ${widthClass}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))
                ) : rows.length === 0 ? (
                  <tr className="border-t">
                    <td
                      colSpan={columns.length}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      No record found
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                      <tr
                        key={`${row.id ?? row.name ?? index}`}
                        className="border-t transition hover:bg-brand/10 even:bg-muted/40"
                      >
                        {columns.map((column) => {
                          if (column.key === "actions") {
                            return (
                              <td
                                key={column.key}
                                className={
                                  column.cellClassName ?? "w-24 px-4 py-2"
                                }
                              >
                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                  {extraActions ? extraActions(row) : null}
                                  <button
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-xl border text-brand transition hover:border-brand/40 hover:bg-brand/10 sm:h-8 sm:w-8"
                                    aria-label="Edit"
                                    title="Edit"
                                    onClick={() => {
                                      setModalMode("update");
                                const rowId = String(row.id ?? "");
                                setActiveRowId(rowId);
                                const nextValues =
                                  fields.reduce<Record<string, FormValue>>(
                                    (acc, field) => {
                                      if (field.type === "checkbox") {
                                        acc[field.name] = Boolean(
                                          row[field.name]
                                        );
                                        return acc;
                                      }
                                      if (field.type === "file") {
                                        acc[field.name] = null;
                                        return acc;
                                      }
                                      // Check for _value suffix first (for fields that are React elements in display)
                                      const valueField = `${field.name}_value`;
                                      const rawValue = row[valueField] !== undefined 
                                        ? row[valueField] 
                                        : row[field.name];
                                      // If it's a React element (object with props), try to extract text or use empty string
                                      if (typeof rawValue === "object" && rawValue !== null && "props" in rawValue) {
                                        acc[field.name] = "";
                                      } else {
                                        acc[field.name] = String(rawValue ?? "");
                                      }
                                      return acc;
                                    },
                                    {}
                                  );
                                setFormValues(nextValues);
                                setInitialValues(nextValues);
                                setFieldErrors({});
                                setFormError(null);
                                setSearchSelectState({});
                                // Set image preview from row data if available
                                const previews: Record<string, string> = {};
                                fields.forEach((field) => {
                                  if (field.type === "file") {
                                    // Check for image_url field (stored separately for preview)
                                    const imageUrl = row[`${field.name}_url`];
                                    if (imageUrl && typeof imageUrl === "string") {
                                      previews[field.name] = imageUrl;
                                    } else {
                                      // Fallback: try to extract from image element
                                      const imgElement = row[field.name];
                                      if (typeof imgElement === "object" && imgElement !== null && "props" in imgElement) {
                                        const imgProps = (imgElement as any).props;
                                        if (imgProps?.src) {
                                          previews[field.name] = imgProps.src;
                                        }
                                      }
                                    }
                                  }
                                });
                                setImagePreviews(previews);
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
                                setActiveRowId(String(row.id ?? ""));
                                setConfirmOpen(true);
                              }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={column.key}
                              className={
                                column.cellClassName ??
                                "px-2 py-2 break-words whitespace-normal sm:px-4"
                              }
                            >
                              {row[column.key]}
                            </td>
                          );
                        })}
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
                {pagination
                  ? `Showing ${
                      pagination.count === 0
                        ? 0
                        : (pagination.page - 1) * pagination.perPage + 1
                    }-${Math.min(
                      pagination.page * pagination.perPage,
                      pagination.count
                    )} of ${pagination.count}`
                  : `Showing 1-${showCount} of ${totalRows}`}
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                  onClick={pagination?.onPrev}
                  disabled={pagination ? !pagination.hasPrev : false}
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <div className="flex items-center gap-1">
                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className="h-8 w-8 rounded-xl border text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:h-9 sm:w-9 sm:text-sm"
                      onClick={() => pagination?.onPageSelect?.(pageNumber)}
                      disabled={
                        pagination ? pageNumber === pagination.page : false
                      }
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <button
                  className="rounded-xl border px-2 py-1 text-xs transition hover:border-brand/40 hover:text-foreground disabled:opacity-60 sm:px-3 sm:text-sm"
                  onClick={pagination?.onNext}
                  disabled={pagination ? !pagination.hasNext : false}
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
        title="Delete entry?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (!onDelete || !activeRowId) {
            setConfirmOpen(false);
            return;
          }

          setSaving(true);
          onDelete(activeRowId).then((result) => {
            setSaving(false);
            if (!result.ok) return;
            setConfirmOpen(false);
            if (result.message) {
              toast.success(result.message);
            }
          });
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      <Modal
        open={modalOpen}
        title={modalMode === "create" ? addLabel : `Update ${title}`}
        panelClassName={modalPanelClassName}
        bodyClassName={modalBodyClassName}
        onClose={() => {
          setModalOpen(false);
          setFieldErrors({});
          setFormError(null);
        }}
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="h-10 rounded-2xl border px-4 text-sm font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
              onClick={() => {
                setModalOpen(false);
                setFieldErrors({});
                setFormError(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-10 rounded-2xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90"
              disabled={saving}
              onClick={() => {
                if (modalMode === "create") {
                  if (!onCreate) {
                    setModalOpen(false);
                    return;
                  }

                  setSaving(true);
                  onCreate(trimFormValues(formValues)).then((result) => {
                    setSaving(false);
                    if (!result.ok) {
                      setFieldErrors(result.fieldErrors ?? {});
                      setFormError(result.formError ?? null);
                      return;
                    }
                    setModalOpen(false);
                    setFieldErrors({});
                    setFormError(null);
                    if (result.message) {
                      toast.success(result.message);
                    }
                  });
                  return;
                }

                if (!onUpdate || !activeRowId) {
                  setModalOpen(false);
                  return;
                }

                const patchData = trimFormValues(
                  Object.fromEntries(
                    Object.entries(formValues).filter(
                      ([key, value]) => value !== initialValues[key]
                    )
                  ) as Record<string, FormValue>
                );

                setSaving(true);
                onUpdate(activeRowId, patchData).then((result) => {
                  setSaving(false);
                  if (!result.ok) {
                    setFieldErrors(result.fieldErrors ?? {});
                    setFormError(result.formError ?? null);
                    return;
                  }
                  setModalOpen(false);
                  setFieldErrors({});
                  setFormError(null);
                  if (result.message) {
                    toast.success(result.message);
                  }
                });
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
          {formError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === "checkbox" ? (
                <label className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  {field.label}
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border text-brand focus:ring-brand/30"
                    checked={Boolean(formValues[field.name])}
                    onChange={(event) =>
                      setFormValues((prev) => {
                        if (fieldErrors[field.name]) {
                          setFieldErrors((current) => {
                            const next = { ...current };
                            delete next[field.name];
                            return next;
                          });
                        }
                        return {
                          ...prev,
                          [field.name]: event.target.checked,
                        };
                      })
                    }
                  />
                </label>
              ) : field.type === "textarea" ? (
                <>
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  <textarea
                    placeholder={field.placeholder}
                    className="mt-2 min-h-[96px] w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    value={String(formValues[field.name] ?? "")}
                    onChange={(event) =>
                      setFormValues((prev) => {
                        if (fieldErrors[field.name]) {
                          setFieldErrors((current) => {
                            const next = { ...current };
                            delete next[field.name];
                            return next;
                          });
                        }
                        return {
                          ...prev,
                          [field.name]: event.target.value,
                        };
                      })
                    }
                  />
                </>
              ) : field.type === "file" ? (
                <>
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  {imagePreviews[field.name] && (
                    <div className="mt-2 mb-2">
                      <img
                        src={imagePreviews[field.name]}
                        alt="Preview"
                        className="h-24 w-24 rounded-lg object-cover border"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 block w-full text-sm text-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand hover:file:bg-brand/20"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      if (fieldErrors[field.name]) {
                        setFieldErrors((current) => {
                          const next = { ...current };
                          delete next[field.name];
                          return next;
                        });
                      }
                      setFormValues((prev) => ({
                        ...prev,
                        [field.name]: file,
                      }));
                      // Create preview for image files
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreviews((prev) => ({
                            ...prev,
                            [field.name]: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreviews((prev) => {
                          const next = { ...prev };
                          delete next[field.name];
                          return next;
                        });
                      }
                    }}
                  />
                </>
              ) : field.type === "search_select" && field.searchSelectFetch ? (
                <SearchSelectField
                  field={field}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  fieldErrors={fieldErrors}
                  setFieldErrors={setFieldErrors}
                  searchSelectState={searchSelectState}
                  setSearchSelectState={setSearchSelectState}
                  searchSelectFetchTimeout={searchSelectFetchTimeout}
                />
              ) : (
                <>
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  <input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    min={field.type === "number" ? field.min ?? 0 : undefined}
                    max={field.type === "number" ? field.max : undefined}
                    className="mt-2 h-10 w-full rounded-lg border bg-background px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    value={String(formValues[field.name] ?? "")}
                    onChange={(event) =>
                      setFormValues((prev) => {
                        if (fieldErrors[field.name]) {
                          setFieldErrors((current) => {
                            const next = { ...current };
                            delete next[field.name];
                            return next;
                          });
                        }
                        return {
                          ...prev,
                          [field.name]: event.target.value,
                        };
                      })
                    }
                  />
                </>
              )}
              {fieldErrors[field.name]?.length ? (
                <div className="mt-1 space-y-0.5">
                  {fieldErrors[field.name].map((message, index) => (
                    <p key={index} className="text-xs text-red-600">
                      {message}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
