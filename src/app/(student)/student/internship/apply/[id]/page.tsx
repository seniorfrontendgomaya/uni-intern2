"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { InternshipApplyForm } from "@/components/pages/internship-apply-form";

export default function InternshipApplyPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params?.id as string;
  
  // TODO: Fetch internship details from API
  // For now, using mock data or getting from URL state
  const [internshipTitle, setInternshipTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (!internshipId) {
      router.replace("/student/internship");
      return;
    }

    // TODO: Fetch internship details from API using internshipId
    // For now, we'll try to get it from sessionStorage or use placeholder
    const storedData = sessionStorage.getItem(`internship_${internshipId}`);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setInternshipTitle(data.title || "");
        setCompanyName(data.companyName || "");
      } catch (e) {
        console.error("Failed to parse stored internship data", e);
      }
    }

    // If no stored data, use defaults
    if (!internshipTitle) {
      setInternshipTitle("Internship Position");
    }
    if (!companyName) {
      setCompanyName("Company Name");
    }
  }, [internshipId, router, internshipTitle, companyName]);

  if (!internshipId) {
    return null;
  }

  return (
    <InternshipApplyForm
      internshipId={internshipId}
      internshipTitle={internshipTitle}
      companyName={companyName}
    />
  );
}
