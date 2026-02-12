import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import type { CourseCard } from "@/types/course-card";

// Mock data - will be replaced with API data later
const mockRecommendedCourses: CourseCard[] = [
  {
    id: "rec-1",
    title: "n8n Production Mastery- From Zero to Agency-Ready in 30 days",
    provider: "KRISHAI Technologies Private Limited, Mayank...",
    image: "/assets/courses/course-1.webp", // Placeholder - replace with actual course images
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.9, count: 411 },
    price: 799,
  },
  {
    id: "rec-2",
    title: "AI for Cyber Security : Threat Detection, SOC Automation",
    provider: "Selfcode Academy",
    image: "/assets/courses/course-2.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.8, count: 256 },
    price: 799,
  },
  {
    id: "rec-3",
    title: "Agentic AI for Beginners",
    provider: "Aakriti E-Learning Academy",
    image: "/assets/courses/course-3.webp",
    rating: { stars: 4.7, count: 189 },
    price: 799,
  },
  {
    id: "rec-4",
    title: "AI Safety & Data Security For All Employees in 2026",
    provider: "Michael James (PSM I, PSM II, PSM III, PSPO 1,...",
    image: "/assets/courses/course-4.jpg",
    tag: { label: "Hot & New", variant: "hot-new" },
    rating: { stars: 4.9, count: 523 },
    price: 799,
  },
  {
    id: "rec-5",
    title: "Full Stack Web Development Bootcamp",
    provider: "Tech Academy",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.6, count: 312 },
    price: 799,
  },
];

export function LandingRecommendedSection() {
  return (
    <LandingCourseCarouselSection
      title="Recommended for you"
      courses={mockRecommendedCourses}
    />
  );
}
