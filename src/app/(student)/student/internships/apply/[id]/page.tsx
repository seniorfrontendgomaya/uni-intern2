"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { InternshipApplyForm } from "@/components/pages/internship-apply-form";

export default function InternshipApplyPage() {
  const params = useParams();
  const router = useRouter();
  const companyIdFromUrl = params?.id as string; // URL param is company id (from detail page Apply)
  const [internshipTitle, setInternshipTitle] = useState("Internship Position");
  const [companyName, setCompanyName] = useState("Company Name");

  useEffect(() => {
    if (!companyIdFromUrl) {
      router.replace("/student/internships");
      return;
    }
    try {
      const stored = sessionStorage.getItem(`internship_apply_${companyIdFromUrl}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.title) setInternshipTitle(data.title);
        if (data.companyName) setCompanyName(data.companyName);
      }
    } catch (_) {}
  }, [companyIdFromUrl, router]);

  if (!companyIdFromUrl) {
    return null;
  }

  return (
    <InternshipApplyForm
      companyId={companyIdFromUrl}
      internshipTitle={internshipTitle}
      companyName={companyName}
    />
  );
}
