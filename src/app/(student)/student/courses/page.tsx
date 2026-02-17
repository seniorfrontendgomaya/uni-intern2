"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CoursesListingContent } from "@/components/pages/courses-listing-content";
import {
  getCourseSubCategoryList,
  getCourseSubCategoryListAll,
  type CourseSubCategoryItem,
} from "@/services/course.service";
import type { CourseCard } from "@/types/course-card";

function mapSubCategoryToCourseCard(item: CourseSubCategoryItem): CourseCard {
  const imageUrl =
    item.course_category_image || "/assets/courses/course-default.jpg";
  return {
    id: String(item.id),
    name: item.name,
    title: item.name,
    provider: item.course_category_name || "—",
    image: imageUrl,
    price: Number(item.course_category_fee) || 0,
  };
}

function StudentCoursesContent() {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("category_id");

  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategoryName(null);

        if (categoryIdParam) {
          const categoryId = Number(categoryIdParam);
          if (!Number.isFinite(categoryId)) {
            setError("Invalid category.");
            return;
          }
          const response = await getCourseSubCategoryList(categoryId);
          setCourses(response.data.map(mapSubCategoryToCourseCard));
          const first = response.data[0];
          if (first) setCategoryName(first.course_category_name);
        } else {
          const response = await getCourseSubCategoryListAll();
          setCourses(response.data.map(mapSubCategoryToCourseCard));
        }
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryIdParam]);

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
        <p className="text-gray-600 mb-8">
          Explore certification and placement guarantee courses.
        </p>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
        <p className="text-gray-600 mb-8">
          Explore certification and placement guarantee courses.
        </p>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
      <p className="text-gray-600 mb-8">
        {categoryIdParam && categoryName
          ? `Subcategories under ${categoryName}.`
          : "Explore certification and placement guarantee courses."}
      </p>
      {courses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No courses available at the moment.</p>
        </div>
      ) : (
        <CoursesListingContent courses={courses} basePath="/student/courses" />
      )}
    </div>
  );
}

function CoursesPageFallback() {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Courses</h1>
      <p className="text-gray-600 mb-8">
        Explore certification and placement guarantee courses.
      </p>
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
    </div>
  );
}

export default function StudentCoursesPage() {
  return (
    <Suspense fallback={<CoursesPageFallback />}>
      <StudentCoursesContent />
    </Suspense>
  );
}
