"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Pencil, ArrowLeft, ArrowUp } from "lucide-react";
import { applyForInternship } from "@/services/student-internship.service";
import toast from "react-hot-toast";

interface InternshipApplyFormProps {
  /** Company (employer) id for the API; from the internship detail. */
  companyId: string | null;
  internshipTitle: string;
  companyName: string;
}

export function InternshipApplyForm({
  companyId,
  internshipTitle,
  companyName,
}: InternshipApplyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [availability, setAvailability] = useState<"immediate" | "other">("immediate");
  const [customAvailability, setCustomAvailability] = useState("");
  const [customResume, setCustomResume] = useState<File | null>(null);
  const [customResumeName, setCustomResumeName] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10Mb");
        return;
      }
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        alert("File type must be PDF, DOC, or DOCX");
        return;
      }
      setCustomResume(file);
      setCustomResumeName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      toast.error("Please confirm your consent before submitting the application.");
      return;
    }
    if (!companyId) {
      toast.error("Missing company information. Please go back and try again.");
      return;
    }
    if (!customResume) {
      toast.error("Please upload a resume (PDF, DOC, or DOCX) to apply.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("company", companyId);
      formData.append("resume", customResume, customResume.name);
      formData.append(
        "description",
        availability === "immediate" ? "Available immediately" : (customAvailability || "")
      );
      formData.append("is_available", availability === "immediate" ? "true" : "false");

      await applyForInternship(formData);
      toast.success("Application submitted successfully.");
      router.push("/student/internships");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to submit application. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white -mt-8">
      {/* Header Message */}
      <div className="border-gray-200">
        <div className="mx-auto max-w-4xl px-8 py-3 text-center">
          <p className="text-xs text-gray-500">
            Complete the form below to apply for this internship position
          </p>
        </div>
      </div>

      {/* Form Document Container - PDF-like appearance */}
      <div 
        className="mx-auto max-w-4xl bg-white" 
        style={{ 
          boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        {/* Form Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Apply For {internshipTitle}
            </h1>
            
            {/* Position Input Field */}
            <div className="relative">
              <input
                type="text"
                value={companyName}
                readOnly
                className="w-full px-0 py-2 text-gray-600 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-gray-500"
              />
              <button
                type="button"
                onClick={() => router.back()}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
              {/* Your Resume Section */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Your resume
                    </h2>
                    <p className="text-sm text-gray-600">
                      Your current resume will be submitted with this application.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/student/resume")}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#E61A3D] rounded-full hover:bg-[#C81733] transition"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit resume
                  </button>
                </div>
              </div>

              {/* Confirm Your Availability Section */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Confirm your availability
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      value="immediate"
                      checked={availability === "immediate"}
                      onChange={(e) => setAvailability(e.target.value as "immediate" | "other")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Yes, I'm available to join immediately.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      value="other"
                      checked={availability === "other"}
                      onChange={(e) => setAvailability(e.target.value as "immediate" | "other")}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700 block mb-2">
                        Other (please specify your availability)
                      </span>
                      {availability === "other" && (
                        <textarea
                          value={customAvailability}
                          onChange={(e) => setCustomAvailability(e.target.value)}
                          placeholder="Eg. I am available in Delhi for next 6 months but will have exams for 15 days in June"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 min-h-[100px]"
                          rows={4}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Resume upload (required for application) */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Upload resume{" "}
                  <span className="text-sm font-normal text-red-600">(required)</span>
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Employer can download and view this resume. PDF, DOC, or DOCX.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {customResume ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <span className="font-medium">{customResumeName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomResume(null);
                            setCustomResumeName("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
                      >
                        <ArrowUp className="h-4 w-4" />
                        Change file
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
                    >
                      <ArrowUp className="h-4 w-4" />
                      Upload file
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Max file size: 10Mb. File type - PDF, DOC, DOCX
                </p>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
                  I confirm that the information provided is accurate and I consent to share my resume and personal details with the employer for this application.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!companyId || !consentChecked || !customResume || submitting}
                  className="px-6 py-2 bg-[#E61A3D] text-white text-sm font-medium rounded-full hover:bg-[#C81733] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
