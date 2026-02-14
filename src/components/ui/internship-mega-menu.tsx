"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, MapPin, Building2 } from "lucide-react";
import { fetchAllMegamenuData, type JobTypeFilter } from "@/services/internship-megamenu.service";
import { fetchGetCompany, type GetCompanyItem } from "@/services/student-internship.service";

export type PaymentType = "Paid" | "Both" | "Unpaid";

const PAYMENT_OPTIONS: { value: JobTypeFilter; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "both", label: "Both" },
  { value: "unpaid", label: "Unpaid" },
];

export type LeftSectionId = "locations" | "profile" | "categories" | "placement-guarantee";

const LEFT_SECTIONS: { id: LeftSectionId; label: string }[] = [
  { id: "locations", label: "Top Locations" },
  { id: "profile", label: "Profile" },
  { id: "categories", label: "Top Categories" },
  { id: "placement-guarantee", label: "Placement Guarantee Courses" },
];

const OPEN_LOGIN_MODAL_EVENT = "open-login-modal";

export interface InternshipMegaMenuProps {
  basePath?: string;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
}

function buildInternshipHref(basePath: string, query?: Record<string, string>) {
  const path = basePath.replace(/\/$/, "");
  if (!query || Object.keys(query).length === 0) return path;
  const params = new URLSearchParams(query);
  return `${path}?${params.toString()}`;
}

/** get_company API param key for the active section (e.g. location, designation, category, course). */
function getSearchParamKey(section: LeftSectionId): "location" | "designation" | "category" | "course" {
  switch (section) {
    case "locations":
      return "location";
    case "profile":
      return "designation";
    case "categories":
      return "category";
    case "placement-guarantee":
      return "course";
    default:
      return "location";
  }
}

