import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
}

/**
 * Hook for managing pagination state
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    page,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    setPageSize: handleSetPageSize,
  };
}

export default usePagination;
