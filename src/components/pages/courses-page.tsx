"use client";

import { CrudTable } from "@/components/ui/crud-table";
import { useCoursesPaginated } from "@/hooks/useCourse";

const columns = [
  {
    key: "sr",
    label: "Sr",
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
    key: "duration",
    label: "Duration",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "fees",
    label: "Fees",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "placement_gurantee",
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

const fields: Array<{
  name: string;
  label: string;
  type?: "text" | "number" | "textarea";
  placeholder?: string;
}> = [
  { name: "name", label: "Name", placeholder: "Enter course name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
  { name: "duration", label: "Duration", placeholder: "e.g. 6 weeks" },
  { name: "fees", label: "Fees", placeholder: "e.g. $250" },
  {
    name: "placement_gurantee",
    label: "Placement Guarantee",
    placeholder: "Yes/No",
  },
];

export function CoursesPage() {
  const {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
  } = useCoursesPaginated(10);

  const rows = items.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    name: item.name,
    description: item.description ?? "-",
    duration: item.duration ? String(item.duration) : "-",
    fees: item.fees ? String(item.fees) : "-",
    placement_gurantee:
      item.placement_gurantee === null || item.placement_gurantee === undefined
        ? "-"
        : String(item.placement_gurantee),
  }));

  return (
    <CrudTable
      title="Courses"
      addLabel="Add course"
      searchPlaceholder="Search courses..."
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
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
