"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";
import { CourseDetailPage, type CourseDetailData } from "@/components/pages/course-detail-page";
import { getCourseCategoryById, type CourseCategoryDetailItem } from "@/services/course.service";

/** Parse numbered/bullet text (e.g. "1.Item one\r\n2.Item two") into array of strings */
function parseBulletText(text: string | null | undefined): string[] {
  if (!text || !text.trim()) return [];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
  return lines;
}

function transformToCourseDetail(data: CourseCategoryDetailItem | null): CourseDetailData | null {
  if (!data) return null;

  const price = data.fee ? parseFloat(data.fee) : undefined;
  const whatYoullLearn = parseBulletText(data.what_you_learn);
  const requirements = parseBulletText(data.requirement);

  return {
    id: String(data.id),
    title: data.title || data.name,
    description: data.description || "No description available.",
    author: data.owner_name,
    price,
    updatedDate: data.updated_at,
    image: data.image,
    whatYoullLearn: whatYoullLearn.length > 0 ? whatYoullLearn : undefined,
    requirements: requirements.length > 0 ? requirements : undefined,
    descriptionDetail: data.detail || data.description || undefined,
    courseContent: undefined,
  };
}

export default function PublicCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      router.replace("/courses");
      return;
    }

    const fetchCourse = async () => {
      try {
        const data = await getCourseCategoryById(courseId);
        if (!data) {
          router.replace("/courses");
          return;
        }
        const transformed = transformToCourseDetail(data);
        setCourse(transformed);
      } catch (error) {
        console.error("Failed to load course:", error);
        router.replace("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Course not found</p>
            <button
              onClick={() => router.push("/courses")}
              className="text-red-600 hover:underline"
            >
              Back to courses
            </button>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <CourseDetailPage course={course} />
      <LandingFooter />
    </div>
  );
}
