import { useCallback, useState } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: AxiosError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

/**
 * Hook for managing API calls
 */
export function useApi<T = unknown>(
  apiCall: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const result = await apiCall(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (error) {
        const axiosError = error instanceof AxiosError ? error : new AxiosError();
        setState({ data: null, isLoading: false, error: axiosError });
        throw error;
      }
    },
    [apiCall]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