export function InternshipMegaMenu({
  basePath = "/internships",
  onClose,
  isOpen = true,
  className = "",
}: InternshipMegaMenuProps) {
  const [activePaid, setActivePaid] = useState<JobTypeFilter>("paid");
  const [activeSection, setActiveSection] = useState<LeftSectionId>("locations");
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [placements, setPlacements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<GetCompanyItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState("");

  const paramKey = getSearchParamKey(activeSection);

  const runSearch = useCallback(() => {
    const q = search.trim();
    if (!q) {
      setSearchSubmitted("");
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    setSearchSubmitted(q);
    const query: Record<string, string> = { job_type: activePaid, [paramKey]: q };
    fetchGetCompany(query)
      .then((res) => {
        setSearchResults(res.data ?? []);
      })
      .catch(() => {
        setSearchResults([]);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  }, [search, activePaid, paramKey]);

  const clearSearchResults = useCallback(() => {
    setSearchSubmitted("");
    setSearchResults(null);
  }, []);

  useEffect(() => {
    clearSearchResults();
  }, [activePaid, activeSection, clearSearchResults]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllMegamenuData(activePaid)
      .then((data) => {
        if (!cancelled) {
          setLocations(data.locations);
          setProfiles(data.profiles);
          setCategories(data.categories);
          setPlacements(data.placements);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activePaid]);

  const allHref = buildInternshipHref(basePath);
  const internationalHref = buildInternshipHref(basePath, {
    type: "international",
  });

  const locationLinks = useMemo(
    () =>
      locations.map((name) => ({
        label: `Internships in ${name}`,
        href: buildInternshipHref(basePath, { location: name, job_type: activePaid }),
      })),
    [locations, basePath, activePaid]
  );
  const profileLinks = useMemo(
    () =>
      profiles.map((name) => ({
        label: `${name} Internships`,
        href: buildInternshipHref(basePath, { designation: name, job_type: activePaid }),
      })),
    [profiles, basePath, activePaid]
  );
  const categoryLinks = useMemo(
    () =>
      categories.map((name) => ({
        label: `${name} Internships`,
        href: buildInternshipHref(basePath, { category: name, job_type: activePaid }),
      })),
    [categories, basePath, activePaid]
  );
  const placementLinks = useMemo(
    () =>
      placements.map((name) => ({
        label: name,
        href: buildInternshipHref(basePath, { course: name, job_type: activePaid }),
      })),
    [placements, basePath, activePaid]
  );

  const searchLower = search.trim().toLowerCase();
  const filterBySearch = <T extends { label: string }>(list: T[]) =>
    searchLower ? list.filter((item) => item.label.toLowerCase().includes(searchLower)) : list;
  const filteredLocations = filterBySearch(locationLinks);
  const filteredProfiles = filterBySearch(profileLinks);
  const filteredCategories = filterBySearch(categoryLinks);
  const filteredPlacement = filterBySearch(placementLinks);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      e.preventDefault();
      window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT));
      return;
    }
    onClose?.();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  const showSearchResults = searchSubmitted.length > 0;
  const resultCount = searchResults?.length ?? 0;

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden ${className}`}
      style={{ minWidth: "640px", width: "640px" }}
    >
      <div className="flex">
        {/* Left column: Payment tabs + Section list */}
        <div className="w-[220px] shrink-0 border-r border-gray-200 p-4 flex flex-col">
          {/* Payment type: pill tab UI - horizontal selector, selected in blue */}
          <div className="flex rounded-full bg-gray-100 p-1.5 mb-4 gap-1">
            {PAYMENT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActivePaid(value)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activePaid === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Section selectors - clicking changes right panel */}
          <nav className="flex flex-col gap-0.5 flex-1">
            {LEFT_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeSection === section.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right column: search form + results or static links */}
        <div className="flex-1 min-w-0 p-4 flex flex-col">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeSection === "locations"
                    ? "Search location (e.g. Patna)..."
                    : activeSection === "profile"
                      ? "Search profile (e.g. Marketing)..."
                      : activeSection === "categories"
                        ? "Search category..."
                        : "Search course..."
                }
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="shrink-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
            >
              {searchLoading ? "..." : "Search"}
            </button>
          </form>

          {searchLoading ? (
            <p className="px-3 py-2 text-sm text-gray-500">Searching...</p>
          ) : showSearchResults ? (
            <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-auto">
              {searchSubmitted && (
                <button
                  type="button"
                  onClick={clearSearchResults}
                  className="text-left px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  ← Clear search
                </button>
              )}
              {resultCount === 0 ? (
                <p className="px-3 py-2 text-sm text-gray-500">No internships found for &quot;{searchSubmitted}&quot;</p>
              ) : (
                <nav className="flex flex-col gap-0.5">
                  {searchResults?.map((item) => (
                    <Link
                      key={item.id}
                      href={`${basePath.replace(/\/$/, "")}/${item.id}`}
                      onClick={handleLinkClick}
                      className="rounded-md px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 border border-gray-100"
                    >
                      <div className="font-medium text-gray-900">
                        {item.comapany?.name ?? "Company"}
                      </div>
                      {item.location?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {item.location.map((loc) => loc.name).join(", ")}
                        </div>
                      )}
                      {item.category?.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 flex-wrap">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {item.category.map((c) => c.name).join(", ")}
                        </div>
                      )}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          ) : (
            <>
              {activeSection === "locations" && (
                <nav className="flex flex-col gap-0.5 flex-1">
                  {loading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                  ) : (
                    <>
                      {filteredLocations.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        href={allHref}
                        onClick={handleLinkClick}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 mt-1"
                      >
                        View all Internships
                      </Link>
                      <Link
                        href={internationalHref}
                        onClick={handleLinkClick}
                        className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        International Internship
                      </Link>
                    </>
                  )}
                </nav>
              )}

              {activeSection === "profile" && (
                <nav className="flex flex-col gap-0.5">
                  {loading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                  ) : (
                    filteredProfiles.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </nav>
              )}

              {activeSection === "categories" && (
                <nav className="flex flex-col gap-0.5">
                  {loading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                  ) : (
                    filteredCategories.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </nav>
              )}

              {activeSection === "placement-guarantee" && (
                <nav className="flex flex-col gap-0.5">
                  {loading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                  ) : (
                    filteredPlacement.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleLinkClick}
                        className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
