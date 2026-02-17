"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UniInternLogo } from "@/components/ui/uniintern-logo";
import { LoginModal } from "@/components/ui/login-modal";
import { StudentProfileMenu } from "@/components/ui/student-header";
import { InternshipNavItem } from "@/components/ui/internship-nav-item";
import { CoursesNavItem } from "@/components/ui/courses-nav-item";

type NavItem = {
  label: string;
  href: string;
};

const publicNavItems: NavItem[] = [
  { label: "Internship", href: "/internships" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact-us" },
];

const studentNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Resume", href: "/student/resume" },
  { label: "Internship", href: "/student/internships" },
  { label: "Courses", href: "/student/courses" },
  { label: "Chat", href: "/student/chat" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadAuth = () => {
      setRole(localStorage.getItem("role"));
      setHasToken(!!localStorage.getItem("token"));
    };

    loadAuth();
    window.addEventListener("uniintern:auth-changed", loadAuth);

    return () => {
      window.removeEventListener("uniintern:auth-changed", loadAuth);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOpenLoginModal = () => setIsLoginModalOpen(true);
    window.addEventListener("open-login-modal", onOpenLoginModal);
    return () => window.removeEventListener("open-login-modal", onOpenLoginModal);
  }, []);

  const isStudent = role === "STUDENT";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <Link href="/" className="mr-auto font-bold text-gray-900">
          <UniInternLogo className="h-5 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {(isStudent ? studentNavItems : publicNavItems).map((item) =>
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
          {isStudent ? (
            <StudentProfileMenu />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
            >
              Login
            </button>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {isStudent ? (
            <StudentProfileMenu />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
            >
              Login
            </button>
          )}
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

      {/* Mobile nav */}
      {open ? (
        <div className="border-t bg-background/95 px-4 pb-3 pt-2 shadow-sm sm:px-6 md:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
            {(isStudent ? studentNavItems : publicNavItems).map((item) => {
              const isProtected = (item.label === "Internship" || item.label === "Courses") && !hasToken;
              if (isProtected) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    className="rounded-xl px-3 py-2 text-left transition hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      setOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 transition hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}

export default LandingHeader;

