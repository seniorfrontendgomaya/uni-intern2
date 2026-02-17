"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [homeHref, setHomeHref] = useState("/");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "SUPERADMIN") {
      setHomeHref("/superadmin/city");
    } else if (role === "UNIVERSITY") {
      setHomeHref("/university");
    } else if (role === "COMPANY") {
      setHomeHref("/company");
    } else {
      setHomeHref("/");
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Soft background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--muted)/0.4),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(var(--primary)/0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* 404 visual */}
        <div className="mb-8 flex aspect-square w-full max-w-[280px] items-center justify-center">
          {!imgError ? (
            <Image
              src="/assets/404.png"
              alt=""
              width={280}
              height={280}
              className="h-full w-full object-contain object-center"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border/60 bg-muted/20">
              <SearchX className="h-24 w-24 text-muted-foreground/70" strokeWidth={1.25} />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-12 items-center gap-2.5 rounded-2xl border border-border bg-card px-6 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-border/80 hover:bg-muted/60 hover:shadow-md active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
            Go back
          </button>
          <Link
            href={homeHref}
            className="inline-flex h-12 items-center gap-2.5 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
          >
            <Home className="h-4 w-4 shrink-0" strokeWidth={2} />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
