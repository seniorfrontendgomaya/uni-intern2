"use client";

import { useState } from "react";
import { useLogin, useSuperLogin } from "@/hooks/useAuth";
import type { LoginPayload } from "@/services/auth.service";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com")
  const [password, setPassword] = useState("admin")
  const [loginType, setLoginType] = useState<"company" | "superadmin">(
    "company"
  );

  const { login: loginCompany, loading: loadingCompany } = useLogin();
  const { login: loginSuper, loading: loadingSuper } = useSuperLogin();
  const loading = loadingCompany || loadingSuper;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result =
      loginType === "superadmin"
        ? await loginSuper({ email, password })
        : await loginCompany({ email, password });
    if (!result.ok) return;
  
    if (result.data) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("role", result.data.user_type || "SUPERADMIN");
      
      window.location.href = '/company/job-type';
    }
    console.log(result.data);
    toast.success('Login successful');

  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              loginType === "company"
                ? "bg-brand text-white"
                : "border text-muted-foreground"
            }`}
            onClick={() => setLoginType("company")}
          >
            Company
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              loginType === "superadmin"
                ? "bg-brand text-white"
                : "border text-muted-foreground"
            }`}
            onClick={() => setLoginType("superadmin")}
          >
            Superadmin
          </button>
        </div>
        <input
          className="w-full rounded border p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}