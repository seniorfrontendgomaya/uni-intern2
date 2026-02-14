"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { clearStoredStudentProfile } from "@/services/student-profile.service";

export default function StudentChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "STUDENT") {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("old_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);
      await api<{ message?: string }>("change_password/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      clearStoredStudentProfile();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("uniintern:auth-changed"));
      }
      toast.success("Password changed successfully");
      router.replace("/");
    } catch (error: unknown) {
      const err = error as { message?: string; detail?: string };
      toast.error(err?.message || err?.detail || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-3 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">Change Password</h1>
              <p className="mt-1 text-sm text-blue-100">Update your password to keep your account secure</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter old password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Changing Password…" : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
