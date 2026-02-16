"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Download, Save, X, ChevronDown, Search } from "lucide-react";
import { getResumeUserProfile, updateResumeUserProfile, downloadResume, getLanguages } from "@/services/resume-builder.service";
import { getCities } from "@/services/city.service";
import type { ResumeUserProfile } from "@/types/resume-builder";
import type { Language } from "@/types/resume-builder";
import type { City } from "@/types/city";
import { toast } from "react-hot-toast";

function isLanguageArray(arr: unknown): arr is { id: number; name: string }[] {
  return Array.isArray(arr) && arr.every((x) => x && typeof x.id === "number" && typeof x.name === "string");
}

function isLocationArray(arr: unknown): arr is { id: number; name: string }[] {
  return Array.isArray(arr) && arr.every((x) => x && typeof x.id === "number" && typeof x.name === "string");
}

export function UserProfileSection() {
  const [profile, setProfile] = useState<ResumeUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    country_code: "",
    selectedLocations: [] as { id: number; name: string }[],
    gender: "",
    selectedLanguages: [] as { id: number; name: string }[],
  });
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [languageSearchLoading, setLanguageSearchLoading] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLanguageSearchLoading(true);
      getLanguages(languageSearch)
        .then((res) => setAllLanguages(res.data ?? []))
        .catch(() => setAllLanguages([]))
        .finally(() => setLanguageSearchLoading(false));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [languageSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLocationSearchLoading(true);
      getCities(1, 50, locationSearch || undefined)
        .then((res) => setAllCities(res.data ?? []))
        .catch(() => setAllCities([]))
        .finally(() => setLocationSearchLoading(false));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  const fetchProfile = async () => {
    try {
      const response = await getResumeUserProfile();
      if (response.data && response.data.length > 0) {
        const profileData = response.data[0];
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          mobile: profileData.mobile || "",
          country_code: profileData.country_code || "",
          selectedLocations: isLocationArray(profileData.location) ? profileData.location : [],
          gender: profileData.gender || "",
          selectedLanguages: isLanguageArray(profileData.language) ? profileData.language : [],
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        mobile: profile.mobile || "",
        country_code: profile.country_code || "",
        selectedLocations: isLocationArray(profile.location) ? profile.location : [],
        gender: profile.gender || "",
        selectedLanguages: isLanguageArray(profile.language) ? profile.language : [],
      });
      setLanguageSearch("");
      setLanguageDropdownOpen(false);
      setLocationSearch("");
      setLocationDropdownOpen(false);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    if (formData.selectedLocations.length > 2) {
      toast.error("Only two locations allowed");
      return;
    }

    try {
      const payload: Record<string, unknown> = {};
      if (formData.first_name?.trim()) payload.first_name = formData.first_name.trim();
      if (formData.last_name?.trim()) payload.last_name = formData.last_name.trim();
      if (formData.mobile?.trim()) payload.mobile = formData.mobile.trim();
      if (formData.country_code?.trim()) payload.country_code = formData.country_code.trim();
      if (formData.gender?.trim()) payload.gender = formData.gender.trim();
      if (formData.selectedLanguages.length > 0) {
        payload.language = formData.selectedLanguages.map((lang) => lang.id);
      }
      if (formData.selectedLocations.length > 0) {
        payload.location = formData.selectedLocations.map((loc) => loc.id);
      }

      await updateResumeUserProfile(payload);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setLanguageSearch("");
      setLanguageDropdownOpen(false);
      setLocationSearch("");
      setLocationDropdownOpen(false);
      fetchProfile();
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: string }).message)
          : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadResume();
      toast.success("Resume downloaded successfully");
    } catch (error) {
      toast.error("Failed to download resume");
    }
  };

  if (loading) {
    return (
      <div className="border-b-2 border-gray-800 px-8 pt-8 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-9 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Your Name";
  const languageDisplay = isLanguageArray(profile.language)
    ? profile.language.map((l) => l.name).join(", ")
    : "";
  const locationDisplay = isLocationArray(profile.location)
    ? profile.location.map((l) => l.name).join(", ")
    : "";
  const contactInfo = [
    profile.email,
    profile.mobile ? `${profile.country_code || ""} ${profile.mobile}`.trim() : null,
    profile.gender || null,
  ].filter(Boolean);

  return (
    <div className="border-b-2 border-gray-800 px-8 pt-8 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-0 mb-4">
        <div className="order-2 flex-1 sm:order-none">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country Code
                  </label>
                  <input
                    type="text"
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                    placeholder="+91"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <div ref={languageDropdownRef}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Language
                </label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <Search className="h-4 w-4 text-gray-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={languageSearch}
                      onChange={(e) => {
                        setLanguageSearch(e.target.value);
                        setLanguageDropdownOpen(true);
                      }}
                      onFocus={() => setLanguageDropdownOpen(true)}
                      placeholder="Search and select languages..."
                      className="w-full px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {languageDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-auto">
                      {languageSearchLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                      ) : (
                        <>
                          {allLanguages
                            .filter((lang) => !formData.selectedLanguages.some((s) => s.id === lang.id))
                            .map((lang) => (
                              <button
                                key={lang.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    selectedLanguages: [...formData.selectedLanguages, lang],
                                  });
                                  setLanguageSearch("");
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {lang.name}
                              </button>
                            ))}
                          {allLanguages.filter((l) => !formData.selectedLanguages.some((s) => s.id === l.id))
                            .length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              {languageSearch.trim() ? "No matching languages" : "Type to search languages"}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {formData.selectedLanguages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {formData.selectedLanguages.map((lang) => (
                      <span
                        key={lang.id}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs"
                      >
                        {lang.name}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              selectedLanguages: formData.selectedLanguages.filter((s) => s.id !== lang.id),
                            })
                          }
                          className="p-0.5 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div ref={locationDropdownRef}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <Search className="h-4 w-4 text-gray-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => {
                        setLocationSearch(e.target.value);
                        setLocationDropdownOpen(true);
                      }}
                      onFocus={() => setLocationDropdownOpen(true)}
                      placeholder="Search and select locations..."
                      className="w-full px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${locationDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {locationDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-auto">
                      {locationSearchLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                      ) : (
                        <>
                          {allCities
                            .filter((city) => !formData.selectedLocations.some((s) => s.id === city.id))
                            .map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={() => {
                                  if (formData.selectedLocations.length >= 2) {
                                    toast.error("Only two locations allowed");
                                    return;
                                  }
                                  setFormData({
                                    ...formData,
                                    selectedLocations: [...formData.selectedLocations, { id: city.id, name: city.name }],
                                  });
                                  setLocationSearch("");
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {city.name}
                              </button>
                            ))}
                          {allCities.filter((c) => !formData.selectedLocations.some((s) => s.id === c.id))
                            .length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              {locationSearch.trim() ? "No matching locations" : "Type to search locations"}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {formData.selectedLocations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {formData.selectedLocations.map((loc) => (
                      <span
                        key={loc.id}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs"
                      >
                        {loc.name}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              selectedLocations: formData.selectedLocations.filter((s) => s.id !== loc.id),
                            })
                          }
                          className="p-0.5 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
                >
                  <Save className="h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {fullName}
                </h1>
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 hover:opacity-100 transition"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                  {contactInfo.map((info, index) => (
                    <span key={index}>
                      {info}
                      {index < contactInfo.length - 1 && <span className="mx-2">•</span>}
                    </span>
                  ))}
                </div>
                {languageDisplay && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Language:</span> {languageDisplay}
                  </div>
                )}
                {locationDisplay && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Location:</span> {locationDisplay}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="order-1 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition text-sm font-medium sm:order-none"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}
