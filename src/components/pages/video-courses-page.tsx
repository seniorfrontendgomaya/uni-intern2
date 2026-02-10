"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  useVideoCourseDetailCreate,
  useVideoCourseDetailDelete,
  useVideoCourseDetailUpdate,
  useVideoCourseDetails,
} from "@/hooks/useVideoCourseDetail";
import { getVideoSubcategories } from "@/services/video-subcategory.service";
import { getVideoCourses } from "@/services/video-course.service";

type VideoCoursesPageProps = {
  subCategoryId: string;
  categoryId?: string;
};

export function VideoCoursesPage({
  subCategoryId,
  categoryId,
}: VideoCoursesPageProps) {
  const { items, loading, refresh } = useVideoCourseDetails(subCategoryId);
  const { create } = useVideoCourseDetailCreate();
  const { update } = useVideoCourseDetailUpdate();
  const { destroy } = useVideoCourseDetailDelete();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const backHref = useMemo(() => {
    if (categoryId) {
      return `/superadmin/video-subcategory?categoryId=${categoryId}`;
    }
    return "/superadmin/video-category";
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    getVideoSubcategories(1, 1000, categoryId)
      .then((res) => {
        const match = res.data.find(
          (item) => String(item.id) === String(subCategoryId)
        );
        if (match) {
          setSubcategoryName(match.name);
        }
      })
      .catch(() => {
        // ignore, fall back to generic labels
      });
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    if (!categoryId) return;
    getVideoCourses(1, 1000)
      .then((res) => {
        const match = res.data.find(
          (item) => String(item.id) === String(categoryId)
        );
        if (match) {
          setCategoryName(match.name);
        }
      })
      .catch(() => {
        // ignore, fallback to generic label
      });
  }, [categoryId]);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setDuration("");
    setVideoFile(null);
    setVideoUrl(null);
    setModalOpen(true);
  };

  const openEdit = (id: number) => {
    const course = items.find((item) => item.id === id);
    if (!course) return;
    setEditingId(String(id));
    setName(course.name);
    setDescription(course.description ?? "");
    setDuration(course.duration ?? "");
    setVideoFile(null);
    setVideoUrl(course.video ?? null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!editingId) {
        // create
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("course_sub_category", subCategoryId);
        if (videoFile) {
          formData.append("video", videoFile);
        }
        const res = await create(formData);
        if (!res.ok) return;
      } else {
        const hasVideo = Boolean(videoFile);
        if (hasVideo) {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("description", description);
          formData.append("duration", duration);
          formData.append("course_sub_category", subCategoryId);
          if (videoFile) {
            formData.append("video", videoFile);
          }
          const res = await update({
            courseId: editingId,
            patchData: formData,
          });
          if (!res.ok) return;
        } else {
          const jsonPatch: Record<string, string> = {
            name,
            description,
            duration,
            course_sub_category: subCategoryId,
          };
          const res = await update({
            courseId: editingId,
            patchData: jsonPatch,
          });
          if (!res.ok) return;
        }
      }
      setModalOpen(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await destroy(String(id));
    if (res.ok) {
      await refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h2 className="text-lg font-semibold text-foreground">
              Courses for : {subcategoryName ? `${subcategoryName}` : "Video Courses"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href="/superadmin/video-category"
              className="hover:underline"
            >
              Video Category
            </Link>
            <span>/</span>
            <Link
              href={`/superadmin/video-subcategory?categoryId=${categoryId ?? ""}`}
              className="hover:underline"
            >
              {categoryName || "Category"}
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">
              {subcategoryName || "Subcategory"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-full bg-brand px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90"
          onClick={openCreate}
        >
          Add course
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No courses found for this subcategory.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">
                  {course.name}
                </h3>
                <p className="text-sm">
                  <span className="font-semibold">Description:</span>{" "}
                  {course.description || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Duration:</span>{" "}
                  {course.duration || "-"}
                </p>
                {course.video ? (
                  <div className="mt-2 overflow-hidden rounded-xl border bg-black">
                    <video
                      src={course.video}
                      controls
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex h-40 items-center justify-center rounded-xl border bg-black text-xs text-muted-foreground">
                    No video
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600"
                  onClick={() => openEdit(course.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit course" : "Add course"}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-9 rounded-full border px-4 text-xs font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 rounded-full bg-brand px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
        panelClassName="w-[90vw] !max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              type="text"
              className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="mt-2 min-h-[72px] w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Duration
            </label>
            <input
              type="text"
              className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              className="mt-2 block w-full text-sm text-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-xs file:font-medium file:text-brand hover:file:bg-brand/20"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setVideoFile(file);
              }}
            />
            {editingId && videoUrl && !videoFile ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Existing video will be kept if no new file is chosen.
              </p>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}

