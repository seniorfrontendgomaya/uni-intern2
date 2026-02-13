import { LandingCourseCarouselSection } from "./landing-course-carousel-section";
import type { CourseCard } from "@/types/course-card";

// Mock data - will be replaced with API data later
const mockCertificationCourses: CourseCard[] = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect",
    title: "AWS Certified Solutions Architect",
    provider: "Cloud Academy",
    image: "/assets/banner-01.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "cert-2",
    name: "Google Cloud Professional",
    title: "Google Cloud Professional Certification",
    provider: "GCP Training Institute",
    image: "/assets/banner-02.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "cert-3",
    name: "Microsoft Azure Fundamentals",
    title: "Microsoft Azure Fundamentals",
    provider: "Azure Learning Center",
    image: "/assets/banner-03.webp",
    price: 799,
  },
  {
    id: "cert-4",
    name: "Docker & Kubernetes",
    title: "Docker & Kubernetes Certification",
    provider: "DevOps Academy",
    image: "/assets/banner-01.webp",
    tag: { label: "Hot & New", variant: "hot-new" },
    price: 799,
  },
  {
    id: "cert-5",
    name: "Certified Kubernetes Administrator",
    title: "Certified Kubernetes Administrator",
    provider: "K8s Training Hub",
    image: "/assets/banner-02.webp",
    tag: { label: "Bestseller", variant: "bestseller" },
    price: 799,
  },
  {
    id: "cert-6",
    name: "Terraform Infrastructure",
    title: "Terraform Infrastructure as Code",
    provider: "Infrastructure Academy",
    image: "/assets/banner-03.webp",
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
