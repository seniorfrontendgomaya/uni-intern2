"use client";

import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useDeleteDesignation,
  useDesignation,
  useDesignationsPaginated,
  useUpdateDesignation,
} from "@/hooks/useDesignation";
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
  { name: "name", label: "Name", placeholder: "Enter designation name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
];

export function DesignationPage() {
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
  } = useDesignationsPaginated(10, searchTerm);
  const { data: createDesignation } = useDesignation();
  const { data: updateDesignation } = useUpdateDesignation();
  const { data: deleteDesignation } = useDeleteDesignation();

  const rows = items.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    name: item.name,
    description: item.description ?? "-",
  }));

  return (
    <CrudTable
      title="Designation"
      addLabel="Add designation"
      searchPlaceholder="Search designation..."
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
        const result = await createDesignation({
          name: typeof values.name === "string" ? values.name : "",
          description: typeof values.description === "string" ? values.description : "",
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const result = await updateDesignation({
          designationId: id,
          patchData,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteDesignation(id);
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
