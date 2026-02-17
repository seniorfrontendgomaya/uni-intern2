"use client";

import Image from "next/image";
import { MapPin, Calendar, DollarSign, Users, Briefcase, Building2, BookOpen } from "lucide-react";
import type { InternshipDetailDisplay } from "@/services/student-internship.service";

interface InternshipDetailContentProps {
  detail: InternshipDetailDisplay;
}

export function InternshipDetailContent({ detail }: InternshipDetailContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {detail.logo ? (
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-900">
              <Image
                src={detail.logo}
                alt={detail.companyName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-xl font-bold text-white">
              {(detail.companyName.charAt(0) ?? "J").toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{detail.companyName}</h1>
          {detail.title && <p className="text-base text-gray-600">{detail.title}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
        {detail.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
            <span>{detail.location}</span>
          </div>
        )}
        {detail.duration && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
            <span>{detail.duration}</span>
          </div>
        )}
        {detail.salaryRange && (
          detail.salaryRange === "Unpaid internship" ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              Unpaid internship
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-gray-500 shrink-0" />
              <span>{detail.salaryRange}</span>
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {detail.isActivelyHiring && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
            Actively Hiring
          </span>
        )}
        {detail.active && (
          <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100">
            Active
          </span>
        )}
        {detail.number_of_opening != null && detail.number_of_opening > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
            <Users className="h-3 w-3" />
            {detail.number_of_opening} opening{detail.number_of_opening !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4" />

      {detail.description && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Description</h2>
          <p className="text-sm text-gray-600">{detail.description}</p>
        </div>
      )}

      {detail.about && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600">{detail.about}</p>
        </div>
      )}

      {detail.category && detail.category.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Category</h2>
          <div className="flex flex-wrap gap-2">
            {detail.category.map((name, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-700"
              >
                <Building2 className="h-4 w-4 text-gray-500" />
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {detail.job_type && detail.job_type.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Job type</h2>
          <div className="flex flex-wrap gap-2">
            {detail.job_type.map((name, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 text-sm text-blue-800"
              >
                <Briefcase className="h-4 w-4 text-blue-600" />
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {detail.course && detail.course.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Courses</h2>
          <div className="flex flex-wrap gap-2">
            {detail.course.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-violet-50 text-sm text-violet-800"
              >
                <BookOpen className="h-4 w-4 text-violet-600" />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4" />

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Key responsibilities</h2>
        <p className="text-sm text-gray-600">
          {detail.keyResponsibilities || "No responsibilities listed."}
        </p>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Skills required</h2>
        {detail.skillsRequired && detail.skillsRequired.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {detail.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No specific skills listed.</p>
        )}
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-2">How to apply?</h2>
        <p className="text-sm text-gray-600">
          {detail.howToApply || "No application instructions provided."}
        </p>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Perks</h2>
        {detail.perks && detail.perks.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {detail.perks.map((perk, index) => (
              <li key={index}>{perk}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No perks listed.</p>
        )}
      </div>
    </div>
  );
}
