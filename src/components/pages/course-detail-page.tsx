"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Calendar, DollarSign, BookOpen } from "lucide-react";

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
  videos?: Array<{ id: string; title: string; duration?: string }>;
}

interface CourseDetailPageProps {
  course: CourseDetailData;
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
    <div className="min-h-screen w-full bg-white -mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
      {/* Red Hero Section - Full Width with Image on Right */}
      <section className="w-full bg-[#E61A3D] text-white px-4 pt-0 pb-6 sm:px-6 sm:pb-5 lg:px-8">
        <div className="mx-auto max-w-7xl pt-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
            {/* Left Side - Text Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {course.title}
              </h1>
              <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed opacity-95">
                {course.description.split(/\r?\n/).map((para, i) => (
                  para.trim() && <p key={i}>{para.trim()}</p>
                ))}
              </div>
              {course.author && (
                <p className="mt-2 text-[10px] sm:text-xs opacity-90">Created by {course.author}</p>
              )}
            </div>

            {/* Right Side - Course Image */}
            <div className="w-full lg:w-80 lg:shrink-0">
              {course.image && !imageError ? (
                <div className="relative h-48 sm:h-64 lg:h-72 w-full rounded-lg overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                    onError={() => setImageError(true)}
                    priority
                  />
                </div>
              ) : (
                <div className="relative h-48 sm:h-64 lg:h-72 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
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
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-sm font-medium text-foreground shrink-0">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground">{item}</p>
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
            <div className="flex flex-wrap gap-4">
              {course.price != null && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                </div>
              )}
              {course.updatedDate && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(course.updatedDate)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Course content */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                Course content
              </h2>
              {course.courseContent && course.courseContent.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAllModules}
                  className="text-sm font-medium text-primary hover:underline"
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
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ChevronRight
                            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                          <span className="font-medium text-foreground truncate">
                            {module.title}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground shrink-0 ml-4">
                          {module.videoCount} {module.videoCount === 1 ? "video" : "videos"}
                        </span>
                      </button>
                      {isExpanded && module.videos && module.videos.length > 0 && (
                        <div className="px-4 pb-3 pt-1 bg-muted/30">
                          <div className="space-y-2">
                            {module.videos.map((video) => (
                              <div
                                key={video.id}
                                className="flex items-center justify-between px-3 py-2 rounded-md bg-background border border-border"
                              >
                                <span className="text-sm text-foreground">{video.title}</span>
                                {video.duration && (
                                  <span className="text-xs text-muted-foreground">{video.duration}</span>
                                )}
                              </div>
                            ))}
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
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
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
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
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
