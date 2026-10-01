/**
 * useAsync — a small, explicit hook for the "loading / error / data" pattern
 * that shows up on every page that fetches from a service. This is the
 * ONE custom hook in the project; we deliberately avoided building more
 * generic hooks/state managers, per the "no unnecessary abstractions" goal.
 *
 * Usage:
 *   const { data, isLoading, error, reload } = useAsync(() => transactionService.getAllTransactions(), []);
 */
import { useCallback, useEffect, useState } from "react";

interface UseAsyncResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  useEffect(() => load(), [load]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  return { data, isLoading, error, reload };
}
