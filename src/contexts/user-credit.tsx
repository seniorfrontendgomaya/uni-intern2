"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUserCredit } from "@/services/user-credit.service";
import type { CurrentUserCredit } from "@/services/user-credit.service";

type UserCreditContextValue = {
  data: CurrentUserCredit | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const UserCreditContext = createContext<UserCreditContextValue | null>(null);

export function UserCreditProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CurrentUserCredit | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredit = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCurrentUserCredit();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredit();
  }, [fetchCredit]);

  const value: UserCreditContextValue = {
    data,
    loading,
    refetch: fetchCredit,
  };

  return (
    <UserCreditContext.Provider value={value}>
      {children}
    </UserCreditContext.Provider>
  );
}

export function useUserCredit(): UserCreditContextValue {
  const ctx = useContext(UserCreditContext);
  if (!ctx) {
    return {
      data: null,
      loading: false,
      refetch: async () => {},
    };
  }
  return ctx;
}
