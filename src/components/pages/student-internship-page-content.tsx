"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Zap, Users, Calendar, IndianRupee, ChevronDown, Filter, X } from "lucide-react";
import { fetchGetCompany } from "@/services/student-internship.service";
import type { GetCompanyItem } from "@/services/student-internship.service";
import { getCities } from "@/services/city.service";
import { getDesignations } from "@/services/designation.service";
import type { City } from "@/types/city";
import type { IDesignation } from "@/types/designation";

const stipendOptions = ["60K", "120K", "320K", "540K", "800K"];
const SKELETON_COUNT = 5;
const STIPEND_SLIDER_MIN = 0;
const STIPEND_SLIDER_MAX = stipendOptions.length - 1;
const SEARCH_DEBOUNCE_MS = 300;

/** Map stipend label to integer for API (e.g. "60K" -> 60000). */
function stipendLabelToInteger(label: string): number {
  const k = label.replace(/K$/i, "");
  const num = parseInt(k, 10);
  return Number.isNaN(num) ? 0 : num * 1000;
}

type FilterSearchDropdownProps = {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (value: string) => void;
  fetchOptions: (search: string) => Promise<{ id: number | string; name: string }[]>;
};

function FilterSearchDropdown({
  label,
  placeholder,
  value,
  onSelect,
  fetchOptions,
}: FilterSearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<{ id: number | string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(
    (q: string) => {
      setLoading(true);
      fetchOptions(q.trim())
        .then((list) => setOptions(list))
        .catch(() => setOptions([]))
        .finally(() => setLoading(false));
    },
    [fetchOptions]
  );

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => load(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [open, search, load]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={open ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Toggle dropdown"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        {open && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1 text-sm">
            {loading ? (
              <li className="px-4 py-2 text-gray-500">Loading...</li>
            ) : options.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results</li>
            ) : (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect("");
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-600"
                  >
                    Clear
                  </button>
                </li>
                {options.map((opt) => (
                  <li key={String(opt.id)}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(opt.name);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${value === opt.name ? "bg-blue-50 font-medium" : ""}`}
                    >
                      {opt.name}
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatSalary(start: number | null, end: number | null): string {
  if (start != null && end != null) return `₹${start.toLocaleString("en-IN")} - ₹${end.toLocaleString("en-IN")}`;
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

function CardSkeleton() {
  return (
    <div className="block bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-200 sm:w-20 sm:h-20" />
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded-md" />
            <div className="h-6 w-20 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}


export function StudentInternshipPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<GetCompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [stipendIndex, setStipendIndex] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const selectedStipend = stipendIndex != null ? stipendOptions[stipendIndex] ?? null : null;
  const salaryRangeParam =
    selectedStipend != null ? String(stipendLabelToInteger(selectedStipend)) : undefined;

  const designation = searchParams.get("designation") ?? "";
  const locationParam = searchParams.get("location") ?? "";
  const category = searchParams.get("category") ?? "";
  const course = searchParams.get("course") ?? "";
  const jobType = searchParams.get("job_type") ?? "";

  const setFilterParam = useCallback(
    (key: "designation" | "location", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const fetchCityOptions = useCallback(async (search: string): Promise<{ id: number | string; name: string }[]> => {
    try {
      const res = await getCities(1, 50, search || undefined);
      return (res.data ?? []).map((c: City) => ({ id: c.id, name: c.name }));
    } catch {
      return [];
    }
  }, []);

  const fetchDesignationOptions = useCallback(
    async (search: string): Promise<{ id: number | string; name: string }[]> => {
      try {
        const res = await getDesignations(1, 50, search || undefined);
        return (res.data ?? []).map((d: IDesignation) => ({ id: d.id, name: d.name }));
      } catch {
        return [];
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const query = {
      designation: designation || undefined,
      location: locationParam || undefined,
      category: category || undefined,
      course: course || undefined,
      job_type: jobType || undefined,
      salary_range: salaryRangeParam,
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
  }, [designation, locationParam, category, course, jobType, salaryRangeParam]);

  return (
    <div className="space-y-6 px-4 sm:px-6 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {loading ? "..." : count} Total Internships
          </h1>
          <p className="text-gray-600 mt-1">Latest summer internships</p>
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen((o) => !o)}
          className="lg:hidden flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50"
          aria-expanded={filterOpen}
        >
          <Filter className="h-4 w-4" />
          {filterOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside
          className={`w-full lg:w-80 shrink-0 lg:self-start ${filterOpen ? "block" : "hidden lg:block"}`}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSearchDropdown
              label="Profile"
              placeholder="Search designation (e.g. Marketing)"
              value={designation}
              onSelect={(v) => setFilterParam("designation", v)}
              fetchOptions={fetchDesignationOptions}
            />
            <FilterSearchDropdown
              label="Location"
              placeholder="Search location (e.g. Delhi)"
              value={locationParam}
              onSelect={(v) => setFilterParam("location", v)}
              fetchOptions={fetchCityOptions}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Desired minimum monthly stipend (₹) (Annual)
              </label>
              <div className="px-1">
                <input
                  type="range"
                  min={STIPEND_SLIDER_MIN}
                  max={STIPEND_SLIDER_MAX}
                  step={1}
                  value={stipendIndex ?? STIPEND_SLIDER_MIN}
                  onChange={(e) => setStipendIndex(Number(e.target.value))}
                  className="stipend-range-slider w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 accent-blue-600"
                  aria-label="Desired minimum stipend"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  {stipendOptions.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                {stipendIndex != null && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-gray-600">
                      Selected: {stipendOptions[stipendIndex]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStipendIndex(null)}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
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
                  {/* Layout: [Logo at start] [Remaining: left info | right info] */}
                  <div className="flex items-start gap-4">
                    {/* Company logo at start */}
                    <div className="shrink-0">
                      {item.comapany?.image ? (
                        <img
                          src={item.comapany.image}
                          alt=""
                          className="w-16 h-16 rounded-2xl object-cover shadow-sm sm:w-20 sm:h-20"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-sm sm:w-20 sm:h-20">
                          <span className="text-orange-500 text-xl font-bold sm:text-2xl">
                            {item.comapany?.name?.charAt(0)?.toUpperCase() ?? "J"}
                          </span>
                          <span className="text-blue-500 text-xl font-bold sm:text-2xl">
                            {item.comapany?.name?.charAt(1)?.toUpperCase() ?? "d"}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Remaining width: left info + right info */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* Left: title, meta, tags */}
                      <div className="min-w-0 space-y-1.5">
                        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                          {item.comapany?.name ?? "Company"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                          {item.location?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                              {item.location.map((loc) => loc.name).join(", ")}
                            </span>
                          )}
                          {item.location?.length > 0 && item.start_day && formatStartDay(item.start_day) && (
                            <span className="text-gray-300" aria-hidden>·</span>
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
                        {item.job_type && item.job_type.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.job_type.map((jt) => (
                              <span key={jt.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                {jt.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.skills.map((skill) => (
                              <span key={skill.id} className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs rounded border border-amber-100">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Right: Quick response, salary, Be An Early Applicant (in front of skill pills) */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {item.is_fast_response && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-medium">
                            Quick response
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
