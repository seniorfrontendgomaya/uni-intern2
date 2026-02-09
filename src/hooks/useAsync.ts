'use client';

import { useCallback, useState } from 'react';
import { handleError } from '@/lib/handle-error';

export function useAsyncAction<T>() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (
      fn: () => Promise<T>
    ): Promise<{ ok: boolean; data?: T; error?: unknown }> => {
      try {
        setLoading(true);

        const data = await fn();
        return { ok: true, data };
      } catch (error) {
        handleError(error);
        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { run, loading };
}
