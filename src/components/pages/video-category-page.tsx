"use client";

import { useState } from "react";
import { CrudTable } from "@/components/ui/crud-table";
import {
  useDeleteVideoCategory,
  useUpdateVideoCategory,
  useVideoCategoriesPaginated,
  useVideoCategory,
} from "@/hooks/useVideoCategory";

const columns = [
  {
    key: "name",
    label: "Name",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2 font-medium",
  },
  {
    key: "title",
    label: "Title",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "description",
    label: "Description",
    headerClassName: "px-4 py-2",
    cellClassName:
      "px-4 py-2 text-muted-foreground wrap-break-word whitespace-normal max-w-[360px]",
  },
  {
    key: "fee",
    label: "Fees",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "placement_label",
    label: "Placement Guarantee",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "actions",
    label: "Actions",
    headerClassName: "w-24 px-4 py-2 text-center",
    cellClassName: "w-24 px-4 py-2",
  },
];

const fields = [
  { name: "name", label: "Name", placeholder: "Enter name" },
  { name: "title", label: "Title", placeholder: "Enter title" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add description",
  },
  { name: "fee", label: "Fee", type: "number", placeholder: "Enter fee" },
  {
    name: "banner_image",
    label: "Banner Image",
    type: "file",
  },
  {
    name: "placement_gurantee_course",
    label: "Placement Guarantee",
    type: "checkbox",
    placeholder: "Placement guarantee",
  },
  {
    name: "what_you_learn",
    label: "What You Learn",
    type: "textarea",
    placeholder: "Add learning outcomes",
  },
  {
    name: "requirement",
    label: "Requirement",
    type: "textarea",
    placeholder: "Add requirements",
  },
  {
    name: "detail",
    label: "Detail",
    type: "textarea",
    placeholder: "Add details",
  },
  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    placeholder: "Add reason",
  },
  {
    name: "for_who",
    label: "For Who",
    type: "textarea",
    placeholder: "Who is this for?",
  },
];

const buildFormData = (values: Record<string, string | boolean | File | null>) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }
    formData.append(key, value);
  });
  return formData;
};

export function VideoCategoryPage() {
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
  } = useVideoCategoriesPaginated(10, searchTerm);
  const { data: createVideoCategory } = useVideoCategory();
  const { data: updateVideoCategory } = useUpdateVideoCategory();
  const { data: deleteVideoCategory } = useDeleteVideoCategory();

  const rows = items.map((item, index) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    description: item.description ?? "-",
    fee: item.fee ? String(item.fee) : "-",
    placement_label: item.placement_gurantee_course ? "Yes" : "No",
    placement_gurantee_course: item.placement_gurantee_course,
    banner_image: null,
    what_you_learn: item.what_you_learn ?? "",
    requirement: item.requirement ?? "",
    detail: item.detail ?? "",
    reason: item.reason ?? "",
    for_who: item.for_who ?? "",
    sr: String((page - 1) * perPage + index + 1),
  }));

  return (
    <CrudTable
      title="Video Category"
      addLabel="Add video category"
      searchPlaceholder="Search video category..."
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
        const result = await createVideoCategory(buildFormData(values));
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const result = await updateVideoCategory({
          categoryId: id,
          patchData: buildFormData(patchData),
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteVideoCategory(id);
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
