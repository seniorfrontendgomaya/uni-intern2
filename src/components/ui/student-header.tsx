"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, UserCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UniInternLogo } from "@/components/ui/uniintern-logo";
import { InternshipNavItem } from "@/components/ui/internship-nav-item";
import { CoursesNavItem } from "@/components/ui/courses-nav-item";
import { clearStoredStudentProfile } from "@/services/student-profile.service";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/student" },
  { label: "Resume", href: "/student/resume" },
  { label: "Internship", href: "/student/internships" },
  { label: "Courses", href: "/student/courses" },
  { label: "Chat", href: "/student/chat" },
];

export function StudentProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = localStorage.getItem("user_image");
      const name = localStorage.getItem("user_name");
      setUserImage(img);
      setUserName(name);
    }
  }, []);

  const getUserInitial = () => {
    if (userName) {
      const parts = userName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
      }
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const goToProfile = () => {
    setOpen(false);
    router.push("/student/profile");
  };

  const goToChangePassword = () => {
    setOpen(false);
    router.push("/student/change-password");
  };

  const goToReferEarn = () => {
    setOpen(false);
    router.push("/student/refer-earn");
  };

  const goToRequestCourses = () => {
    setOpen(false);
    router.push("/student/request-courses");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    clearStoredStudentProfile();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("uniintern:auth-changed"));
    }
    setOpen(false);
    router.replace("/");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1.5 text-xs font-semibold text-foreground transition"
      >
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full  border bg-gray-100">
          {userImage && !imageError ? (
            <img
              src={userImage}
              alt=""
              className="h-full w-full object-cover border-0.5 rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
              {getUserInitial()}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-md border bg-white text-sm shadow-lg">
          <button
            type="button"
            onClick={goToProfile}
            className="block w-full px-3 py-2 text-left hover:bg-muted"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={goToChangePassword}
            className="block w-full px-3 py-2 text-left hover:bg-muted"
          >
            Change password
          </button>
          <button
            type="button"
            onClick={goToReferEarn}
            className="block w-full px-3 py-2 text-left hover:bg-muted"
          >
            Refer & Earn
          </button>
          <button
            type="button"
            onClick={goToRequestCourses}
            className="block w-full px-3 py-2 text-left hover:bg-muted"
          >
            Request courses
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function StudentHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <Link href="/" className="mr-auto font-bold text-gray-900">
          <UniInternLogo className="h-5 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((item) =>
            item.label === "Internship" ? (
              <InternshipNavItem
                key={item.href}
                basePath={item.href}
                className="transition hover:text-foreground text-muted-foreground"
              />
            ) : item.label === "Courses" ? (
              <CoursesNavItem
                key={item.href}
                basePath={item.href}
                className="transition hover:text-foreground text-muted-foreground"
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
          <StudentProfileMenu />
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <StudentProfileMenu />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-foreground shadow-sm transition hover:border-primary/40"
            aria-label="Toggle navigation"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav - overlay below header, ease open/close */}
      <div
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full z-40 border-t border-border bg-background/95 px-4 pb-3 pt-2 shadow-lg backdrop-blur md:hidden transition-all duration-400 ease-in-out ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 transition hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default StudentHeader;

