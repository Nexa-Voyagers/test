'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { get, post, put, remove, patch } from '@/lib/api';
import toast from 'react-hot-toast';

/**
 * Hook for GET requests
 */
export function useGet<T>(
  key: string[],
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey: [...key, params],
    queryFn: () => get<T>(url, params),
    ...options,
  });
}

/**
 * Hook for POST requests
 */
export function usePost<T, D = any>(
  url: string,
  options?: UseMutationOptions<T, Error, D>
) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, D>({
    mutationFn: (data: D) => post<T>(url, data),
    onSuccess: (data, variables, context) => {
      toast.success('Operation successful');
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    },
    ...options,
  });
}

/**
 * Hook for PUT requests
 */
export function usePut<T, D = any>(
  url: string,
  options?: UseMutationOptions<T, Error, D>
) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, D>({
    mutationFn: (data: D) => put<T>(url, data),
    onSuccess: (data, variables, context) => {
      toast.success('Update successful');
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
    ...options,
  });
}

/**
 * Hook for DELETE requests
 */
export function useDelete<T>(
  url: string,
  options?: UseMutationOptions<T, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, void>({
    mutationFn: () => remove<T>(url),
    onSuccess: (data, variables, context) => {
      toast.success('Delete successful');
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Delete failed');
    },
    ...options,
  });
}

/**
 * Hook for PATCH requests
 */
export function usePatch<T, D = any>(
  url: string,
  options?: UseMutationOptions<T, Error, D>
) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, D>({
    mutationFn: (data: D) => patch<T>(url, data),
    onSuccess: (data, variables, context) => {
      toast.success('Update successful');
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
    ...options,
  });
}
