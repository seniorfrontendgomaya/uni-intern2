"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

type DataTableShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  addLabel?: string;
  searchPlaceholder?: string;
  onAdd?: () => void;
  table: ReactNode;
  pagination: ReactNode;
  searchProps?: InputHTMLAttributes<HTMLInputElement>;
  headerRightExtra?: ReactNode;
};

export function DataTableShell({
  title,
  subtitle,
  addLabel = "Add",
  searchPlaceholder = "Search...",
  onAdd,
  table,
  pagination,
  searchProps,
  headerRightExtra,
}: DataTableShellProps) {
  const hasControlledValue =
    searchProps &&
    Object.prototype.hasOwnProperty.call(searchProps, "value");
  const inputProps = hasControlledValue
    ? { ...searchProps, value: searchProps?.value ?? "" }
    : searchProps;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center justify-between sm:block">
            <div>
              <h2 className="text-lg flex items-center gap-2 font-semibold text-foreground">
                {title}
              </h2>
              {subtitle ? (
                <div className="mt-1 text-xs text-muted-foreground">
                  {subtitle}
                </div>
              ) : null}
            </div>
            {onAdd ? (
              <button
                className="h-10 rounded-full bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90 sm:hidden"
                onClick={onAdd}
              >
                {addLabel}
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          {searchProps !== undefined ? (
            <div className="relative w-full max-w-md sm:w-72">
              <input
                type="search"
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-full border bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                {...inputProps}
              />
            </div>
          ) : null}
          {headerRightExtra ? (
            <div className="text-xs text-muted-foreground">
              {headerRightExtra}
            </div>
          ) : null}
          {onAdd ? (
            <button
              className="hidden h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand/90 sm:inline-flex"
              onClick={onAdd}
            >
              {addLabel}
            </button>
          ) : null}
        </div>
      </div>

      {table}
      {pagination}
    </div>
  );
}
