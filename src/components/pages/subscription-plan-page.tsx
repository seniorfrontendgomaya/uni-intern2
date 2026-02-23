"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useSubscribePlansPaginated,
  useCreateSubscribePlan,
  useUpdateSubscribePlan,
  useDeleteSubscribePlan,
} from "@/hooks/useSubscribePlan";
import { getPlanTypes } from "@/services/plan-type.service";
import { getActivePlans } from "@/services/active-plan.service";
import type { SearchSelectOption } from "@/components/ui/crud-table";
import type { SubscribePlanItem } from "@/types/subscribe-plan";

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

const columns = [
  {
    key: "sr",
    label: "S NO",
    headerClassName: "w-20 px-4 py-2 text-center",
    cellClassName: "w-16 px-4 py-4 text-center",
  },
  {
    key: "name",
    label: "Name",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-4 font-medium",
  },
  {
    key: "plan_name",
    label: "Plan",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-4 capitalize",
  },
  {
    key: "description",
    label: "Description",
    headerClassName: "px-4 py-2",
    cellClassName:
      "px-4 py-4 text-muted-foreground max-w-[280px] truncate whitespace-normal",
  },
  {
    key: "price",
    label: "Price (₹)",
    headerClassName: "px-4 py-2 text-right",
    cellClassName: "px-4 py-4 text-right font-medium",
  },
  {
    key: "active",
    label: "Active",
    headerClassName: "w-24 px-4 py-2 text-center",
    cellClassName: "w-24 px-4 py-4 text-center",
  },
  // {
  //   key: "actions",
  //   label: "Actions",
  //   headerClassName: "w-24 px-4 py-2 text-center",
  //   cellClassName: "w-24 px-4 py-2",
  // },
];

const planTypeSearchFetch = async (query: string): Promise<SearchSelectOption[]> => {
  const res = await getActivePlans(query);
  const data = res?.data ?? [];
  return data.map((item) => ({ value: item.id, label: item.name ?? String(item.id) }));
};

const fields: Field[] = [
  { name: "name", label: "Name", placeholder: "e.g. Internship subscription" },
  {
    name: "plan_type",
    label: "Plan type",
    type: "search_select",
    placeholder: "Search plan type...",
    searchSelectFetch: planTypeSearchFetch,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "About this plan",
  },
  {
    name: "price",
    label: "Price (₹)",
    type: "number",
    placeholder: "0",
    min: 1,
  },
  { name: "is_active", label: "Active", type: "checkbox" },
];

type SubscriptionPlanPageProps = {
  planTypeId: string;
};

export function SubscriptionPlanPage({ planTypeId }: SubscriptionPlanPageProps) {
  const [planTypeName, setPlanTypeName] = useState<string | null>(null);
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
  } = useSubscribePlansPaginated(10, "", planTypeId);
  const { data: createPlan } = useCreateSubscribePlan();
  const { data: updatePlan } = useUpdateSubscribePlan();
  const { data: deletePlan } = useDeleteSubscribePlan();

  useEffect(() => {
    if (!planTypeId) return;
    getPlanTypes()
      .then((res) => {
        const match = (res.data ?? []).find(
          (item) => String(item.id) === String(planTypeId)
        );
        if (match) setPlanTypeName(match.name);
      })
      .catch(() => {});
  }, [planTypeId]);

  const handleToggle = async (id: string, is_active: boolean) => {
    setTogglingId(id);
    const result = await updatePlan({ planId: id, patchData: { is_active } });
    setTogglingId(null);
    const payload =
      result.ok && result.data && typeof result.data === "object"
        ? (result.data as { data?: SubscribePlanItem }).data
        : null;
    if (payload && typeof payload.id === "number") {
      patchItem({
        id: payload.id,
        name: payload.name,
        plan_name: payload.plan_name,
        description: payload.description,
        price: payload.price,
        is_active: payload.is_active,
      });
    } else if (result.ok) {
      refresh();
    }
  };

  const rows = items.map((item, index) => ({
    id: String(item.id),
    sr: String((page - 1) * perPage + index + 1),
    name: item.name,
    plan_name: item.plan_name ?? "-",
    description: item.description ?? "-",
    price: item.price != null ? item.price.toLocaleString("en-IN") : "-",
    price_value: item.price,
    is_active: item.is_active ? "Yes" : "No",
    active: (
      <div className="flex justify-center">
        <ToggleSwitch
          checked={item.is_active ?? false}
          onChange={(checked) => handleToggle(String(item.id), checked)}
          disabled={togglingId === String(item.id)}
        />
      </div>
    ),
  }));

  return (
    <CrudTable
      title={
        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/plan-type"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-lg font-semibold text-foreground">
            {planTypeName ?? "Plan Name"}
          </span>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-2">
          <Link href="/superadmin/plan-type" className="hover:underline">
            Plan Type
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">
            {planTypeName ?? "Plan Name"}
          </span>
        </div>
      }
      addLabel="Add plan"
      searchPlaceholder="Search by name or plan..."
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
      onCreate={async (values) => {
        const planTypeValue = values.plan_type;
        const planId =
          typeof planTypeValue === "string" && planTypeValue.trim() !== ""
            ? Number(String(planTypeValue).replace(/,/g, ""))
            : NaN;
        const priceRaw =
          typeof values.price === "string"
            ? Number(String(values.price).replace(/,/g, ""))
            : typeof values.price === "number"
              ? values.price
              : 0;
        const price = Number.isFinite(priceRaw) ? priceRaw : 0;

        const fieldErrors: Record<string, string[]> = {};
        if (!Number.isFinite(planId) || planId < 1) {
          fieldErrors.plan_type = ["Please select a plan type from the dropdown."];
        }
        if (!Number.isFinite(priceRaw) || price <= 0) {
          fieldErrors.price = ["Zero or negative values are not allowed. Enter a positive number."];
        }
        if (Object.keys(fieldErrors).length > 0) {
          return { ok: false, fieldErrors };
        }

        const result = await createPlan({
          name: typeof values.name === "string" ? values.name.trim() : "",
          plan: planId,
          description:
            typeof values.description === "string" ? values.description.trim() : "",
          price,
          is_active: values.is_active === true,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const patch: Record<string, unknown> = {};
        if (patchData.name !== undefined) patch.name = patchData.name;
        if (patchData.plan_type !== undefined)
          patch.plan_type = typeof patchData.plan_type === "string" ? patchData.plan_type.trim() : patchData.plan_type;
        if (patchData.description !== undefined)
          patch.description = patchData.description;
        if (patchData.price !== undefined) {
          const v = patchData.price;
          patch.price =
            typeof v === "string"
              ? Number(String(v).replace(/,/g, "")) || 0
              : typeof v === "number"
                ? v
                : 0;
        }
        if (patchData.is_active !== undefined)
          patch.is_active = patchData.is_active === true;
        const result = await updatePlan({ planId: id, patchData: patch });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deletePlan(id);
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      pagination={{
        page,
        perPage,
        count,
        hasNext,
        hasPrev,
        onNext: () => setPage((current) => current + 1),
        onPrev: () => setPage((current) => Math.max(1, current - 1)),
        onPageSelect: (value) => setPage(value),
      }}
    />
  );
}
