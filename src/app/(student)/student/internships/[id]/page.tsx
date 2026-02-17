"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InternshipDetailContent } from "@/components/pages/internship-detail-content";
import {
  fetchDetailCompany,
  getCompanyIdFromDetailData,
  mapDetailToDisplay,
  type InternshipDetailDisplay,
} from "@/services/student-internship.service";

export default function StudentInternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [detail, setDetail] = useState<InternshipDetailDisplay | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const companyIdRef = useRef<string | null>(null);

  useEffect(() => {
    const numId = id ? Number(id) : NaN;
    if (!id || Number.isNaN(numId)) {
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchDetailCompany(numId)
      .then((res) => {
        if (cancelled) return;
        if (res?.data) {
          setDetail(mapDetailToDisplay(res.data));
          const cid = getCompanyIdFromDetailData(res.data);
          companyIdRef.current = cid;
          setCompanyId(cid);
        } else {
          setError(true);
          setDetail(null);
          companyIdRef.current = null;
          setCompanyId(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setDetail(null);
          companyIdRef.current = null;
          setCompanyId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApply = () => {
    if (!detail?.id) return;
    const companyIdForApply = companyIdRef.current ?? companyId;
    if (!companyIdForApply) return;
    try {
      sessionStorage.setItem(
        `internship_apply_${companyIdForApply}`,
        JSON.stringify({ title: detail.title, companyName: detail.companyName })
      );
    } catch (_) {}
    router.push(`/student/internships/apply/${companyIdForApply}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-3 py-8 sm:px-4">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <p className="text-gray-500 mt-6">Loading details…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-3xl mx-auto px-3 py-8 sm:px-4">
        <Link
          href="/student/internships"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Internships
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800 font-medium">Could not load internship details.</p>
          <p className="text-red-600 text-sm mt-1">The listing may not exist or you may need to sign in.</p>
          <Link
            href="/student/internships"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-8 sm:px-4">
      <Link
        href="/student/internships"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Internships
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <InternshipDetailContent detail={detail} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleApply}
          disabled={!companyId}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply now
        </button>
      </div>
    </div>
  );
}
