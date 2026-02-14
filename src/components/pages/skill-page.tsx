"use client";

import { CrudTable } from "@/components/ui/crud-table";
import {
  useDeleteSkill,
  useSkill,
  useSkillsPaginated,
  useUpdateSkill,
} from "@/hooks/useSkill";
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

const fields = [
  { name: "name", label: "Name", placeholder: "Enter skill name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
];

export function SkillPage() {
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
  } = useSkillsPaginated(10, searchTerm);
  const { data: createSkill } = useSkill();
  const { data: updateSkill } = useUpdateSkill();
  const { data: deleteSkill } = useDeleteSkill();

  const rows = items.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    name: item.name,
    description: item.description ?? "-",
  }));

  return (
    <CrudTable
      title="Skill"
      addLabel="Add skill"
      searchPlaceholder="Search skill..."
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
        const result = await createSkill({
          name: values.name ?? "",
          description: values.description ?? "",
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const result = await updateSkill({
          skillId: id,
          patchData,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteSkill(id);
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
