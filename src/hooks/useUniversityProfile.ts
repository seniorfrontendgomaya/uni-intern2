"use client";

import { useCallback, useEffect, useState } from "react";
import { useAsyncAction } from "@/hooks/useAsync";
import {
  getUniversityProfile,
  updateUniversityProfile,
} from "@/services/university-profile.service";
import type {
  UniversityProfile,
  UniversityProfilePatch,
  UniversityProfileResponse,
} from "@/types/university-profile";

export function useUniversityProfile() {
  const [profile, setProfile] = useState<UniversityProfile | null>(null);
  const { run: runFetch, loading } = useAsyncAction<UniversityProfileResponse>();
  const { run: runUpdate, loading: saving } =
    useAsyncAction<UniversityProfileResponse>();

  const fetchProfile = useCallback(async () => {
    const res = await runFetch(() => getUniversityProfile());
    if (res.ok && res.data?.data) setProfile(res.data.data);
    return res;
  }, [runFetch]);

  const patchProfile = useCallback(
    async (patchData: UniversityProfilePatch | FormData) => {
      const res = await runUpdate(() => updateUniversityProfile({ patchData }));
      if (res.ok && res.data?.data) setProfile(res.data.data);
      return res;
    },
    [runUpdate]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, saving, fetchProfile, patchProfile };
}

