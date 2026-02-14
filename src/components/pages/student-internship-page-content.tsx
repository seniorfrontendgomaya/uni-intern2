"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, TrendingUp, Zap, Building2, Users } from "lucide-react";
import { fetchGetCompany } from "@/services/student-internship.service";
import type { GetCompanyItem } from "@/services/student-internship.service";

const stipendOptions = ["60K", "120K", "320K", "540K", "800K"];
const DESCRIPTION_TRUNCATE_LENGTH = 120;

function truncateDescription(text: string | null, maxLen: number): string {
  if (!text || !text.trim()) return "";
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen).trim() + "…";
}

export function StudentInternshipPageContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<GetCompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [profile, setProfile] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStipend, setSelectedStipend] = useState<string | null>("60K");

  useEffect(() => {
    let cancelled = false;
    const query = {
      designation: searchParams.get("designation") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      course: searchParams.get("course") ?? undefined,
      job_type: searchParams.get("job_type") ?? undefined,
    };
    setLoading(true);
    fetchGetCompany(query)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data ?? []);
          setCount(res.count ?? res.data?.length ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setCount(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {loading ? "..." : count} Total Internships
        </h1>
        <p className="text-gray-600 mt-1">Latest summer internships</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile</label>
              <input
                type="text"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                placeholder="Mention your profile. e.g.- Marketing"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your preferred location. e.g. Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Desired minimum monthly stipend (₹) (Annual)
              </label>
              <div className="flex flex-wrap gap-2">
                {stipendOptions.map((stipend) => (
                  <button
                    key={stipend}
                    type="button"
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

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No internships found. Try selecting a filter from the Internships menu.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={`/student/internships/${item.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.comapany?.name ?? "Company"}
                        </h3>
                        {item.is_fast_response && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                            <TrendingUp className="h-3 w-3" />
                            Actively Hiring
                          </span>
                        )}
                        {item.active && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100">
                            Active
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {truncateDescription(item.description, DESCRIPTION_TRUNCATE_LENGTH)}
                        </p>
                      )}
                      {item.location?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>{item.location.map((loc) => loc.name).join(", ")}</span>
                        </div>
                      )}
                      {item.category?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2 flex-wrap">
                          <Building2 className="h-4 w-4 text-gray-500 shrink-0" />
                          {item.category.map((cat, catIndex) => (
                            <span key={catIndex} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                          <Users className="h-3 w-3" />
                          {item.number_of_opening} opening{item.number_of_opening !== 1 ? "s" : ""}
                        </span>
                        {item.is_fast_response && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-100">
                            <Zap className="h-3 w-3" />
                            Be An Early Applicant
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {item.comapany?.image ? (
                        <img
                          src={item.comapany.image}
                          alt=""
                          className="w-16 h-16 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                          <span className="text-orange-500 text-xl font-bold">
                            {item.comapany?.name?.charAt(0)?.toUpperCase() ?? "J"}
                          </span>
                          <span className="text-blue-500 text-xl font-bold">
                            {item.comapany?.name?.charAt(1)?.toUpperCase() ?? "d"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
