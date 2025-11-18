'use client';

import { useState, useMemo } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  offset: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(initialPage: number = 1, initialLimit: number = 10): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const reset = () => {
    setPage(initialPage);
    setLimit(initialLimit);
  };

  return {
    page,
    limit,
    offset,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    reset,
  };
}
