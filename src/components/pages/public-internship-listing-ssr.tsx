import Link from "next/link";
import { MapPin, Calendar, RefreshCw, Zap, TrendingUp, Briefcase } from "lucide-react";
import type { PublicInternshipItem } from "@/services/public-internships.service";

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

function buildQueryString(params: Record<string, string | undefined>, omitPage?: boolean): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (k === "page" && omitPage) return;
    if (v != null && v !== "") p.set(k, v);
  });
  const q = p.toString();
  return q ? `?${q}` : "";
}

export interface PublicInternshipListingSSRProps {
  items: PublicInternshipItem[];
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}

export function PublicInternshipListingSSR({
  items,
  count,
  hasNextPage,
  hasPreviousPage,
  currentPage,
  searchParams,
}: PublicInternshipListingSSRProps) {
  const basePath = "/internships";
  const prevHref = hasPreviousPage
    ? currentPage === 2
      ? basePath + buildQueryString(searchParams, true)
      : basePath + buildQueryString({ ...searchParams, page: String(currentPage - 1) })
    : null;
  const nextHref = hasNextPage
    ? basePath + buildQueryString({ ...searchParams, page: String(currentPage + 1) })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{count} Total Internships</h1>
        <p className="text-gray-600 mt-1">Latest summer internships</p>
      </div>
      {items.length === 0 ? (
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
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
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

      {(hasNextPage || hasPreviousPage) && items.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} · {count} total
          </p>
          <div className="flex items-center gap-2">
            {prevHref ? (
              <Link
                href={prevHref}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                Previous
              </span>
            )}
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
