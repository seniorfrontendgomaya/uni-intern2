"use client";

import { UserProfileSection } from "@/components/resume/user-profile-section";
import { CareerObjectiveSection } from "@/components/resume/career-objective-section";
import { EducationSection } from "@/components/resume/education-section";
import { ExtraCurricularSection } from "@/components/resume/extra-curricular-section";
import { TrainingSection } from "@/components/resume/training-section";
import { ProjectsSection } from "@/components/resume/projects-section";
import { SkillsSection } from "@/components/resume/skills-section";
import { AccomplishmentsSection } from "@/components/resume/accomplishments-section";

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6">
      {/* Header Message */}
      <div className="border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-3 text-center">
          <p className="text-xs text-gray-500">
            This is the resume companies will see when you apply
          </p>
        </div>
      </div>

      {/* Resume Document Container - PDF-like appearance */}
      <div 
        className="mx-auto max-w-4xl bg-white" 
        style={{ 
          minHeight: "842px",
          boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        {/* Personal Information Header */}
        <UserProfileSection />

        {/* Resume Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Career Objective Section */}
          <CareerObjectiveSection />

          {/* Education Section */}
          <EducationSection />

          {/* Extra Curricular Activities Section */}
          <ExtraCurricularSection />

          {/* Training/Courses Section */}
          <TrainingSection />

          {/* Academics/Personal Projects Section */}
          <ProjectsSection />

          {/* Skills Section */}
          <SkillsSection />

          {/* Accomplishments Section */}
          <AccomplishmentsSection />
        </div>
      </div>
    </div>
  );
}
