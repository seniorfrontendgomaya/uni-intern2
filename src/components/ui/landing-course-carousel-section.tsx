"use client";

import { CourseCarousel } from "./course-carousel";
import type { CourseCard } from "@/types/course-card";

interface LandingCourseCarouselSectionProps {
  title: string;
  courses: CourseCard[];
  loading?: boolean;
  skeletonCount?: number;
}

export function LandingCourseCarouselSection({
  title,
  courses,
  loading = false,
  skeletonCount = 3,
}: LandingCourseCarouselSectionProps) {
  const hasCourses = courses.length > 0;
  const showSkeleton = loading;

  if (!showSkeleton && !hasCourses) return null;

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h2>

        {showSkeleton && !hasCourses ? (
          <div className="flex gap-4 overflow-x-hidden pb-4">
            {Array.from({ length: skeletonCount }).map((_, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border bg-white shadow-sm sm:min-w-[300px] sm:max-w-[300px]"
              >
                <div className="h-40 w-full rounded-t-lg bg-gray-100 animate-pulse" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CourseCarousel courses={courses} />
        )}
      </div>
    </section>
  );
}
