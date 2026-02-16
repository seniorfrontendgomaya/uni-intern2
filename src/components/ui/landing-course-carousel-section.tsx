"use client";

import { CourseCarousel } from "./course-carousel";
import type { CourseCard } from "@/types/course-card";

interface LandingCourseCarouselSectionProps {
  title: string;
  courses: CourseCard[];
}

export function LandingCourseCarouselSection({
  title,
  courses,
}: LandingCourseCarouselSectionProps) {
  if (!courses.length) return null;

  return (
    <section className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h2>
        <CourseCarousel courses={courses} />
      </div>
    </section>
  );
}
