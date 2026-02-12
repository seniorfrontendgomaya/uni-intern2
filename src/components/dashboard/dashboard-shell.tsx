"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Building2, GraduationCap, Menu, ShieldCheck, University } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ForbiddenPage } from "@/components/pages/forbidden-page";
import { defaultRouteForRole } from "@/lib/route-guard";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Job Type",
    href: "/company/job-type",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    label: "Category",
    href: "/company/category",
    icon: <University className="h-4 w-4" />,
  },
  {
    label: "Designation",
    href: "/company/designation",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    label: "Skill",
    href: "/company/skill",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    label: "Courses",
    href: "/company/courses",
    icon: <University className="h-4 w-4" />,
  },
  {
    label: "Perk",
    href: "/company/perk",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    label: "Vacancy",
    href: "/company/vacancy",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    label: "Company",
    href: "/company",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    label: "Resume List",
    href: "/company/resume-list",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    label: "Chat",
    href: "/company/chat",
    icon: <University className="h-4 w-4" />,
  },
];

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const match = navItems.find((item) => item.href === pathname);
    return match?.label ?? "Company Dashboard";
  }, [pathname]);

  const [auth, setAuth] = useState<{ token: string | null; role: string | null } | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setAuth({ token, role });
    if (!token) router.replace("/login");
  }, [router]);

  const token = auth?.token ?? null;
  const role = auth?.role ?? null;

  const allowedPrefix = "/company";
  const pathOk =
    pathname === allowedPrefix || pathname.startsWith(`${allowedPrefix}/`);
  const roleOk = role !== "SUPERADMIN" && role !== "UNIVERSITY";
  const forbidden = Boolean(token) && !(pathOk && roleOk);

  // Prevent hydration mismatch: render a stable placeholder until mounted.
  if (!token) return <div className="h-screen bg-background" />;

  if (forbidden) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <ForbiddenPage homeHref={defaultRouteForRole(role)} />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <div className="h-full lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-full border-r bg-card/60 backdrop-blur lg:flex lg:flex-col lg:gap-8 lg:px-6 lg:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Uni-Intern</p>
              <p className="text-xs text-muted-foreground">
                Talent platform suite
              </p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "group rounded-2xl border border-transparent px-4 py-3 transition",
                    "hover:border-border hover:bg-accent/60",
                    isActive && "border-border bg-accent/70"
                  )}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-muted-foreground group-hover:text-foreground">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
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
                  Dashboard panel
                </p>
                <h1 className="text-lg font-semibold">{pageTitle}</h1>
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
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background px-6 py-8 shadow-lg transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              U
            </div>
            <div>
              <p className="text-sm font-semibold">Uni-Intern</p>
              <p className="text-xs text-muted-foreground">Talent platform</p>
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
        <nav className="mt-8 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "rounded-2xl border px-4 py-3 transition",
                  isActive
                    ? "border-border bg-accent/70"
                    : "border-transparent hover:border-border hover:bg-accent/60"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition hover:border-brand/40"
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
          // Use Next.js client-side routing instead of full page reload
          router.replace("/");
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
}
