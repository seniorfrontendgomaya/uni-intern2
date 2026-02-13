"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type PaymentType = "Paid" | "Both" | "Unpaid";

const PAYMENT_OPTIONS: PaymentType[] = ["Paid", "Both", "Unpaid"];

export type LeftSectionId = "locations" | "profile" | "categories" | "placement-guarantee";

const LEFT_SECTIONS: { id: LeftSectionId; label: string }[] = [
  { id: "locations", label: "Top Locations" },
  { id: "profile", label: "Profile" },
  { id: "categories", label: "Top Categories" },
  { id: "placement-guarantee", label: "Placement Guarantee Courses" },
];

const LOCATION_LINKS = [
  { label: "Work from Home", slug: "work-from-home" },
  { label: "Internships in Delhi", slug: "delhi" },
  { label: "Internships in Mumbai", slug: "mumbai" },
  { label: "Internships in Bangalore", slug: "bangalore" },
  { label: "Internships in Pune", slug: "pune" },
  { label: "Internships in Hyderabad", slug: "hyderabad" },
  { label: "Internships in Kolkata", slug: "kolkata" },
  { label: "Internships in Chennai", slug: "chennai" },
  { label: "Internships in Jaipur", slug: "jaipur" },
];

const PROFILE_LINKS = [
  { label: "Marketing", slug: "marketing" },
  { label: "Design", slug: "design" },
  { label: "Software Development", slug: "software-development" },
  { label: "Data Science", slug: "data-science" },
  { label: "Content Writing", slug: "content-writing" },
  { label: "Digital Marketing", slug: "digital-marketing" },
  { label: "Human Resources", slug: "hr" },
  { label: "Finance", slug: "finance" },
];

const CATEGORY_LINKS = [
  { label: "Engineering", slug: "engineering" },
  { label: "Business", slug: "business" },
  { label: "Design", slug: "design" },
  { label: "Marketing", slug: "marketing" },
  { label: "Technology", slug: "technology" },
  { label: "Healthcare", slug: "healthcare" },
  { label: "Law", slug: "law" },
  { label: "Media", slug: "media" },
];

const PLACEMENT_LINKS = [
  { label: "Full Stack Development", slug: "full-stack" },
  { label: "Data Science & AI", slug: "data-science-ai" },
  { label: "Digital Marketing", slug: "digital-marketing" },
  { label: "Product Management", slug: "product-management" },
  { label: "UI/UX Design", slug: "ui-ux" },
  { label: "Cloud & DevOps", slug: "cloud-devops" },
];

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

export function InternshipMegaMenu({
  basePath = "/internship",
  onClose,
  isOpen = true,
  className = "",
}: InternshipMegaMenuProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>("Paid");
  const [activeSection, setActiveSection] = useState<LeftSectionId>("locations");
  const [locationSearch, setLocationSearch] = useState("");
  const [profileSearch, setProfileSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [placementSearch, setPlacementSearch] = useState("");

  const allHref = buildInternshipHref(basePath);
  const internationalHref = buildInternshipHref(basePath, {
    type: "international",
  });

  const filteredLocations = locationSearch.trim()
    ? LOCATION_LINKS.filter((item) =>
        item.label.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : LOCATION_LINKS;

  const filteredProfiles = profileSearch.trim()
    ? PROFILE_LINKS.filter((item) =>
        item.label.toLowerCase().includes(profileSearch.toLowerCase())
      )
    : PROFILE_LINKS;

  const filteredCategories = categorySearch.trim()
    ? CATEGORY_LINKS.filter((item) =>
        item.label.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : CATEGORY_LINKS;

  const filteredPlacement = placementSearch.trim()
    ? PLACEMENT_LINKS.filter((item) =>
        item.label.toLowerCase().includes(placementSearch.toLowerCase())
      )
    : PLACEMENT_LINKS;

  const paymentQuery = { payment: paymentType.toLowerCase() };

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
            {PAYMENT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPaymentType(option)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  paymentType === option
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option}
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

        {/* Right column: content depends on active left section */}
        <div className="flex-1 min-w-0 p-4 flex flex-col">
          {activeSection === "locations" && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search location..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <nav className="flex flex-col gap-0.5 flex-1">
                {filteredLocations.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildInternshipHref(basePath, {
                      location: item.slug,
                      ...paymentQuery,
                    })}
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={allHref}
                  onClick={onClose}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 mt-1"
                >
                  View all Internships
                </Link>
                <Link
                  href={internationalHref}
                  onClick={onClose}
                  className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  International Internship
                </Link>
              </nav>
            </>
          )}

          {activeSection === "profile" && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  placeholder="Search profile..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <nav className="flex flex-col gap-0.5">
                {filteredProfiles.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildInternshipHref(basePath, {
                      profile: item.slug,
                      ...paymentQuery,
                    })}
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          )}

          {activeSection === "categories" && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search category..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <nav className="flex flex-col gap-0.5">
                {filteredCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildInternshipHref(basePath, {
                      category: item.slug,
                      ...paymentQuery,
                    })}
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          )}

          {activeSection === "placement-guarantee" && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={placementSearch}
                  onChange={(e) => setPlacementSearch(e.target.value)}
                  placeholder="Search course..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <nav className="flex flex-col gap-0.5">
                {filteredPlacement.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildInternshipHref(basePath, {
                      placement: item.slug,
                      ...paymentQuery,
                    })}
                    onClick={onClose}
                    className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
