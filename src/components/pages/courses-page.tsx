"use client";

import { useState } from "react";
import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useCoursesPaginated,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/useCourse";

const columns = [
  {
    key: "sr",
    label: "Sr",
    headerClassName: "w-20 px-4 py-2 text-center",
    cellClassName: "w-16 px-4 py-2 text-center",
  },
  {
    key: "image",
    label: "Image",
    headerClassName: "w-24 px-4 py-2 text-center",
    cellClassName: "w-24 px-4 py-2 text-center",
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
  { name: "name", label: "Name", placeholder: "Enter course name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
  {
    name: "image",
    label: "Image",
    type: "file",
  },
  {
    name: "duration",
    label: "Duration (months)",
    type: "number",
    placeholder: "e.g. 6",
    min: 0,
  },
  {
    name: "fees",
    label: "Fees",
    type: "number",
    placeholder: "e.g. 25000",
    min: 0,
  },
  {
    name: "placement_gurantee",
    label: "Placement Guarantee",
    type: "checkbox",
  },
];

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: createCourse } = useCreateCourse();
  const { data: updateCourse } = useUpdateCourse();
  const { data: deleteCourse } = useDeleteCourse();

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
  } = useCoursesPaginated(10, searchTerm);

  const rows = items.map((item, index) => {
    const value = item.placement_gurantee;
    const normalized =
      value === true ||
      value === "true" ||
      value === "True" ||
      value === "YES" ||
      value === "Yes";

    return {
      id: item.id,
      sr: String((page - 1) * perPage + index + 1),
      image: item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-12 w-12 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
          No Image
        </div>
      ),
      image_url: item.image, // Store URL for preview in update modal
      name: item.name,
      description: item.description ?? "-",
      duration: item.duration ? String(item.duration) : "-",
      fees: item.fees ? String(item.fees) : "-",
      placement_label: normalized ? "Yes" : "No",
      placement_gurantee: normalized,
    };
  });

  return (
    <CrudTable
      title="Courses"
      addLabel="Add course"
      searchPlaceholder="Search courses..."
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        },
      }}
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
      onCreate={async (values) => {
        const rawDuration = values.duration;
        const rawFees = values.fees;
        const imageFile = values.image instanceof File ? values.image : null;

        const durationNumber =
          rawDuration !== undefined &&
          rawDuration !== null &&
          String(rawDuration).trim() !== ""
            ? Math.max(0, Number(rawDuration))
            : undefined;

        const feesNumber =
          rawFees !== undefined &&
          rawFees !== null &&
          String(rawFees).trim() !== ""
            ? Math.max(0, Number(rawFees))
            : undefined;

        // Use FormData if image is present, otherwise use JSON
        if (imageFile) {
          const formData = new FormData();
          formData.append("name", String(values.name ?? "").trim());
          formData.append("description", String(values.description ?? "").trim());
          if (durationNumber !== undefined && !Number.isNaN(durationNumber)) {
            formData.append("duration", String(durationNumber));
          }
          if (feesNumber !== undefined && !Number.isNaN(feesNumber)) {
            formData.append("fees", String(feesNumber));
          }
          formData.append("placement_gurantee", String(Boolean(values.placement_gurantee)));
          formData.append("image", imageFile);

          const result = await createCourse(formData);
          if (result.ok) {
            await refresh();
          }

          return {
            ok: result.ok,
            message:
              (result.data as any)?.message || "Course created successfully",
          };
        }

        const payload = {
          name: String(values.name ?? "").trim(),
          description: String(values.description ?? "").trim(),
          duration:
            durationNumber !== undefined && !Number.isNaN(durationNumber)
              ? String(durationNumber)
              : "",
          fees:
            feesNumber !== undefined && !Number.isNaN(feesNumber)
              ? String(feesNumber)
              : "",
          placement_gurantee: Boolean(values.placement_gurantee),
        };

        const result = await createCourse(payload);
        if (result.ok) {
          await refresh();
        }

        return {
          ok: result.ok,
          message:
            (result.data as any)?.message || "Course created successfully",
        };
      }}
      onUpdate={async (id, patchData) => {
        const imageFile = patchData.image instanceof File ? patchData.image : null;
        
        // Use FormData if image is present
        if (imageFile) {
          const formData = new FormData();
          
          if (patchData.name !== undefined) {
            formData.append("name", String(patchData.name ?? "").trim());
          }
          if (patchData.description !== undefined) {
            formData.append("description", String(patchData.description ?? "").trim());
          }
          if (patchData.duration !== undefined) {
            const value = String(patchData.duration ?? "").trim();
            if (value === "") {
              formData.append("duration", "");
            } else {
              const num = Math.max(0, Number(value));
              formData.append("duration", !Number.isNaN(num) ? String(num) : "");
            }
          }
          if (patchData.fees !== undefined) {
            const value = String(patchData.fees ?? "").trim();
            if (value === "") {
              formData.append("fees", "");
            } else {
              const num = Math.max(0, Number(value));
              formData.append("fees", !Number.isNaN(num) ? String(num) : "");
            }
          }
          if (patchData.placement_gurantee !== undefined) {
            formData.append("placement_gurantee", String(Boolean(patchData.placement_gurantee)));
          }
          formData.append("image", imageFile);

          const result = await updateCourse({
            courseId: id,
            patchData: formData,
          });

          if (result.ok) {
            await refresh();
          }

          return {
            ok: result.ok,
            message:
              (result.data as any)?.message || "Course updated successfully",
          };
        }

        // Use JSON if no image
        const patch: any = {};

        if (patchData.name !== undefined) {
          patch.name = String(patchData.name ?? "").trim();
        }
        if (patchData.description !== undefined) {
          patch.description = String(patchData.description ?? "").trim();
        }
        if (patchData.duration !== undefined) {
          const value = String(patchData.duration ?? "").trim();
          if (value === "") {
            patch.duration = "";
          } else {
            const num = Math.max(0, Number(value));
            patch.duration = !Number.isNaN(num) ? String(num) : "";
          }
        }
        if (patchData.fees !== undefined) {
          const value = String(patchData.fees ?? "").trim();
          if (value === "") {
            patch.fees = "";
          } else {
            const num = Math.max(0, Number(value));
            patch.fees = !Number.isNaN(num) ? String(num) : "";
          }
        }
        if (patchData.placement_gurantee !== undefined) {
          patch.placement_gurantee = Boolean(patchData.placement_gurantee);
        }

        const result = await updateCourse({
          courseId: id,
          patchData: patch,
        });

        if (result.ok) {
          await refresh();
        }

        return {
          ok: result.ok,
          message:
            (result.data as any)?.message || "Course updated successfully",
        };
      }}
      onDelete={async (id) => {
        const result = await deleteCourse(id);
        if (result.ok) {
          await refresh();
        }

        return {
          ok: result.ok,
          message:
            (result.data as any)?.message || "Course deleted successfully",
        };
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
