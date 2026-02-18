"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { InternshipMegaMenu } from "./internship-mega-menu";

const OPEN_LOGIN_MODAL_EVENT = "open-login-modal";

export interface InternshipNavItemProps {
  /** Label in the nav bar */
  label?: string;
  /** Base path for internship pages (e.g. "/internships" or "/student/internships") */
  basePath: string;
  /** Optional class for the trigger link/button */
  className?: string;
}

export function InternshipNavItem({
  label = "Internship",
  basePath,
  className = "transition hover:text-foreground",
}: InternshipNavItemProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="inline-flex items-center gap-0.5"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link
          href={basePath}
          className={className}
          onClick={(e) => {
            if (typeof window === "undefined") return;
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            const isStudent = Boolean(token && role === "STUDENT");
            const isStudentPath = basePath.startsWith("/student/");
            if (isStudentPath && !isStudent) {
              e.preventDefault();
              window.dispatchEvent(new Event(OPEN_LOGIN_MODAL_EVENT));
              return;
            }
            setOpen(false);
          }}
        >
          {label}
        </Link>
        <ChevronDown
          className={`h-4 w-4 text-current transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden
        />
      </div>

      {open ? (
        <div
          className="absolute left-1/2 top-full z-50 pt-2 -translate-x-1/2"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <InternshipMegaMenu
            basePath={basePath}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
