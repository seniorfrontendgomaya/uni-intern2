"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Lock } from "lucide-react";

export function ForbiddenPage({ homeHref }: { homeHref: string }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-card p-10 text-center shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/20" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-destructive/20 bg-destructive/5">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              403 Forbidden
            </h2>
            <p className="text-base text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-11 items-center gap-2 rounded-xl border bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
            <Link
              href={homeHref}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:shadow-lg"
            >
              <Home className="h-4 w-4" />
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

