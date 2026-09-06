"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminUser, getAdminUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query/query-keys";
import type { AdminUserFilters } from "@/types/user";

export function useUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => getAdminUsers(filters),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => getAdminUser(id),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
}
