"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types/course-card";

interface CourseCardProps {
  course: CourseCardType;
  basePath?: string;
}

export function CourseCard({ course, basePath = "/student/courses" }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(course.image || "/assets/courses/course-default.jpg");

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc("/assets/courses/course-default.jpg");
    }
  };

  return (
    <Link href={`${basePath}/${course.id}`} className="h-full">
      <article className="h-full flex flex-col rounded-lg border bg-white shadow-sm transition hover:shadow-md overflow-hidden cursor-pointer">
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-100">
          {imageError || !imageSrc || imageSrc === "/assets/courses/course-default.jpg" ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <div className="flex flex-col items-center justify-center gap-2 text-orange-400">
                <BookOpen className="h-12 w-12" />
                <span className="text-xs font-medium text-orange-500">Course Image</span>
              </div>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={handleImageError}
            />
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-gray-600">{course.provider}</p>
          {course.tag && (
            <div className="mt-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                  course.tag.variant === "bestseller"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {course.tag.label}
              </span>
            </div>
          )}
          <p className="mt-auto pt-3 text-lg font-bold text-gray-900">
            ₹{course.price.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}
