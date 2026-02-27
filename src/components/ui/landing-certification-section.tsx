"use client";

import { useEffect, useState } from "react";
import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import { getCertificationCoursesForLanding } from "@/services/recommended-course.service";
import type { CourseCard } from "@/types/course-card";

export function LandingCertificationSection() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertificationCoursesForLanding()
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

  return (
    <LandingCourseCarouselSection
      title="Certification courses for you"
      courses={courses}
      loading={loading}
      skeletonCount={3}
    />
  );
}
