"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getOwnReferralCode } from "@/services/referral.service";

type StudentReferralCodeContextValue = {
  referralCode: string | null;
  isActive: boolean;
  updated: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const StudentReferralCodeContext = createContext<StudentReferralCodeContextValue | null>(null);

export function StudentReferralCodeProvider({ children }: { children: React.ReactNode }) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCode = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOwnReferralCode();
      const data = res?.data;
      const code = data?.referral_code ?? null;
      setReferralCode(typeof code === "string" ? code : null);
      setIsActive(data?.active ?? data?.is_active ?? true);
      setUpdated(data?.updated ?? null);
    } catch {
      setReferralCode(null);
      setIsActive(true);
      setUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  const value: StudentReferralCodeContextValue = {
    referralCode,
    isActive,
    updated,
    loading,
    refetch: fetchCode,
  };

  return (
    <StudentReferralCodeContext.Provider value={value}>
      {children}
    </StudentReferralCodeContext.Provider>
  );
}

export function useStudentReferralCode(): StudentReferralCodeContextValue {
  const ctx = useContext(StudentReferralCodeContext);
  if (ctx == null) {
    return {
      referralCode: null,
      isActive: true,
      updated: null,
      loading: true,
      refetch: async () => {},
    };
  }
  return ctx;
}
