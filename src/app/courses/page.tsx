"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";
import { CoursesListingContent } from "@/components/pages/courses-listing-content";
import { getCourseCategoryList, type CourseCategoryItem } from "@/services/course.service";
import type { CourseCard } from "@/types/course-card";

function mapToCourseCard(item: CourseCategoryItem): CourseCard {
  const price = item.fee ? parseFloat(item.fee) : 0;
  const imageUrl = item.image || "/assets/courses/course-default.jpg";

  return {
    id: String(item.id),
    name: item.name,
    title: item.title || item.name,
    provider: item.owner_name || "Unknown",
    image: imageUrl,
    tag: item.is_placement_gurantee
      ? { label: "Placement Guarantee", variant: "bestseller" }
      : undefined,
    price,
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCourseCategoryList();
        const mappedCourses = response.data.map(mapToCourseCard);
        setCourses(mappedCourses);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
        <p className="text-gray-600 mb-8">
          Explore certification and placement guarantee courses.
        </p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-40 w-full bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No courses available at the moment.</p>
          </div>
        ) : (
          <CoursesListingContent courses={courses} basePath="/courses" />
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
