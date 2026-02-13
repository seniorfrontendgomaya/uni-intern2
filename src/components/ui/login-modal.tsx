"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLogin, useSuperLogin } from "@/hooks/useAuth";
import { fetchAndStoreStudentProfile } from "@/services/student-profile.service";
import { UniInternLogo } from "./uniintern-logo";
import { UnauthorizedError } from "@/errors/http.errors";

type LoginRole = "Student" | "Company" | "University" | "Admin";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Map modal role to login API type
  const getLoginType = (role: LoginRole): "company" | "superadmin" => {
    return role === "Admin" ? "superadmin" : "company";
  };

  const { login: loginCompany, loading: loadingCompany } = useLogin();
  const { login: loginSuper, loading: loadingSuper } = useSuperLogin();
  const loading = loadingCompany || loadingSuper;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginType = getLoginType(selectedRole);
    
    try {
      const result =
        loginType === "superadmin"
          ? await loginSuper({ email, password })
          : await loginCompany({ email, password });

      if (!result.ok) {
        // Check if it's an UnauthorizedError (login failure)
        // Don't let handleError redirect - just show a toast
        if (result.error instanceof UnauthorizedError) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          const errorMessage =
            result.error instanceof Error
              ? result.error.message
              : "Login failed. Please check your credentials.";
          toast.error(errorMessage);
        }
        return;
      }

      if (result.data) {
        const role = result.data.user_type || "SUPERADMIN";
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", role);

        if (role === "STUDENT") {
          await fetchAndStoreStudentProfile();
        }

        // Map role to redirect path
        const target =
          role === "SUPERADMIN"
            ? "/superadmin/city"
            : role === "UNIVERSITY"
              ? "/university"
              : role === "STUDENT"
                ? "/"
                : "/company";

        toast.success("Login successful");
        onClose(); // Close modal before redirect

        // Dispatch auth-changed event to update header immediately
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("uniintern:auth-changed"));
        }

        router.replace(target);
      }
    } catch (error) {
      // Catch any unexpected errors to prevent page reload
      if (error instanceof UnauthorizedError) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal Container - Centered */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-5xl overflow-y-auto max-h-[90vh] pointer-events-auto">
          {/* Modal */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-10">
          {/* Left side - Illustration */}
          <div className="relative hidden h-[560px] from-blue-50 to-blue-100 md:block col-span-6">
            <Image
              src="/assets/sign-in.webp"
              alt="Login illustration"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col justify-center p-8 md:p-10 w-full md:col-span-4">
            {/* Logo */}
            <div className="mb-3 flex justify-center">
              <UniInternLogo
                className="h-6 w-auto"
                uniFill="#000"
                internStroke="#6b7280"
                internStrokeWidth={1.2}
              />
            </div>

            {/* Login Title */}
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">Login</h2>

            {/* Role Selection */}
            <div className="mb-6 flex gap-2">
              {(["Student", "Company", "University", "Admin"] as LoginRole[]).map(
                (role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex-1 rounded-lg border-1.5 px-2 py-2 text-xs font-medium transition ${
                      selectedRole === role
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-orange-200 bg-orange-50/50 text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    {role}
                  </button>
                )
              )}
            </div>

            {/* Separator */}
            <div className="mb-6 h-px bg-blue-200" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
              <div className="space-y-5 w-full">
                {/* Email Input */}
                <div className="w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full rounded-xl h-11 border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : `Login as ${selectedRole}`}
              </button>
            </form>
          </div>
        </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}





