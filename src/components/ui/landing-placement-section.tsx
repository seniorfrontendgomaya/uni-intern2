"use client";

import { useEffect, useState } from "react";
import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import { getPlacementCoursesForLanding } from "@/services/recommended-course.service";
import type { CourseCard } from "@/types/course-card";

export function LandingPlacementSection() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacementCoursesForLanding()
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
      title="Placement guarantee courses"
      courses={courses}
    />
  );
}
