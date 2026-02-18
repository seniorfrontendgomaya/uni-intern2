"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Upload,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { UNIVERSITY_THEME } from "@/lib/university-theme";
import { useUniversityProfile } from "@/hooks/useUniversityProfile";
import type { UniversityProfilePatch } from "@/types/university-profile";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const normalizeText = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toSafeHref = (value: string) => {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

function getInitials(name: string | null) {
  return (
    (name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U"
  );
}

type ProfileFormState = {
  name: string;
  description: string;
  university_location: string;
  established_year: string;
  website: string;
  email: string;
  mobile: string;
};

export default function UniversityProfilePage() {
  const { profile, loading, saving, patchProfile, fetchProfile } = useUniversityProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [establishedYearError, setEstablishedYearError] = useState<string | null>(null);

  const initialForm = useMemo<ProfileFormState>(() => {
    return {
      name: profile?.name ?? "",
      description: profile?.description ?? "",
      university_location: profile?.university_location ?? "",
      established_year:
        profile?.established_year != null ? String(profile.established_year) : "",
      website: profile?.website ?? "",
      email: profile?.email ?? "",
      mobile: (profile?.mobile ?? "").replace(/\D/g, "").slice(0, 10),
    };
  }, [profile]);

  const [form, setForm] = useState<ProfileFormState>(initialForm);

  useEffect(() => {
    if (!editOpen) return;
    setForm(initialForm);
    setLogoFile(null);
    setLogoPreviewUrl(null);
    setEstablishedYearError(null);
  }, [editOpen, initialForm]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const displayLogo = logoPreviewUrl || profile?.logo || null;
  const displayName = profile?.name ?? "University";
  const initials = getInitials(profile?.name ?? null);

  const buildPatch = (): UniversityProfilePatch => {
    const patch: UniversityProfilePatch = {};
    const current = profile;
    if (!current) return patch;

    const name = normalizeText(form.name);
    const description = normalizeText(form.description);
    const university_location = normalizeText(form.university_location);
    const website = normalizeText(form.website);
    const email = normalizeText(form.email);
    const mobileDigits = form.mobile.replace(/\D/g, "").slice(0, 10);
    const mobile = mobileDigits.length === 0 ? null : (mobileDigits.length === 10 ? mobileDigits : undefined);

    const yearRaw = form.established_year.trim();
    const parsed = yearRaw ? Number.parseInt(yearRaw, 10) : null;
    const established_year =
      Number.isFinite(parsed) && parsed! >= 1600 && parsed! <= 2050
        ? (parsed as number)
        : null;

    if (name !== (current.name ?? null)) patch.name = name;
    if (description !== (current.description ?? null)) patch.description = description;
    if (university_location !== (current.university_location ?? null))
      patch.university_location = university_location;
    if (website !== (current.website ?? null)) patch.website = website;
    if (email !== (current.email ?? null)) patch.email = email;
    if (mobile !== undefined && mobile !== (current.mobile ?? null)) patch.mobile = mobile;
    if (
      established_year != null &&
      established_year !== (current.established_year ?? null)
    )
      patch.established_year = established_year;

    return patch;
  };

  const hasAnyChanges = useMemo(() => {
    if (!profile) return false;
    const patch = buildPatch();
    const hasPatchChanges = Object.keys(patch).length > 0;
    return hasPatchChanges || Boolean(logoFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, form, logoFile]);

  const handleSave = async () => {
    if (!profile) return;

    const emailTrimmed = form.email.trim();
    if (!emailTrimmed) {
      toast.error("Email is required");
      return;
    }
    // Basic email format check to complement HTML5 validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailTrimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const mobileDigits = form.mobile.replace(/\D/g, "");
    if (mobileDigits.length > 0 && mobileDigits.length !== 10) {
      toast.error("Mobile must be exactly 10 digits (not less, not more)");
      return;
    }

    const yearRaw = form.established_year.trim();
    if (yearRaw) {
      const year = Number.parseInt(yearRaw, 10);
      if (!Number.isFinite(year) || year < 1600 || year > 2050) {
        setEstablishedYearError("Invalid year. Enter a year between 1600 and 2050.");
        toast.error("Invalid year. Enter a year between 1600 and 2050.");
        return;
      }
    }
    setEstablishedYearError(null);

    const patch = buildPatch();
    const hasFieldChanges = Object.keys(patch).length > 0;

    if (!hasFieldChanges && !logoFile) {
      setEditOpen(false);
      return;
    }

    const payload: UniversityProfilePatch | FormData = (() => {
      if (!logoFile) return patch;

      const fd = new FormData();
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined) return;
        // FormData can't append null; use empty string to represent clearing a field.
        fd.append(key, value === null ? "" : String(value));
      });
      fd.append("logo", logoFile);
      return fd;
    })();

    const res = await patchProfile(payload);
    if (!res.ok) return;

    toast.success("Profile updated");
    setEditOpen(false);
    // Refresh profile data to ensure UI is updated
    await fetchProfile();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your university profile details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          disabled={loading || !profile}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition disabled:opacity-60",
            UNIVERSITY_THEME.buttonPrimary
          )}
        >
          <Pencil className="h-4 w-4" />
          Update Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
          <div className={cx("absolute left-0 top-0 h-full w-1")} />

          <div className="flex flex-col gap-5 pl-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              {displayLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayLogo}
                  alt={displayName}
                  className="h-16 w-16 rounded-2xl border object-cover"
                />
              ) : (
                <div
                  className={cx(
                    "flex h-16 w-16 items-center justify-center rounded-2xl border text-lg font-semibold",
                    UNIVERSITY_THEME.avatarMuted,
                    UNIVERSITY_THEME.avatarAccent
                  )}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-foreground">
                  {displayName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  {profile?.university_location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.university_location}
                    </span>
                  ) : null}
                  {profile?.established_year ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Established {profile.established_year}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                University
              </span>
            </div>
          </div>

          <div className="mt-6 pl-4">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                About
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {profile?.description?.trim()
                  ? profile.description
                  : "Add a short description to help companies understand your university."}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 pl-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contact
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {profile?.email ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {profile?.mobile ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              <div className="mt-3 text-sm">
                {profile?.website ? (
                  <a
                    className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline"
                    href={toSafeHref(profile.website)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{profile.website}</span>
                  </a>
                ) : (
                  <span className="font-medium text-foreground">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        title="Update profile"
        onClose={() => setEditOpen(false)}
        accentVariant="university"
        panelClassName="w-[94vw] !max-w-5xl"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Tip: only changed fields will be sent.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className={cx(
                  "h-9 rounded-full border px-4 text-xs font-semibold transition hover:text-foreground",
                  UNIVERSITY_THEME.buttonOutline
                )}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasAnyChanges || saving}
                onClick={handleSave}
                className={cx(
                  "inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold shadow-sm transition disabled:opacity-60",
                  UNIVERSITY_THEME.buttonPrimary
                )}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="University name"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  University location
                </span>
                <input
                  value={form.university_location}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      university_location: e.target.value,
                    }))
                  }
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="City / State"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Established year (1600–2050)
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1600}
                  max={2050}
                  value={form.established_year}
                  onChange={(e) => {
                    setEstablishedYearError(null);
                    setForm((s) => ({
                      ...s,
                      established_year: e.target.value,
                    }));
                  }}
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    establishedYearError && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                    !establishedYearError && UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="e.g. 1998"
                />
                {establishedYearError && (
                  <p className="text-xs text-red-600">{establishedYearError}</p>
                )}
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Website
                </span>
                <input
                  value={form.website}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, website: e.target.value }))
                  }
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="example.edu"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="contact@university.edu"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Mobile (exactly 10 digits)
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => {
                    const next = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm((s) => ({ ...s, mobile: next }));
                  }}
                  className={cx(
                    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition",
                    UNIVERSITY_THEME.inputFocus
                  )}
                  placeholder="e.g. 9876543210"
                />
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
                className={cx(
                  "min-h-[140px] w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none transition",
                  UNIVERSITY_THEME.inputFocus
                )}
                placeholder="A short description about your university..."
              />
            </label>

            <div className="my-6 h-px bg-border" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {displayLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayLogo}
                    alt="University logo"
                    className="h-16 w-16 rounded-2xl border object-cover"
                  />
                ) : (
                  <div
                    className={cx(
                      "flex h-16 w-16 items-center justify-center rounded-2xl border text-lg font-semibold",
                      UNIVERSITY_THEME.avatarMuted,
                      UNIVERSITY_THEME.avatarAccent
                    )}
                  >
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Logo</p>
                  {logoFile ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {logoFile.name}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-background px-4 py-2 text-sm">
                  <span className="text-muted-foreground">
                    {logoFile ? "Change file" : "Choose file"}
                  </span>
                  <span className="rounded-full bg-university-accent px-3 py-1 text-xs font-semibold text-white">
                    <span className="inline-flex items-center gap-2">
                      <Upload className="h-3.5 w-3.5" />
                      Browse
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {logoFile ? (
                  <button
                    type="button"
                    className={cx(
                      "h-10 rounded-xl border px-4 text-xs font-semibold transition hover:text-foreground",
                      UNIVERSITY_THEME.buttonOutline
                    )}
                    onClick={() => setLogoFile(null)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

