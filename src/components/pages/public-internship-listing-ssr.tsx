import Link from "next/link";
import { MapPin, Calendar, Users, IndianRupee, Zap } from "lucide-react";
import type { PublicInternshipItem } from "@/services/public-internships.service";

function formatSalary(start: number | null, end: number | null): string {
  if (start != null && end != null) {
    return `₹${start.toLocaleString("en-IN")} - ₹${end.toLocaleString("en-IN")}`;
  }
  if (start != null) return `₹${start.toLocaleString("en-IN")}`;
  if (end != null) return `₹${end.toLocaleString("en-IN")}`;
  return "";
}

function formatStartDay(iso: string | null): string {
  if (!iso || !iso.trim()) return "";
  try {
    const d = new Date(iso.trim());
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
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

/** Show first 4 characters of company name, then asterisks. */
function maskCompanyName(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "–";
  const trimmed = name.trim();
  if (!trimmed) return "–";
  const first4 = trimmed.slice(0, 4);
  return `${first4}****`;
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
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Logo: prefer comapany.image, fallback item.image */}
                <div className="shrink-0">
                  {(item.comapany?.image ?? item.image) ? (
                    <img
                      src={item.comapany?.image ?? item.image ?? ""}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm sm:w-20 sm:h-20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-sm sm:w-20 sm:h-20">
                      <span className="text-orange-500 text-xl font-bold sm:text-2xl">
                        {(item.comapany?.name ?? item.name)?.charAt(0)?.toUpperCase() ?? "J"}
                      </span>
                      <span className="text-blue-500 text-xl font-bold sm:text-2xl">
                        {(item.comapany?.name ?? item.name)?.charAt(1)?.toUpperCase() ?? "d"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  {/* Left */}
                  <div className="min-w-0 space-y-1.5">
                    <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                      {maskCompanyName(item.comapany?.name ?? item.name)}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                      {item.location?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          {item.location.map((loc) => loc.name).join(", ")}
                        </span>
                      )}
                      {item.location?.length > 0 && item.start_day && formatStartDay(item.start_day) && (
                        <span className="text-gray-300" aria-hidden>
                          ·
                        </span>
                      )}
                      {item.start_day && formatStartDay(item.start_day) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          {formatStartDay(item.start_day)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        <Users className="h-3 w-3" />
                        {item.number_of_opening} opening{item.number_of_opening !== 1 ? "s" : ""}
                      </span>
                      {item.active && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">
                          Active
                        </span>
                      )}
                    </div>

                    {item.job_type?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.job_type.map((jt) => (
                          <span
                            key={jt.id}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                          >
                            {jt.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs rounded border border-amber-100"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: placement badge top, then fast response, stipend, CTA */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {item.placement_gurantee_course && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Placement guarantee course
                      </span>
                    )}
                    {item.is_fast_response && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-medium">
                        Fast response
                      </span>
                    )}
                    {(item.start_amount != null || item.end_amount != null) && (
                      <span className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                        <IndianRupee className="h-4 w-4 text-gray-500 shrink-0" />
                        {formatSalary(item.start_amount, item.end_amount)}/month
                      </span>
                    )}
                    {item.is_fast_response && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-100">
                        <Zap className="h-3 w-3" />
                        Be An Early Applicant
                      </span>
                    )}
                  </div>
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
