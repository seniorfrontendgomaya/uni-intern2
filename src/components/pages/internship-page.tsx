"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MapPin, Calendar, RefreshCw, Zap, TrendingUp, Briefcase } from "lucide-react";
import { InternshipDetailsModal } from "@/components/ui/internship-details-modal";
import { fetchPublicInternships, type PublicInternshipItem } from "@/services/public-internships.service";

interface Internship {
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

const mockInternships: Internship[] = [
  {
    id: 1,
    companyName: "Nmbmn M",
    title: "Software Development Intern",
    location: "Remote",
    duration: "4 Months",
    dateRange: "0 - 0",
    postedTime: "About 1 Hour",
    isActivelyHiring: true,
    isEarlyApplicant: true,
    keyResponsibilities: "Resume screening, interview scheduling, website content update",
    skillsRequired: ["JavaScript", "React", "Node.js", "Git"],
    howToApply: "Please send your resume to hr@company.com with the subject 'Software Development Intern Application'",
    perks: ["Flexible working hours", "Remote work option", "Certificate of completion"],
  },
  {
    id: 2,
    companyName: "Amit",
    title: "Marketing Intern",
    location: "Delhi",
    duration: "3 Months",
    dateRange: "0 - 0",
    postedTime: "1 Day",
    isActivelyHiring: false,
    isEarlyApplicant: false,
    keyResponsibilities: "Social media management, content creation, market research",
    skillsRequired: ["Social Media Marketing", "Content Writing", "Analytics"],
    howToApply: "Apply through our website or email your portfolio to marketing@company.com",
    perks: ["Mentorship program", "Networking opportunities"],
  },
  {
    id: 3,
    companyName: "RAJESH1",
    title: "Data Science Intern",
    location: "Bangalore",
    duration: "6 Months",
    dateRange: "0 - 0",
    postedTime: "1 Day",
    isActivelyHiring: false,
    isEarlyApplicant: false,
    keyResponsibilities: "Data analysis, model building, report generation",
    skillsRequired: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    howToApply: "Submit your application along with your GitHub profile showcasing data science projects",
    perks: ["Stipend", "Real-world project experience", "Letter of recommendation"],
  },
];

const stipendOptions = ["60K", "120K", "320K", "540K", "800K"];

function formatPostedTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return diffMins <= 1 ? "About 1 Hour" : `About ${diffMins} mins`;
    if (diffHours < 24) return diffHours === 1 ? "1 Hour" : `${diffHours} Hours`;
    if (diffDays < 7) return diffDays === 1 ? "1 Day" : `${diffDays} Days`;
    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

function formatStipend(start: number | null, end: number | null): string {
  if (start == null && end == null) return "";
  if (start != null && end != null) return `₹${(start / 1000).toFixed(0)}K - ₹${(end / 1000).toFixed(0)}K`;
  if (start != null) return `₹${(start / 1000).toFixed(0)}K+`;
  return end != null ? `Up to ₹${(end / 1000).toFixed(0)}K` : "";
}

const PAGE_SIZE = 10;

/** Public /internships page: listing from API based on URL params (location, skill, profile, placement_course, page). */
export function PublicInternshipListing() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<PublicInternshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    setCurrentPage(page);
    const query = {
      location: searchParams.get("location") ?? undefined,
      skill: searchParams.get("skill") ?? undefined,
      profile: searchParams.get("profile") ?? undefined,
      placement_course: searchParams.get("placement_course") ?? undefined,
      page,
      page_size: PAGE_SIZE,
    };
    setLoading(true);
    fetchPublicInternships(query)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data ?? []);
          setCount(res.count ?? res.data?.length ?? 0);
          setHasNextPage(res.hasNextPage ?? false);
          setHasPreviousPage(!!res.previous);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setCount(0);
          setHasNextPage(false);
          setHasPreviousPage(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {loading ? "..." : count} Total Internships
        </h1>
        <p className="text-gray-600 mt-1">Latest summer internships</p>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No internships found.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    {item.is_fast_response && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                        <TrendingUp className="h-3 w-3" />
                        Actively Hiring
                      </span>
                    )}
                  </div>
                  {(item.designation?.[0]?.name || (item.location?.length ?? 0) > 0 || item.start_day) && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                      {item.designation?.[0]?.name && (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>{item.designation[0].name}</span>
                        </div>
                      )}
                      {item.location?.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>{item.location.map((loc) => loc.name).join(", ")}</span>
                        </div>
                      )}
                      {item.start_day && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>{item.start_day}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {(item.start_amount != null || item.end_amount != null) && (
                    <p className="text-sm text-gray-600 mb-2">
                      Stipend: {formatStipend(item.start_amount, item.end_amount)}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100">
                      <RefreshCw className="h-3 w-3" />
                      {formatPostedTime(item.created_at) || "Recent"}
                    </span>
                    {item.is_fast_response && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-100">
                        <Zap className="h-3 w-3" />
                        Be An Early Applicant
                      </span>
                    )}
                  </div>
                  {item.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.skills.slice(0, 5).map((s, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                      <span className="text-orange-500 text-xl font-bold">J</span>
                      <span className="text-blue-500 text-xl font-bold">d</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && items.length > 0 && (hasNextPage || hasPreviousPage) && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} · {count} total
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNextPage}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export interface InternshipPageContentProps {
  /** Show the left sidebar filters. Default true. */
  showFilters?: boolean;
  /** Open details modal when a card is clicked. Default true. */
  openModalOnClick?: boolean;
}

export function InternshipPageContent({
  showFilters = true,
  openModalOnClick = true,
}: InternshipPageContentProps = {}) {
  const [profile, setProfile] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStipend, setSelectedStipend] = useState<string | null>("60K");
  const [internships] = useState<Internship[]>(mockInternships);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {internships.length} Total Internships
        </h1>
        <p className="text-gray-600 mt-1">Latest summer internships</p>
      </div>

      {/* Filters and Listings - Same Level */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Section - Left Sidebar */}
        {showFilters && (
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

              {/* Profile Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile
                </label>
                <input
                  type="text"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  placeholder="Mention your profile. e.g.- Marketing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                />
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your preferred location. e.g. Delhi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                />
              </div>

              {/* Stipend Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Desired minimum monthly stipend (₹) (Annual)
                </label>
                <div className="flex flex-wrap gap-2">
                  {stipendOptions.map((stipend) => (
                    <button
                      key={stipend}
                      onClick={() => setSelectedStipend(stipend)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedStipend === stipend
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {stipend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Internship Listings - Right Content */}
        <div className="flex-1">

        {/* Internship Cards */}
        <div className="space-y-4">
          {internships.map((internship) => (
            <div
              key={internship.id}
              {...(openModalOnClick
                ? {
                    onClick: () => {
                      setSelectedInternship(internship);
                      setModalOpen(true);
                    },
                    role: "button" as const,
                    className: "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer",
                  }
                : {
                    className: "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow",
                  })}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Company Name and Actively Hiring Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {internship.companyName}
                    </h3>
                    {internship.isActivelyHiring && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                        <TrendingUp className="h-3 w-3" />
                        Actively Hiring
                      </span>
                    )}
                  </div>

                  {/* Details Line */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{internship.dateRange}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100">
                      <RefreshCw className="h-3 w-3" />
                      {internship.postedTime}
                    </span>
                    {internship.isEarlyApplicant && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-100">
                        <Zap className="h-3 w-3" />
                        Be An Early Applicant
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Logo */}
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                    <div className="flex items-center justify-center">
                      <span className="text-orange-500 text-xl font-bold">J</span>
                      <span className="text-blue-500 text-xl font-bold">d</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Internship Details Modal - only when click opens modal */}
      {openModalOnClick && (
        <InternshipDetailsModal
          open={modalOpen}
          internship={selectedInternship}
          onClose={() => {
            setModalOpen(false);
            setSelectedInternship(null);
          }}
        />
      )}
    </div>
  );
}
