"use client";

import { useRouter } from "next/navigation";
import { X, MapPin, Calendar, DollarSign, Users, Briefcase, Building2 } from "lucide-react";
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
  about?: string;
  description?: string;
  category?: string[];
  job_type?: string[];
  salaryRange?: string;
  active?: boolean;
  number_of_opening?: number;
}

interface InternshipDetailsModalProps {
  open: boolean;
  internship: InternshipDetails | null;
  onClose: () => void;
  /** When true, show loading state inside the modal (e.g. while fetching detail from API). */
  loading?: boolean;
  /** When true and no internship, show error state (e.g. fetch failed). */
  error?: boolean;
}

export function InternshipDetailsModal({
  open,
  internship,
  onClose,
  loading = false,
  error = false,
}: InternshipDetailsModalProps) {
  const router = useRouter();
  
  if (!open) return null;

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-2xl rounded-2xl border bg-white shadow-xl p-12 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-gray-500">Loading details…</p>
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-2xl rounded-2xl border bg-white shadow-xl p-12 flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-gray-600">Failed to load details.</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!internship) return null;

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
    router.push(`/student/internships/apply/${internship.id}`);
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

                {/* Company name (main), then designation */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {internship.companyName}
                  </h2>
                  {internship.title && (
                    <p className="text-base text-gray-600">{internship.title}</p>
                  )}
                </div>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                {internship.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                    <span>{internship.location}</span>
                  </div>
                )}
                {internship.duration && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                    <span>{internship.duration}</span>
                  </div>
                )}
                {internship.salaryRange && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-gray-500 shrink-0" />
                    <span>{internship.salaryRange}</span>
                  </div>
                )}
              </div>

              {/* Badges: Actively Hiring, Active, Openings */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {internship.isActivelyHiring && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                    Actively Hiring
                  </span>
                )}
                {internship.active && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100">
                    Active
                  </span>
                )}
                {internship.number_of_opening != null && internship.number_of_opening > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                    <Users className="h-3 w-3" />
                    {internship.number_of_opening} opening{internship.number_of_opening !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 pt-4 mb-4" />

              {/* Description */}
              {internship.description && (
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{internship.description}</p>
                </div>
              )}

              {/* About */}
              {internship.about && (
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">About</h3>
                  <p className="text-sm text-gray-600">{internship.about}</p>
                </div>
              )}

              {/* Category */}
              {internship.category && internship.category.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.category.map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-700"
                      >
                        <Building2 className="h-3.5 w-3.5 text-gray-500" />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job type */}
              {internship.job_type && internship.job_type.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Job type</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.job_type.map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 text-sm text-blue-800"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="border-t border-gray-200 pt-4 mb-4" />
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
              {internship.skillsRequired && internship.skillsRequired.length > 0 && (
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
              )}
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
