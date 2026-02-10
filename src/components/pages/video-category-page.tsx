"use client";

import Link from "next/link";
import { useState } from "react";
import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useDeleteVideoCourse,
  useUpdateVideoCourse,
  useVideoCoursesPaginated,
  useVideoCourse,
} from "@/hooks/useVideoCourse";

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
      "px-4 py-2 text-muted-foreground truncate max-w-[360px]",
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

const fields: Field[] = [
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
    name: "image",
    label: "Banner Image",
    type: "file",
  },
  {
    name: "is_placement_gurantee",
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
  } = useVideoCoursesPaginated(10);
  const { data: createVideoCourse } = useVideoCourse();
  const { data: updateVideoCourse } = useUpdateVideoCourse();
  const { data: deleteVideoCourse } = useDeleteVideoCourse();

  const rows = items.map((item, index) => {
    const fullDescription = item.description ?? "-";
    return {
      id: item.id,
      name: item.name,
      title: item.title,
      description: (
        <span className="block truncate" title={fullDescription}>
          {fullDescription}
        </span>
      ),
      fee: item.fee != null ? String(item.fee) : "-",
      placement_label: item.is_placement_gurantee ? "Yes" : "No",
      is_placement_gurantee: item.is_placement_gurantee,
      image: null,
      what_you_learn: item.what_you_learn ?? "",
      requirement: item.requirement ?? "",
      detail: item.detail ?? "",
      reason: item.reason ?? "",
      for_who: item.for_who ?? "",
      sr: String((page - 1) * perPage + index + 1),
    };
  });

  return (
    <CrudTable
      title="Video Category"
      addLabel="Add video category"
      searchPlaceholder="Search video category..."
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
      extraActions={(row) => (
        <>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-xl border border-brand/40 px-2 text-xs font-medium text-brand transition hover:bg-brand/10"
            onClick={() => {
              // Placeholder: wire up detailed view if needed
              // eslint-disable-next-line no-console
              console.log("View video category", row.id);
            }}
          >
            View
          </button>
          <Link
            href={`/superadmin/video-subcategory?categoryId=${row.id}`}
            className="inline-flex h-8 items-center justify-center rounded-xl border border-brand/40 px-2 text-xs font-medium text-brand transition hover:bg-brand/10"
          >
            Subcategory
          </Link>
        </>
      )}
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        },
      }}
      onCreate={async (values) => {
        const result = await createVideoCourse(buildFormData(values));
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const entries = Object.entries(patchData);

        const hasImage = patchData.image && patchData.image instanceof File;

        if (hasImage) {
          const formValues: Record<string, string | boolean | File | null> =
            Object.fromEntries(entries);
          const formData = buildFormData(formValues);
          const result = await updateVideoCourse({
            categoryId: id,
            patchData: formData,
          });
          if (result.ok) refresh();
          return { ok: result.ok, message: result.data?.message };
        }

        const jsonPatch: Record<string, string | boolean> = {};
        entries.forEach(([key, value]) => {
          if (value === null || value === undefined || value instanceof File) {
            return;
          }
          if (typeof value === "boolean") {
            jsonPatch[key] = value;
          } else {
            jsonPatch[key] = String(value);
          }
        });

        const result = await updateVideoCourse({
          categoryId: id,
          patchData: jsonPatch,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteVideoCourse(id);
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
