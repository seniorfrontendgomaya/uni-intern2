"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Folder,
  GraduationCap,
  Menu,
  PlayCircle,
  ShieldCheck,
  University,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "City", href: "/superadmin/city", icon: <Building2 className="h-4 w-4" /> },
  { label: "Job Type", href: "/superadmin/job-type", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Category", href: "/superadmin/category", icon: <University className="h-4 w-4" /> },
  { label: "Designation", href: "/superadmin/designation", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Skill", href: "/superadmin/skill", icon: <GraduationCap className="h-4 w-4" /> },
  { label: "Courses", href: "/superadmin/courses", icon: <University className="h-4 w-4" /> },
  { label: "Perk", href: "/superadmin/perk", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Companies", href: "/superadmin/companies", icon: <Building2 className="h-4 w-4" /> },
  { label: "Universities", href: "/superadmin/universities", icon: <University className="h-4 w-4" /> },
  { label: "Video Courses", href: "/superadmin/video-category", icon: <PlayCircle className="h-4 w-4" /> },
  // { label: "Video Courses", href: "/superadmin/video-courses", icon: <PlayCircle className="h-4 w-4" /> },
  { label: "Resume List", href: "/superadmin/resume-list", icon: <GraduationCap className="h-4 w-4" /> },
];

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function SuperadminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const match = navItems.find((item) => item.href === pathname);
    return match?.label ?? "Superadmin Dashboard";
  }, [pathname]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <div className="h-full lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-full border-r bg-background lg:flex lg:flex-col lg:gap-6 lg:px-4 lg:py-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Uni-Intern</p>
              <p className="text-xs text-muted-foreground">Superadmin</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "group flex items-center gap-3 p-3 text-sm font-medium transition",
                    "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    isActive && "bg-rose-50 text-rose-600"
                  )}
                >
                  <span
                    className={cx(
                      "text-muted-foreground transition",
                      isActive ? "text-rose-500" : "group-hover:text-foreground"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition hover:border-brand/40"
            onClick={() => setLogoutOpen(true)}
          >
            Logout
          </button>
        </aside>

        <div className="flex h-full min-h-0 flex-col">
          <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 lg:px-10">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-card text-foreground shadow-sm lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex flex-1 flex-col">
                <p className="text-xs uppercase text-muted-foreground">
                  Superadmin panel
                </p>
                {/* <h1 className="text-lg font-semibold">{pageTitle}</h1> */}
              </div>
              <button
                type="button"
                className="hidden items-center justify-center rounded-full border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-brand/40 md:inline-flex"
                onClick={() => setLogoutOpen(true)}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background px-4 py-6 shadow-lg transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Uni-Intern</p>
              <p className="text-xs text-muted-foreground">Superadmin</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg border px-3 py-1 text-xs text-muted-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "group flex items-center gap-3 py-2 text-sm font-medium transition",
                  "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  isActive && "bg-rose-50 text-rose-600"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className={cx(
                    "text-muted-foreground transition",
                    isActive ? "text-rose-500" : "group-hover:text-foreground"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-full border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition hover:border-brand/40"
          onClick={() => setLogoutOpen(true)}
        >
          Logout
        </button>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        title="Logout?"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setLogoutOpen(false);
          window.location.assign("/login");
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
}
