"use client";

import { useState } from "react";
import { MapPin, Calendar, RefreshCw, Zap, TrendingUp } from "lucide-react";

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
  },
];

const stipendOptions = ["60K", "120K", "320K", "540K", "800K"];

export function InternshipPageContent() {
  const [profile, setProfile] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStipend, setSelectedStipend] = useState<string | null>("60K");
  const [internships] = useState<Internship[]>(mockInternships);

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
        <aside className="w-full lg:w-80 flex-shrink-0">
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

        {/* Internship Listings - Right Content */}
        <div className="flex-1">

        {/* Internship Cards */}
        <div className="space-y-4">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
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
                <div className="flex-shrink-0">
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
    </div>
  );
}
