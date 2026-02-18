"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCourseMegamenuData } from "@/services/course-megamenu.service";
import type { TopCourseItem } from "@/services/course.service";

const OPEN_LOGIN_MODAL_EVENT = "open-login-modal";

export interface CoursesMegaMenuProps {
  /** Base path for courses (e.g. "/courses" or "/student/courses") */
  basePath?: string;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
}

function buildCourseHref(basePath: string, categoryId: number) {
  const path = basePath.replace(/\/$/, "");
  return `${path}?category_id=${categoryId}`;
}

export function CoursesMegaMenu({
  basePath = "/student/courses",
  onClose,
  isOpen = true,
  className = "",
}: CoursesMegaMenuProps) {
  const [certificationCourses, setCertificationCourses] = useState<TopCourseItem[]>([]);
  const [placementCourses, setPlacementCourses] = useState<TopCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseMegamenuData();
        if (!cancelled) {
          setCertificationCourses(data.certification);
          setPlacementCourses(data.placement);
        }
      } catch {
        if (!cancelled) {
          setCertificationCourses([]);
          setPlacementCourses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const viewMoreHref = `${basePath.replace(/\/$/, "")}?view=all`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      e.preventDefault();
      window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT));
      return;
    }
    onClose?.();
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden ${className}`}
      style={{ minWidth: "560px", width: "560px" }}
    >
      <div className="flex">
        {/* Left: Certification Courses */}
        <div className="flex-1 p-5 border-r border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Certification Courses
          </h3>
          {loading ? (
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          ) : certificationCourses.length > 0 ? (
            <nav className="flex flex-col gap-0.5 mb-4">
              {certificationCourses.map((course) => (
                <Link
                  key={course.id}
                  href={buildCourseHref(basePath, course.id)}
                  onClick={handleLinkClick}
                  className="rounded-md px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100"
                >
                  {course.name}
                </Link>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-gray-500">No courses available</p>
          )}
        </div>

        {/* Right: Placement Guarantee Courses */}
        <div className="flex-1 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Placement Guarantee Courses
          </h3>
          {loading ? (
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          ) : placementCourses.length > 0 ? (
            <nav className="flex flex-col gap-0.5">
              {placementCourses.map((course) => (
                <Link
                  key={course.id}
                  href={buildCourseHref(basePath, course.id)}
                  onClick={handleLinkClick}
                  className="rounded-md px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100"
                >
                  {course.name}
                </Link>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-gray-500">No courses available</p>
          )}
        </div>
      </div>
    </div>
  );
}
