"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { CrudTable } from "@/components/ui/crud-table";
import {
  useDeleteUniversity,
  useUniversitiesPaginated,
  useUniversity,
  useUpdateUniversity,
} from "@/hooks/useUniversity";

const columns = [
  {
    key: "sr",
    label: "Sr No",
    headerClassName: "w-20 px-4 py-2 text-center",
    cellClassName: "w-16 px-4 py-2 text-center",
  },
  {
    key: "logo",
    label: "Logo",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "name",
    label: "Name",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2 font-medium",
  },
  {
    key: "location",
    label: "Location",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "established_year",
    label: "Established Year",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "mobile",
    label: "Mobile",
    headerClassName: "px-4 py-2",
    cellClassName: "px-4 py-2",
  },
  {
    key: "email",
    label: "Email",
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
  { name: "name", label: "Name", placeholder: "Enter university name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add description",
  },
  {
    name: "university_location",
    label: "Location",
    placeholder: "Enter university location",
  },
  {
    name: "established_year",
    label: "Established Year",
    type: "number",
    placeholder: "e.g. 1999",
    min: 1800,
    max: 2080,
  },
  {
    name: "website",
    label: "Website",
    placeholder: "https://example.com",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email",
  },
  {
    name: "mobile",
    label: "Mobile",
    placeholder: "Enter mobile number",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Set password (optional on update)",
  },
  {
    name: "logo",
    label: "Logo",
    type: "file",
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

export function UniversityPage() {
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
  } = useUniversitiesPaginated(10);
  const { data: createUniversity } = useUniversity();
  const { data: updateUniversity } = useUpdateUniversity();
  const { data: deleteUniversity } = useDeleteUniversity();

  const rows = items.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    logo: item.logo ? (
      <div className="flex items-center">
        <img
          src={item.logo}
          alt={item.name ?? "University logo"}
          className="h-8 w-8 rounded-full object-cover border"
        />
      </div>
    ) : (
      "-"
    ),
    name: item.name,
    location: item.university_location ?? "-",
    established_year: item.established_year ?? "-",
    mobile: item.mobile ?? "-",
    email: item.email ?? "-",
    description: item.description ?? "",
    university_location: item.university_location ?? "",
    website: item.website ?? "",
    password: "",
  }));

  return (
    <CrudTable
      title="University"
      addLabel="Add university"
      searchPlaceholder="Search university..."
      columns={columns}
      rows={rows}
      fields={fields}
      loading={loading}
      modalPanelClassName="w-[90vw] !max-w-4xl"
      modalBodyClassName="max-h-[70vh] overflow-y-auto pr-2"
      extraActions={(row) => (
        <Link
          href={`/superadmin/universities/${row.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-brand/40 text-brand transition hover:bg-brand/10"
          aria-label="View"
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>
      )}
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          // API does not support search; this only updates the input UI.
        },
      }}
      onCreate={async (values) => {
        const payloadValues: Record<string, string | boolean | File | null> = {
          ...values,
          user_type: "UNIVERSITY",
        };
        const result = await createUniversity(buildFormData(payloadValues));
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const entries = Object.entries(patchData).filter(([key, value]) => {
          if (key === "password" && (!value || value === "")) return false;
          return true;
        });

        const hasLogo =
          patchData.logo && patchData.logo instanceof File;

        if (hasLogo) {
          const formValues: Record<string, string | boolean | File | null> =
            Object.fromEntries(entries);
          const formData = buildFormData(formValues);
          const result = await updateUniversity({
            universityId: id,
            patchData: formData,
          });
          if (result.ok) refresh();
          return { ok: result.ok, message: result.data?.message };
        }

        const jsonPatch: Record<string, string | boolean | number> = {};
        entries.forEach(([key, value]) => {
          if (value === null || value === undefined || value instanceof File) {
            return;
          }

          if (key === "established_year") {
            const raw = String(value).trim();
            if (!raw) {
              return;
            }
            const year = Number.parseInt(raw, 10);
            if (!Number.isFinite(year)) return;
            const clamped = Math.min(2080, Math.max(1800, year));
            jsonPatch.established_year = clamped;
            return;
          }

          if (typeof value === "boolean") {
            jsonPatch[key] = value;
          } else {
            jsonPatch[key] = String(value);
          }
        });

        const result = await updateUniversity({
          universityId: id,
          patchData: jsonPatch,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteUniversity(id);
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

