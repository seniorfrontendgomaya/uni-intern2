"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, GraduationCap, Code, Languages, UserCircle, Pencil, X } from "lucide-react";
import {
  getStudentProfile,
  patchStudentProfile,
  fetchAndStoreStudentProfile,
  getLanguageList,
  type LanguageOption,
} from "@/services/student-profile.service";
import type { StudentProfile } from "@/types/student-profile";
import type { StudentProfilePatch } from "@/services/student-profile.service";
import { searchCities } from "@/services/city.service";
import type { City } from "@/types/city";
import { Modal } from "@/components/ui/modal";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "",
    mobile: "",
    gender: "",
    qualification: "",
    education: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [languageSearch, setLanguageSearch] = useState("");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<{ id: number; name: string } | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearching, setCitySearching] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const citySearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await getStudentProfile();
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "STUDENT") {
      router.replace("/");
      return;
    }
    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      email: profile.email ?? "",
      country_code: profile.country_code ?? "",
      mobile: profile.mobile ?? "",
      gender: profile.gender ?? "",
      qualification: profile.qualification ?? "",
      education: profile.education ?? "",
    });
    setImagePreview(profile.image ?? null);
    const loc = profile.location;
    setSelectedCity(
      Array.isArray(loc) && loc.length > 0 ? { id: 0, name: String(loc[0]) } : null
    );
  }, [profile]);

  const openModal = async () => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        email: profile.email ?? "",
        country_code: profile.country_code ?? "",
        mobile: profile.mobile ?? "",
        gender: profile.gender ?? "",
        qualification: profile.qualification ?? "",
        education: profile.education ?? "",
      });
      setImageFile(null);
      setImagePreview(profile.image ?? null);
      const loc = profile.location;
      setSelectedCity(
        Array.isArray(loc) && loc.length > 0 ? { id: 0, name: String(loc[0]) } : null
      );
      setCitySearch("");
      setCityOptions([]);
      setCityDropdownOpen(false);
      setSelectedLanguageIds(Array.isArray(profile.language) ? profile.language.map((l) => l.id) : []);
      setLanguageSearch("");
      setLanguageDropdownOpen(false);
      try {
        const list = await getLanguageList();
        setLanguageOptions(list);
      } catch {
        setLanguageOptions([]);
      }
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const location: number[] | undefined =
        selectedCity && selectedCity.id > 0 ? [selectedCity.id] : undefined;
      const payload: StudentProfilePatch = {
        first_name: form.first_name || undefined,
        last_name: form.last_name || undefined,
        email: form.email || undefined,
        country_code: form.country_code || undefined,
        mobile: form.mobile || undefined,
        gender: form.gender || undefined,
        qualification: form.qualification || undefined,
        education: form.education || undefined,
        ...(location !== undefined && { location }),
        language: selectedLanguageIds.length > 0 ? selectedLanguageIds : undefined,
        image: imageFile ?? undefined,
      };
      await patchStudentProfile(payload);
      toast.success("Profile updated successfully");
      setModalOpen(false);
      await fetchProfile();
      await fetchAndStoreStudentProfile();
    } catch (error: unknown) {
      const msg = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredLanguages = languageSearch.trim()
    ? languageOptions.filter((l) =>
        l.name.toLowerCase().includes(languageSearch.toLowerCase())
      )
    : languageOptions;
  const addLanguage = (opt: LanguageOption) => {
    if (selectedLanguageIds.includes(opt.id)) return;
    setSelectedLanguageIds((prev) => [...prev, opt.id]);
    setLanguageSearch("");
    setLanguageDropdownOpen(false);
  };
  const removeLanguage = (id: number) => {
    setSelectedLanguageIds((prev) => prev.filter((x) => x !== id));
  };

  const addLocation = (city: City) => {
    setSelectedCity({ id: city.id, name: city.name });
    setCitySearch("");
    setCityDropdownOpen(false);
  };
  const removeLocation = () => {
    setSelectedCity(null);
  };

  useEffect(() => {
    if (!modalOpen) return;
    if (citySearchTimeoutRef.current) clearTimeout(citySearchTimeoutRef.current);
    const term = citySearch.trim();
    if (!term) {
      setCityOptions([]);
      setCitySearching(false);
      return;
    }
    setCitySearching(true);
    citySearchTimeoutRef.current = setTimeout(() => {
      searchCities(term, 1, 20)
        .then((res) => {
          setCityOptions(res.data ?? []);
        })
        .catch(() => setCityOptions([]))
        .finally(() => setCitySearching(false));
    }, 300);
    return () => {
      if (citySearchTimeoutRef.current) clearTimeout(citySearchTimeoutRef.current);
    };
  }, [modalOpen, citySearch]);

  useEffect(() => {
    if (!modalOpen || (!languageDropdownOpen && !cityDropdownOpen)) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (languageDropdownRef.current?.contains(target) || cityDropdownRef.current?.contains(target)) return;
      setLanguageDropdownOpen(false);
      setCityDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [modalOpen, languageDropdownOpen, cityDropdownOpen]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-0 pt-0 pb-6 sm:px-6 sm:py-8">
        <div className="animate-pulse rounded-none border-0 shadow-none bg-white p-8 sm:rounded-2xl sm:border sm:shadow-sm">
          <div className="h-32 w-32 rounded-full bg-gray-200 mb-6" />
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-100 rounded mb-8" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-0 pt-0 pb-6 sm:px-6 sm:py-8">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || profile.username;
  const imageUrl = profile.image;

  return (
    <>
      <div className="mx-auto max-w-4xl px-0 pt-0 pb-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-none border-0 shadow-none bg-white sm:rounded-2xl sm:border sm:shadow-sm">
          <div className="relative h-28 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
            <div className="absolute bottom-0 left-8 translate-y-1/2">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                {imageUrl ? (
                  <Image src={imageUrl} alt={fullName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <UserCircle className="h-14 w-14 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="mt-1 text-gray-600">@{profile.username}</p>
              </div>
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
                Update profile
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-0.5 text-gray-900">{profile.email}</p>
                </div>
              </div>
              {profile.mobile && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-0.5 text-gray-900">
                      {profile.country_code && profile.country_code !== "undefined" ? `${profile.country_code} ` : ""}
                      {profile.mobile}
                    </p>
                  </div>
                </div>
              )}
              {profile.gender && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="mt-0.5 text-gray-900">{profile.gender}</p>
                  </div>
                </div>
              )}
              {profile.location && profile.location.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-0.5 text-gray-900">{profile.location.join(", ")}</p>
                  </div>
                </div>
              )}
              {profile.qualification && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Qualification</p>
                    <p className="mt-0.5 text-gray-900">{profile.qualification}</p>
                  </div>
                </div>
              )}
              {profile.education && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education</p>
                    <p className="mt-0.5 text-gray-900">{profile.education}</p>
                  </div>
                </div>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2">
                  <Code className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s.id} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.language && profile.language.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Languages className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.language.map((l) => (
                    <span key={l.id} className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Update profile"
        onClose={() => !saving && setModalOpen(false)}
        panelClassName="p-0 max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
        headerClassName="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-4"
        bodyClassName="px-6 pt-4 space-y-4"
        footer={
          <div className="flex justify-end gap-2 px-6 pb-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country code</label>
              <input
                type="text"
                value={form.country_code}
                onChange={(e) => setForm((p) => ({ ...p, country_code: e.target.value }))}
                placeholder="+91"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.mobile}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setForm((p) => ({ ...p, mobile: digits }));
                }}
                placeholder="Digits only"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              type="text"
              value={form.qualification}
              onChange={(e) => setForm((p) => ({ ...p, qualification: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
            <input
              type="text"
              value={form.education}
              onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div ref={cityDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            {selectedCity && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 border border-orange-100">
                  {selectedCity.name}
                  <button
                    type="button"
                    onClick={removeLocation}
                    className="rounded-full p-0.5 hover:bg-orange-200/60"
                    aria-label={`Remove ${selectedCity.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            )}
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onFocus={() => setCityDropdownOpen(true)}
              placeholder="Search cities…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {cityDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-y-auto">
                {citySearching ? (
                  <p className="px-3 py-2 text-sm text-gray-500">Searching…</p>
                ) : !citySearch.trim() ? (
                  <p className="px-3 py-2 text-sm text-gray-500">Type to search cities.</p>
                ) : cityOptions.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-500">No cities found.</p>
                ) : (
                  cityOptions.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => addLocation(city)}
                      disabled={selectedCity?.id === city.id}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:bg-orange-50 disabled:text-orange-700 disabled:cursor-default"
                    >
                      {city.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div ref={languageDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedLanguageIds.map((id) => {
                const opt = languageOptions.find((l) => l.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-100"
                  >
                    {opt?.name ?? String(id)}
                    <button
                      type="button"
                      onClick={() => removeLanguage(id)}
                      className="rounded-full p-0.5 hover:bg-green-200/60"
                      aria-label={`Remove ${opt?.name ?? id}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
            <input
              type="text"
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              onFocus={() => setLanguageDropdownOpen(true)}
              placeholder="Search and select languages…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {languageDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-48 overflow-y-auto">
                {filteredLanguages.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-500">No languages match.</p>
                ) : (
                  filteredLanguages.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => addLanguage(opt)}
                      disabled={selectedLanguageIds.includes(opt.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:bg-green-50 disabled:text-green-700 disabled:cursor-default"
                    >
                      {opt.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-gray-100">
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white file:hover:bg-brand/90"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
