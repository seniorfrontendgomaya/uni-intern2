"use client";

import { useSearchParams } from "next/navigation";
import { VideoCoursesPage } from "@/components/pages/video-courses-page";

export default function SuperadminVideoCoursesPage() {
  const searchParams = useSearchParams();
  const subCategoryId = searchParams.get("subCategoryId") || "";
  const categoryId = searchParams.get("categoryId") || undefined;

  if (!subCategoryId) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">
          No subcategory selected. Please navigate from the Video Subcategory
          table to manage its courses.
        </p>
      </main>
    );
  }

  return (
    <VideoCoursesPage subCategoryId={subCategoryId} categoryId={categoryId} />
  );
}

