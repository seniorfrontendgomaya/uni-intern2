"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, GraduationCap, Code, Languages, UserCircle } from "lucide-react";
import { getStudentProfile } from "@/services/student-profile.service";
import type { StudentProfile } from "@/types/student-profile";
import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token || role !== "STUDENT") {
        router.replace("/");
        return;
      }
    };

    checkAuth();

    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        if (response.data && response.data.length > 0) {
          console.log("Profile data:", response.data[0]);
          setProfile(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Skeleton Card */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-xl animate-pulse">
              {/* Header Section with Gradient */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
                <div className="absolute inset-0 bg-black/5" />
                
                {/* Profile Image Skeleton */}
                <div className="absolute bottom-0 left-8 translate-y-1/2">
                  <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-300 shadow-lg" />
                </div>
              </div>

              {/* Content Section */}
              <div className="pt-20 pb-8 pl-8 pr-8">
                {/* Name and Username Skeleton */}
                <div className="mb-6">
                  <div className="h-9 w-64 bg-gray-300 rounded mb-2" />
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                </div>

                {/* Info Grid Skeleton */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 6 placeholder items */}
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                        <div className="h-5 w-40 bg-gray-300 rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills Section Skeleton */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded" />
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="h-8 w-24 bg-gray-200 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Languages Section Skeleton */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded" />
                    <div className="h-6 w-28 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-8 w-20 bg-gray-200 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Profile not found</div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || profile.username;
  // Image URL is already absolute from the API
  const imageUrl = profile.image;

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Premium Card */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-xl">
            {/* Header Section with Gradient */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
              <div className="absolute inset-0 bg-black/10" />
              
              {/* Profile Image */}
              <div className="absolute bottom-0 left-8 translate-y-1/2">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                  {profile.image ? (
                    <Image
                      src={imageUrl}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <UserCircle className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="pt-20 pb-8 pl-8 pr-8">
              {/* Name and Username */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                <p className="mt-1 text-lg text-gray-600">@{profile.username}</p>
              </div>

              {/* Info Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-base text-gray-900">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {profile.mobile && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1 text-base text-gray-900">
                        {profile.country_code && profile.country_code !== "undefined"
                          ? `${profile.country_code} `
                          : ""}
                        {profile.mobile}
                      </p>
                    </div>
                  </div>
                )}

                {/* Gender */}
                {profile.gender && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1 text-base text-gray-900">{profile.gender}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {profile.location && profile.location.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1 text-base text-gray-900">
                        {profile.location.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Qualification */}
                {profile.qualification && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Qualification</p>
                      <p className="mt-1 text-base text-gray-900">{profile.qualification}</p>
                    </div>
                  </div>
                )}

                {/* Education */}
                {profile.education && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Education</p>
                      <p className="mt-1 text-base text-gray-900">{profile.education}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                        title={skill.description}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {profile.language && profile.language.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Languages className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.language.map((lang) => (
                      <span
                        key={lang.id}
                        className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
                        title={lang.description}
                      >
                        {lang.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
