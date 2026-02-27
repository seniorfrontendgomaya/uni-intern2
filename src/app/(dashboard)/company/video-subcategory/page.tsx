"use client";

import { useSearchParams } from "next/navigation";
import { VideoSubcategoryPage } from "@/components/pages/video-subcategory-page";

export default function CompanyVideoSubcategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";

  if (!categoryId) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">
          No video category selected. Please navigate from the Video Category
          table to manage its subcategories.
        </p>
      </main>
    );
  }

  return <VideoSubcategoryPage categoryId={categoryId} basePath="/company" />;
}
