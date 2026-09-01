"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getPopularBooks,
  getRecentlyAddedBooks,
} from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/query/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: getDashboardStats,
  });
}

export function usePopularBooks() {
  return useQuery({
    queryKey: queryKeys.popularBooks(),
    queryFn: getPopularBooks,
  });
}

export function useRecentlyAddedBooks() {
  return useQuery({
    queryKey: queryKeys.recentlyAddedBooks(),
    queryFn: getRecentlyAddedBooks,
  });
}
