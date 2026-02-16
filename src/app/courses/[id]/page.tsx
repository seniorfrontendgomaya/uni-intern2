"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";
import { CourseDetailPage, type CourseDetailData, type CourseModule } from "@/components/pages/course-detail-page";
import {
  getCourseDetailList,
  type CourseDetailListResponse,
} from "@/services/course.service";

function parseBulletText(text: string | null | undefined): string[] {
  if (!text || !text.trim()) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
}

/** Build CourseDetailData from course_detail_list response using course_sub_category */
function transformFromCourseSubCategory(res: CourseDetailListResponse): CourseDetailData | null {
  const sub = res.course_sub_category;
  if (!sub?.course_category) return null;

  const cat = sub.course_category;
  const price = cat.fee != null ? Number(cat.fee) : undefined;
  const whatYoullLearn = parseBulletText(cat.what_you_learn);
  const requirements = parseBulletText(cat.requirement);

  const courseContent: CourseModule[] | undefined = Array.isArray(res.data) && res.data.length > 0
    ? [
        {
          id: "videos",
          title: sub.name,
          videoCount: res.data.length,
          videos: res.data.map((v) => ({
            id: String(v.id),
            title: v.name,
            duration: v.duration ? `${v.duration} min` : undefined,
          })),
        },
      ]
    : undefined;

  return {
    id: String(cat.id),
    title: cat.title || cat.name,
    description: cat.description || "No description available.",
    author: cat.owner_name,
    price,
    updatedDate: cat.updated_at,
    image: cat.image ?? null,
    whatYoullLearn: whatYoullLearn.length > 0 ? whatYoullLearn : undefined,
    requirements: requirements.length > 0 ? requirements : undefined,
    descriptionDetail: cat.detail || cat.description || undefined,
    courseContent,
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

    const subCategoryId = Number(courseId);
    if (!Number.isFinite(subCategoryId)) {
      router.replace("/courses");
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await getCourseDetailList(subCategoryId);
        const transformed = transformFromCourseSubCategory(res);
        if (!transformed) {
          router.replace("/courses");
          return;
        }
        setCourse(transformed);
      } catch (error) {
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
