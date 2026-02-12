"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Download, Save, X } from "lucide-react";
import { getResumeUserProfile, updateResumeUserProfile, downloadResume } from "@/services/resume-builder.service";
import type { ResumeUserProfile } from "@/types/resume-builder";
import { toast } from "react-hot-toast";

export function UserProfileSection() {
  const [profile, setProfile] = useState<ResumeUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    country_code: "",
    location: "",
    gender: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getResumeUserProfile();
      if (response.data && response.data.length > 0) {
        const profileData = response.data[0];
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          mobile: profileData.mobile || "",
          country_code: profileData.country_code || "",
          location: profileData.location || "",
          gender: profileData.gender || "",
        });
        setImagePreview(profileData.image || null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        mobile: profile.mobile || "",
        country_code: profile.country_code || "",
        location: profile.location || "",
        gender: profile.gender || "",
      });
      setImageFile(null);
      setImagePreview(profile.image || null);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const formDataToSend = new FormData();
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      if (formData.first_name) formDataToSend.append("first_name", formData.first_name);
      if (formData.last_name) formDataToSend.append("last_name", formData.last_name);
      if (formData.mobile) formDataToSend.append("mobile", formData.mobile);
      if (formData.country_code) formDataToSend.append("country_code", formData.country_code);
      if (formData.location) formDataToSend.append("location", formData.location);
      if (formData.gender) formDataToSend.append("gender", formData.gender);

      await updateResumeUserProfile(formDataToSend);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadResume();
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Failed to download resume:", error);
      toast.error("Failed to download resume");
    }
  };

  if (loading) {
    return (
      <div className="border-b-2 border-gray-800 px-8 pt-8 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-9 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Your Name";
  const contactInfo = [
    profile.email,
    profile.mobile ? `${profile.country_code || ""} ${profile.mobile}`.trim() : null,
    profile.location,
  ].filter(Boolean);

  return (
    <div className="border-b-2 border-gray-800 px-8 pt-8 pb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country Code
                  </label>
                  <input
                    type="text"
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                    placeholder="+91"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Change Image
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
                >
                  <Save className="h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {fullName}
                </h1>
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 hover:opacity-100 transition"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                {contactInfo.map((info, index) => (
                  <span key={index}>
                    {info}
                    {index < contactInfo.length - 1 && <span className="mx-2">•</span>}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}
