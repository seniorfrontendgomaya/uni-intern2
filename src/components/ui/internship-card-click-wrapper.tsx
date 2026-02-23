"use client";

import { useRouter } from "next/navigation";
import type { PublicInternshipItem } from "@/services/public-internships.service";

const SUBSCRIBE_PATH = "/internships/subscribe";

export function InternshipCardClickWrapper({
  item,
  children,
  className,
}: {
  item: PublicInternshipItem;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isStudent = Boolean(token && role === "STUDENT");
    if (!isStudent) {
      router.push(SUBSCRIBE_PATH);
      return;
    }
    router.push(`/student/internships/${item.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`block w-full cursor-pointer text-left ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
