"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { CourseCard } from "@/types/course-card";

interface CourseCarouselProps {
  courses: CourseCard[];
}

export function CourseCarousel({ courses }: CourseCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setScrollPosition(scrollLeft);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check scrollability on mount and when content loads
    checkScrollability();

    // Check on scroll
    container.addEventListener("scroll", checkScrollability);

    // Check on resize (handles window resize and content size changes)
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });
    resizeObserver.observe(container);

    // Also check after a short delay to catch async image loading
    const timeoutId = setTimeout(checkScrollability, 100);

    return () => {
      container.removeEventListener("scroll", checkScrollability);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [courses]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector("article")?.offsetWidth ?? 0;
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  if (!courses.length) return null;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Course Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        onScroll={checkScrollability}
      >
        {courses.map((course) => (
          <article
            key={course.id}
            className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border bg-white shadow-sm transition hover:shadow-md sm:min-w-[300px] sm:max-w-[300px]"
          >
            {/* Course Image */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, 300px"
              />
            </div>

            {/* Course Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                {course.title}
              </h3>

              {/* Provider */}
              <p className="mt-1 text-xs text-gray-600">{course.provider}</p>

              {/* Tag and Rating Row */}
              <div className="mt-2 flex items-center gap-2">
                {course.tag && (
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                      course.tag.variant === "bestseller"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {course.tag.label}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-gray-900">
                    {course.rating.stars}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({course.rating.count} ratings)
                  </span>
                </div>
              </div>

              {/* Price */}
              <p className="mt-3 text-lg font-bold text-gray-900">
                ₹{course.price.toLocaleString()}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
