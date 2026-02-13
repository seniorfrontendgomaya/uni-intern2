"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useSuperLogin } from "@/hooks/useAuth";
import { fetchAndStoreStudentProfile } from "@/services/student-profile.service";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("company25@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [loginType, setLoginType] = useState<"company" | "superadmin">(
    "company"
  );

  const { login: loginCompany, loading: loadingCompany } = useLogin();
  const { login: loginSuper, loading: loadingSuper } = useSuperLogin();
  const loading = loadingCompany || loadingSuper;

  const DEMO_CREDENTIALS = useMemo(
    () => [
      {
        id: "superadmin",
        label: "SUPERADMIN",
        loginType: "superadmin" as const,
        email: "admin@gmail.com",
        password: "admin",
      },
      {
        id: "company",
        label: "COMPANY",
        loginType: "company" as const,
        email: "company25@gmail.com",
        password: "Test@123",
      },
      // {
      //   id: "student",
      //   label: "STUDENT",
      //   loginType: "company" as const,
      //   email: "abc5@gamil.com",
      //   password: "Test@123",
      // },
      {
        id: "university",
        label: "UNIVERSITY",
        loginType: "company" as const,
        email: "ramkumar@gmail.com",
        password: "Test@123",
      },
    ],
    []
  );

  const defaultTargetForRole = useMemo(() => {
    return (role: string) =>
      role === "SUPERADMIN"
        ? "/superadmin/city"
        : role === "UNIVERSITY"
          ? "/university"
          : role === "STUDENT"
            ? "/"
            : "/company";
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("role") ?? "SUPERADMIN"
        : "SUPERADMIN";

    const target =
      role === "SUPERADMIN"
        ? "/superadmin/city"
        : role === "UNIVERSITY"
          ? "/university"
          : role === "STUDENT"
            ? "/"
            : "/company";

    router.replace(target);
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result =
      loginType === "superadmin"
        ? await loginSuper({ email, password })
        : await loginCompany({ email, password });
    if (!result.ok) return;
  
    if (result.data) {
      const role = result.data.user_type || "SUPERADMIN";
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("role", role);

      if (role === "STUDENT") {
        await fetchAndStoreStudentProfile();
      }

      const target =
        role === "SUPERADMIN"
          ? "/superadmin/city"
          : role === "UNIVERSITY"
            ? "/university"
            : role === "STUDENT"
              ? "/"
              : "/company";
      router.replace(target);
    }
    toast.success("Login successful");

  };

  return (
    <main className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Uni-Intern
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div className="rounded-2xl border bg-background p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    loginType === "company"
                      ? "bg-brand text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setLoginType("company")}
                >
                  Others
                </button>
                <button
                  type="button"
                  className={`h-10 rounded-xl text-xs font-semibold transition ${
                    loginType === "superadmin"
                      ? "bg-brand text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setLoginType("superadmin")}
                >
                  Superadmin
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Demo credentials
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click one to auto-fill the form.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {DEMO_CREDENTIALS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLoginType(item.loginType);
                      setEmail(item.email);
                      setPassword(item.password);
                    }}
                    className="group rounded-2xl border bg-card p-3 text-left transition hover:border-brand/40 hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-wide text-foreground">
                        {item.label}
                      </p>
                      <span className="rounded-lg border bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground transition group-hover:text-foreground">
                        Use
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Email:</span>{" "}
                        <span className="text-foreground">{item.email}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="text-foreground">{item.password}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Email
              </label>
              <input
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Password
              </label>
              <input
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to use this system responsibly.
        </p>
      </div>
    </main>
  );
}