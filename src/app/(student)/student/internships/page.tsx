"use client";

import { Suspense } from "react";
import { StudentInternshipPageContent } from "@/components/pages/student-internship-page-content";

export default function StudentInternshipPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading…</p>}>
      <StudentInternshipPageContent />
    </Suspense>
  );
}
