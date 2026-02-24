"use client";

import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useDeletePerk,
  usePerk,
  usePerksPaginated,
  useUpdatePerk,
} from "@/hooks/usePerk";
import { useState } from "react";

const columns = [
  {
    key: "sr",
    label: "S NO",
    headerClassName: "w-20 px-4 py-2 text-center",
    cellClassName: "w-16 px-4 py-2 text-center",
  },
  {
    key: "name",
    label: "Name",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2 font-medium",
  },
  {
    key: "description",
    label: "Description",
    headerClassName: "px-4 py-2",
    cellClassName:
      "px-4 py-2 text-muted-foreground wrap-break-word whitespace-normal max-w-[360px]",
  },
  {
    key: "actions",
    label: "Actions",
    headerClassName: "w-24 px-4 py-2 text-center",
    cellClassName: "w-24 px-4 py-2",
  },
];

const fields: Field[] = [
  { name: "name", label: "Name", placeholder: "Enter perk name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
];

export function PerkPage() {
  const [searchTerm, setSearchTerm] = useState("");
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
  } = usePerksPaginated(10, searchTerm);
  const { data: createPerk } = usePerk();
  const { data: updatePerk } = useUpdatePerk();
  const { data: deletePerk } = useDeletePerk();

  const rows = items.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    name: item.name,
    description: item.description ?? "-",
  }));

  return (
    <CrudTable
      title="Certification/Perk"
      addLabel="Add New"
      searchPlaceholder="Search certification/perk..."
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        },
      }}
      onCreate={async (values) => {
        const result = await createPerk({
          name: typeof values.name === "string" ? values.name : "",
          description: typeof values.description === "string" ? values.description : "",
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: (result.data as { message?: string } | undefined)?.message };
      }}
      onUpdate={async (id, patchData) => {
        const result = await updatePerk({
          perkId: id,
          patchData,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deletePerk(id);
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
