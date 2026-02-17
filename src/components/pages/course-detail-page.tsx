"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Calendar, DollarSign, BookOpen } from "lucide-react";
import { apiBaseUrlNoSlash } from "@/lib/api";

export interface CourseDetailData {
  id: string;
  title: string;
  description: string;
  author?: string;
  price?: number;
  updatedDate?: string;
  image?: string | null;
  whatYoullLearn?: string[];
  courseContent?: CourseModule[];
  requirements?: string[];
  /** Optional long-form text for the Description section (e.g. API `detail` field) */
  descriptionDetail?: string;
  rating?: {
    stars: number;
    count: number;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  videoCount: number;
  videos?: Array<{ id: string; title: string; duration?: string; url?: string | null }>;
}

interface CourseDetailPageProps {
  course: CourseDetailData;
}

/** Use same-origin proxy for video so it loads without CORS issues */
function getVideoSrc(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const s = url.trim();
  const mediaPrefix = `${apiBaseUrlNoSlash}/media/`;
  if (s.startsWith(mediaPrefix)) {
    return `/api/media/${s.slice(mediaPrefix.length)}`;
  }
  return s;
}

export function CourseDetailPage({ course }: CourseDetailPageProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const toggleAllModules = () => {
    if (allExpanded) {
      setExpandedModules(new Set());
    } else {
      const allIds = new Set(course.courseContent?.map((m) => m.id) ?? []);
      setExpandedModules(allIds);
    }
    setAllExpanded(!allExpanded);
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Free";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently updated";
    try {
      const d = new Date(dateStr);
      return `Updated ${d.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })}`;
    } catch {
      return dateStr;
    }
  };

  const descriptionText = course.descriptionDetail ?? course.description;
  const descriptionParagraphs = descriptionText
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white -mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
      {/* Hero Section - Full width, mobile friendly */}
      <section className="bg-orange-500 text-white px-4 pt-6 pb-6 sm:px-6 sm:pb-5 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
            {/* Left Side - Text Content */}
            <div className="flex-1 min-w-0 w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight break-words">
                {course.title}
              </h1>
              <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed opacity-95 break-words">
                {course.description.split(/\r?\n/).map((para, i) => (
                  para.trim() && <p key={i}>{para.trim()}</p>
                ))}
              </div>
              {course.author && (
                <p className="mt-2 text-[10px] sm:text-xs opacity-90">Created by {course.author}</p>
              )}
            </div>

            {/* Right Side - Course Image */}
            <div className="w-full max-w-full lg:w-80 lg:shrink-0">
              {course.image && !imageError ? (
                <div className="relative h-40 sm:h-64 lg:h-60 w-full rounded-lg overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw,280px"
                    onError={() => setImageError(true)}
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative h-40 sm:h-64 lg:h-60 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                  <div className="flex flex-col items-center justify-center gap-2 text-orange-400">
                    <BookOpen className="h-16 w-16" />
                    <span className="text-xs font-medium text-orange-500">Course Image</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections - White Background */}
      <div className="w-full bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Content Sections */}
          {/* What you'll learn - first section */}
          {course.whatYoullLearn && course.whatYoullLearn.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground sm:text-xl mb-4">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.whatYoullLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 min-w-0">
                    <span className="text-sm font-medium text-foreground shrink-0">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground break-words">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* This course includes */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground sm:text-xl mb-4">
              This course includes:
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {course.price != null && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm min-h-[44px]">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                </div>
              )}
              {course.updatedDate && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm min-h-[44px]">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {formatDate(course.updatedDate)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Course content */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                Course content
              </h2>
              {course.courseContent && course.courseContent.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAllModules}
                  className="text-sm font-medium text-primary hover:underline min-h-[44px] sm:min-h-0 flex items-center justify-start sm:justify-end"
                >
                  {allExpanded ? "Collapse all sections" : "Expand all sections"}
                </button>
              )}
            </div>
            {course.courseContent && course.courseContent.length > 0 ? (
              <div className="space-y-0 border border-border rounded-lg overflow-hidden bg-card">
                {course.courseContent.map((module) => {
                  const isExpanded = expandedModules.has(module.id);
                  return (
                    <div key={module.id} className="border-b border-border last:border-b-0">
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-4 py-3.5 sm:py-3 text-left hover:bg-muted/50 transition min-h-[48px]"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ChevronRight
                            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                          <span className="font-medium text-foreground truncate text-sm sm:text-base">
                            {module.title}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                          {module.videoCount} {module.videoCount === 1 ? "video" : "videos"}
                        </span>
                      </button>
                      {isExpanded && module.videos && module.videos.length > 0 && (
                        <div className="px-3 sm:px-4 pb-3 pt-1 bg-muted/30">
                          <div className="space-y-4">
                            {module.videos.map((video) => {
                              const videoSrc = video.url ? getVideoSrc(video.url) : null;
                              return (
                                <div
                                  key={video.id}
                                  className="flex flex-col rounded-lg bg-background border border-border overflow-hidden"
                                >
                                  {/* Video player - full width on mobile */}
                                  <div className="w-full aspect-video bg-black min-w-0 max-w-full">
                                    {videoSrc ? (
                                      <video
                                        key={videoSrc}
                                        src={videoSrc}
                                        controls
                                        className="w-full h-full object-contain"
                                        preload="metadata"
                                        playsInline
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                        No video
                                      </div>
                                    )}
                                  </div>
                                  {/* Content below video on mobile, side-by-side on larger screens */}
                                  <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-3 sm:px-4 sm:py-5 min-w-0 border-t border-border">
                                    <h4 className="text-sm font-semibold text-foreground leading-tight break-words">
                                      {video.title}
                                    </h4>
                                    {video.duration && (
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Duration: {video.duration}
                                      </p>
                                    )}
                                    {video.url && (
                                      <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-xs font-medium text-primary hover:underline mt-2 min-h-[44px] sm:min-h-0"
                                      >
                                        Open video in new tab →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No course content available yet.</p>
            )}
          </section>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground sm:text-xl mb-4">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground break-words">
                {course.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Description */}
          {descriptionParagraphs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground sm:text-xl mb-4">
                Description
              </h2>
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground break-words">
                {descriptionParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}
      </div>
    </div>
    </div>
  );
}
