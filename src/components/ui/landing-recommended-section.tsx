"use client";

import { useEffect, useState } from "react";
import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import { getRecommendedCoursesForLanding } from "@/services/recommended-course.service";
import type { CourseCard } from "@/types/course-card";

export function LandingRecommendedSection() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendedCoursesForLanding()
      .then((data) => {
        setCourses(data);
      })
      .catch(() => {
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <LandingCourseCarouselSection
      title="Recommended for you"
      courses={courses}
    />
  );
}
