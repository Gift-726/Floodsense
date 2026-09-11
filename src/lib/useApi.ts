"use client";

import { useCallback, useEffect, useState } from "react";

type ApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  retry: () => void;
};

export function useApi<T>(url: string, intervalMs?: number): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function load(isPoll: boolean) {
      if (!isPoll) setLoading(true);
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
          return r.json() as Promise<T>;
        })
        .then((json) => {
          if (cancelled) return;
          setData(json);
          setError(null);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Failed to load");
          setLoading(false);
        });
    }

    load(false);
    const interval = intervalMs ? window.setInterval(() => load(true), intervalMs) : undefined;
    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, intervalMs, nonce]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { data, error, loading, retry };
}
