"use client";

import { useCallback, useEffect, useState } from "react";
import { getUniversityDashboard } from "@/services/university-dashboard.service";
import type { UniversityDashboardData } from "@/types/university-dashboard";
import { handleError } from "@/lib/handle-error";

export function useUniversityDashboard() {
  const [data, setData] = useState<UniversityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUniversityDashboard();
      if (res?.data) setData(res.data);
      else setData(null);
    } catch (error) {
      handleError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, refetch: fetchDashboard };
}
