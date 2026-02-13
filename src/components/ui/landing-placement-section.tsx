import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import type { CourseCard } from "@/types/course-card";

// Mock data - will be replaced with API data later
const mockPlacementCourses: CourseCard[] = [
  {
    id: "place-1",
    name: "Full Stack Development",
    title: "Full Stack Development with Placement Guarantee",
    provider: "Coding Bootcamp India",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "place-2",
    name: "Data Science & Machine Learning",
    title: "Data Science & Machine Learning - Job Guaranteed",
    provider: "Data Science Academy",
    image: "/assets/courses/course-2.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "place-3",
    name: "Cloud & DevOps Engineer",
    title: "Cloud & DevOps Engineer Program",
    provider: "CloudTech Institute",
    image: "/assets/courses/course-3.webp",
    price: 799,
  },
  {
    id: "place-4",
    name: "UI/UX Design Mastery",
    title: "UI/UX Design Mastery with Placement",
    provider: "Design Academy",
    image: "/assets/courses/course-4.jpg",
    tag: { label: "Hot & New", variant: "hot-new" },
    price: 799,
  },
  {
    id: "place-5",
    name: "Cybersecurity Professional",
    title: "Cybersecurity Professional Program",
    provider: "Security Training Hub",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "place-6",
    name: "Mobile App Development",
    title: "Mobile App Development - iOS & Android",
    provider: "Mobile Dev Academy",
    image: "/assets/courses/course-3.webp",
    price: 799,
  },
  {
    id: "place-7",
    name: "Blockchain Development",
    title: "Blockchain Development Bootcamp",
    provider: "Blockchain Institute",
    image: "/assets/courses/course-1.webp",
    tag: { label: "Hot & New", variant: "hot-new" },
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
