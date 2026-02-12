import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import type { CourseCard } from "@/types/course-card";

// Mock data - will be replaced with API data later
const mockPlacementCourses: CourseCard[] = [
  {
    id: "place-1",
    title: "Full Stack Development with Placement Guarantee",
    provider: "Coding Bootcamp India",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.9, count: 1234 },
    price: 799,
  },
  {
    id: "place-2",
    title: "Data Science & Machine Learning - Job Guaranteed",
    provider: "Data Science Academy",
    image: "/assets/courses/course-2.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.8, count: 987 },
    price: 799,
  },
  {
    id: "place-3",
    title: "Cloud & DevOps Engineer Program",
    provider: "CloudTech Institute",
    image: "/assets/courses/course-3.webp",
    rating: { stars: 4.7, count: 756 },
    price: 799,
  },
  {
    id: "place-4",
    title: "UI/UX Design Mastery with Placement",
    provider: "Design Academy",
    image: "/assets/courses/course-4.jpg",
    tag: { label: "Hot & New", variant: "hot-new" },
    rating: { stars: 4.9, count: 543 },
    price: 799,
  },
  {
    id: "place-5",
    title: "Cybersecurity Professional Program",
    provider: "Security Training Hub",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.6, count: 678 },
    price: 799,
  },
  {
    id: "place-6",
    title: "Mobile App Development - iOS & Android",
    provider: "Mobile Dev Academy",
    image: "/assets/courses/course-3.webp",
    rating: { stars: 4.8, count: 432 },
    price: 799,
  },
  {
    id: "place-7",
    title: "Blockchain Development Bootcamp",
    provider: "Blockchain Institute",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Hot & New", variant: "hot-new" },
    rating: { stars: 4.7, count: 321 },
    price: 799,
  },
];

export function LandingPlacementSection() {
  return (
    <LandingCourseCarouselSection
      title="Placement guarantee courses"
      courses={mockPlacementCourses}
    />
  );
}
