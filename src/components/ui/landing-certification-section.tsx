import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import type { CourseCard } from "@/types/course-card";

// Mock data - will be replaced with API data later
const mockCertificationCourses: CourseCard[] = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect",
    provider: "Cloud Academy",
    image: "/assets/banner-01.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.9, count: 892 },
    price: 799,
  },
  {
    id: "cert-2",
    title: "Google Cloud Professional Certification",
    provider: "GCP Training Institute",
    image: "/assets/banner-02.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.8, count: 645 },
    price: 799,
  },
  {
    id: "cert-3",
    title: "Microsoft Azure Fundamentals",
    provider: "Azure Learning Center",
    image: "/assets/banner-03.webp",
    rating: { stars: 4.7, count: 423 },
    price: 799,
  },
  {
    id: "cert-4",
    title: "Docker & Kubernetes Certification",
    provider: "DevOps Academy",
    image: "/assets/banner-01.webp",
    tag: { label: "Hot & New", variant: "hot-new" },
    rating: { stars: 4.9, count: 234 },
    price: 799,
  },
  {
    id: "cert-5",
    title: "Certified Kubernetes Administrator",
    provider: "K8s Training Hub",
    image: "/assets/banner-02.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    rating: { stars: 4.6, count: 567 },
    price: 799,
  },
  {
    id: "cert-6",
    title: "Terraform Infrastructure as Code",
    provider: "Infrastructure Academy",
    image: "/assets/banner-03.webp",
    rating: { stars: 4.8, count: 345 },
    price: 799,
  },
];

export function LandingCertificationSection() {
  return (
    <LandingCourseCarouselSection
      title="Certification courses for you"
      courses={mockCertificationCourses}
    />
  );
}
