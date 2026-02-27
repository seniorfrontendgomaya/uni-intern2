"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { CrudTable, type Field } from "@/components/ui/crud-table";
import {
  useDeleteVideoSubcategory,
  useUpdateVideoSubcategory,
  useVideoSubcategoriesPaginated,
  useVideoSubcategory,
} from "@/hooks/useVideoSubcategory";
import { getVideoCourses } from "@/services/video-course.service";

const truncate30 = (s: string | null | undefined) =>
  s == null || s === "" ? "-" : (String(s).length > 30 ? `${String(s).slice(0, 30)}…` : String(s));

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
    headerClassName: "max-w-[30ch] px-4 py-2",
    cellClassName: "max-w-[30ch] truncate px-4 py-2 font-medium",
  },
  {
    key: "description",
    label: "Description",
    headerClassName: "max-w-[30ch] px-4 py-2",
    cellClassName: "max-w-[30ch] truncate px-4 py-2 text-muted-foreground",
  },
  {
    key: "actions",
    label: "Actions",
    headerClassName: "w-24 px-4 py-2 text-center",
    cellClassName: "w-24 px-4 py-2",
  },
];

const fields: Field[] = [
  { name: "name", label: "Name", placeholder: "Enter subcategory name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add a short description",
  },
];

type VideoSubcategoryPageProps = {
  categoryId: string;
  /** Base path for links (e.g. /superadmin or /company). Defaults to /superadmin. */
  basePath?: string;
};

export function VideoSubcategoryPage({ categoryId, basePath = "/superadmin" }: VideoSubcategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [categoryTitle, setCategoryTitle] = useState<string | null>(null);
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
  } = useVideoSubcategoriesPaginated(10, categoryId);
  const { data: createSubcategory } = useVideoSubcategory();
  const { data: updateSubcategory } = useUpdateVideoSubcategory();
  const { data: deleteSubcategory } = useDeleteVideoSubcategory();

  useEffect(() => {
    if (!categoryId) return;
    getVideoCourses(1, 1000)
      .then((res) => {
        const match = res.data.find(
          (item) => String(item.id) === String(categoryId)
        );
        if (match) {
          setCategoryName(match.name);
          setCategoryTitle(match.title || match.name);
        }
      })
      .catch(() => {
        // ignore error, fallback to generic label
      });
  }, [categoryId]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredItems.map((item, index) => ({
    id: item.id,
    sr: String((page - 1) * perPage + index + 1),
    name: truncate30(item.name),
    description: truncate30(item.description),
  }));

  return (
    <CrudTable
      title={
        <div className="flex items-center gap-2">
          <Link
            href={`${basePath}/video-category`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-lg font-semibold text-foreground">
            {categoryTitle || "Video Subcategory"}
          </span>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-2">
          <Link href={`${basePath}/video-category`} className="hover:underline">
            Video Category
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">
            {categoryName || "Subcategory"}
          </span>
        </div>
      }
        addLabel="Add subcategory"
        searchPlaceholder="Search subcategory..."
        columns={columns}
        rows={rows}
        fields={fields}
        loading={loading}
      extraActions={(row) => (
        <Link
          href={`${basePath}/video-courses?subCategoryId=${row.id}&categoryId=${categoryId}`}
          className="inline-flex h-8 items-center justify-center rounded-xl border border-brand/40 px-2 text-xs font-medium text-brand transition hover:bg-brand/10"
        >
          Courses
        </Link>
      )}
      searchProps={{
        value: searchTerm,
        onChange: (event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        },
      }}
      onCreate={async (values) => {
        const result = await createSubcategory({
          name: String(values.name ?? ""),
          description: String(values.description ?? ""),
          course_category: categoryId,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onUpdate={async (id, patchData) => {
        const result = await updateSubcategory({
          subcategoryId: id,
          patchData,
        });
        if (result.ok) refresh();
        return { ok: result.ok, message: result.data?.message };
      }}
      onDelete={async (id) => {
        const result = await deleteSubcategory(id);
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

