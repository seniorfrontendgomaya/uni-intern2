"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { fetchAllMegamenuData, type JobTypeFilter } from "@/services/internship-megamenu.service";

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
  const router = useRouter();
  const paramKey = getSearchParamKey(activeSection);

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

  // Navigate to listing page on search input change (debounced) so main page calls API.
  // Dependencies exclude onClose to avoid re-running when parent re-renders (onClose is a new ref each time).
  const DEBOUNCE_MS = 400;
  useEffect(() => {
    const q = search.trim();
    if (!q) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const t = setTimeout(() => {
      const query: Record<string, string> = { job_type: activePaid, [paramKey]: q };
      const href = buildInternshipHref(basePath, query);
      router.push(href);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search, activePaid, paramKey, basePath, router]);

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
  };

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
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
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
          </form>

          <>
              {activeSection === "locations" && (
                <nav className="flex flex-col gap-0.5 flex-1">
                  {loading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                  ) : (
                    <>
                      {locationLinks.map((item) => (
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
                    profileLinks.map((item) => (
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
                    categoryLinks.map((item) => (
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
                    placementLinks.map((item) => (
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
        </div>
      </div>
    </div>
  );
}
