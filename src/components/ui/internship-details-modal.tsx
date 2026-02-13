"use client";

import { useRouter } from "next/navigation";
import { X, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import Image from "next/image";

interface InternshipDetails {
  id: number;
  companyName: string;
  title: string;
  location: string;
  duration: string;
  dateRange: string;
  postedTime: string;
  isActivelyHiring: boolean;
  isEarlyApplicant: boolean;
  logo?: string;
  keyResponsibilities?: string;
  skillsRequired?: string[];
  howToApply?: string;
  perks?: string[];
}

interface InternshipDetailsModalProps {
  open: boolean;
  internship: InternshipDetails | null;
  onClose: () => void;
}

export function InternshipDetailsModal({
  open,
  internship,
  onClose,
}: InternshipDetailsModalProps) {
  const router = useRouter();
  
  if (!open || !internship) return null;

  const handleApply = () => {
    // Store internship data in sessionStorage for the apply page
    sessionStorage.setItem(
      `internship_${internship.id}`,
      JSON.stringify({
        title: internship.title,
        companyName: internship.companyName,
      })
    );
    // Navigate to apply page
    router.push(`/student/internship/apply/${internship.id}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border bg-white shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-6">
            {/* Company Details Section */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                {/* Company Logo */}
                <div className="shrink-0">
                  {internship.logo ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-900">
                      <Image
                        src={internship.logo}
                        alt={internship.companyName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                      <div className="flex items-center justify-center">
                        <span className="text-orange-500 text-xl font-bold">
                          {internship.companyName.charAt(0).toUpperCase()}
                        </span>
                        {internship.companyName.length > 1 && (
                          <span className="text-blue-500 text-xl font-bold">
                            {internship.companyName.charAt(1).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Company Name and Job Title */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {internship.title}
                  </h2>
                  <p className="text-base text-gray-600">{internship.companyName}</p>
                </div>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{internship.dateRange}</span>
                </div>
              </div>

              {/* Posting Age Tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100">
                  <Clock className="h-3 w-3" />
                  {internship.postedTime}
                </span>
                {internship.isActivelyHiring && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                    Actively Hiring
                  </span>
                )}
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Vacancy Section with Requirements */}
            <div className="space-y-6">
              {/* Key Responsibilities */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Key responsibilities
                </h3>
                <p className="text-sm text-gray-600">
                  {internship.keyResponsibilities || "No responsibilities listed."}
                </p>
              </div>

              {/* Skills Required */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Skills required
                </h3>
                {internship.skillsRequired && internship.skillsRequired.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {internship.skillsRequired.map((skill, index) => (
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

              {/* How to Apply */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  How to apply?
                </h3>
                <p className="text-sm text-gray-600">
                  {internship.howToApply || "No application instructions provided."}
                </p>
              </div>

              {/* Perks */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Perks</h3>
                {internship.perks && internship.perks.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {internship.perks.map((perk, index) => (
                      <li key={index}>{perk}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No perks listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer with Apply Button */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={handleApply}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
