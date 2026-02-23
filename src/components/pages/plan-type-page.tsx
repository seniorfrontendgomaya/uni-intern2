"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderTree } from "lucide-react";
import { DataTableShell } from "@/components/ui/data-table-shell";
import { Modal } from "@/components/ui/modal";
import {
  usePlanTypesPaginated,
  useCreatePlanType,
  useUpdatePlanType,
} from "@/hooks/usePlanType";
import type { PlanTypeCreatePayload } from "@/types/plan-type";
import toast from "react-hot-toast";

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-brand" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function PlanTypePage() {
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
    refresh,
    patchItem,
  } = usePlanTypesPaginated(10, "");
  const { data: createPlanType } = useCreatePlanType();
  const { data: updatePlanType } = useUpdatePlanType();

  const handleCreate = async () => {
    const name = addName.trim();
    if (!name) {
      toast.error("Enter plan type name");
      return;
    }
    setSaving(true);
    const result = await createPlanType({ name, is_active: true } as PlanTypeCreatePayload);
    setSaving(false);
    if (result.ok) {
      setAddOpen(false);
      setAddName("");
      refresh();
      toast.success(result.data?.message ?? "Plan type added");
    }
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    setTogglingId(id);
    const result = await updatePlanType({ planTypeId: id, patchData: { is_active } });
    setTogglingId(null);
    const payload = result.ok && result.data && typeof result.data === "object" ? (result.data as { data?: { id: number; name?: string; is_active?: boolean } }).data : null;
    if (payload && typeof payload.id === "number") {
      patchItem({
        id: payload.id,
        name: payload.name,
        is_active: payload.is_active,
      });
    } else {
      toast.error("Failed to update");
    }
  };

  return (
    <>
      <DataTableShell
        title="Plan Type"
        addLabel="Add plan type"
        onAdd={() => {
          setAddName("");
          setAddOpen(true);
        }}
        table={
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="bg-brand text-xs uppercase text-white">
                <tr className="h-11">
                  <th className="w-16 px-4 py-2.5 text-center">S NO</th>
                  <th className="px-4 py-2.5">Plan Type</th>
                  <th className="w-24 px-4 py-2.5 text-center">Active</th>
                  <th className="w-24 px-4 py-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border bg-card">
                      <td className="px-4 py-2.5" colSpan={4}>
                        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No plan types found.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t border-border bg-card transition hover:bg-muted/40"
                    >
                      <td className="px-4 py-2.5 text-center text-muted-foreground">
                        {(page - 1) * perPage + index + 1}
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        {item.name ?? "-"}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={item.is_active ?? true}
                            onChange={(checked) =>
                              handleToggle(String(item.id), checked)
                            }
                            disabled={togglingId === String(item.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-center">
                          <Link
                            href={`/superadmin/subscription-plan?planTypeId=${item.id}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-brand/40 text-brand transition hover:bg-brand/10 sm:h-8 sm:w-8"
                            title="Plan Name"
                            aria-label="Manage plans under this type"
                          >
                            <FolderTree className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        }
        pagination={
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, count)} of {count}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="rounded border px-2 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="rounded border px-2 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        }
      />

      <Modal
        open={addOpen}
        title="Add plan type"
        onClose={() => !saving && setAddOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              disabled={saving}
              className="rounded-xl border px-3 py-1.5 text-sm text-muted-foreground hover:border-brand/40 hover:text-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="rounded-xl bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="plan-type-name">
            Plan Type
          </label>
          <input
            id="plan-type-name"
            type="text"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            placeholder="Enter plan type name"
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </Modal>
    </>
  );
}
