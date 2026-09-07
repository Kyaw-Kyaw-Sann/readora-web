"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminSubscriptions } from "@/lib/api/subscriptions";
import { queryKeys } from "@/lib/query/query-keys";
import type { AdminSubscriptionFilters } from "@/types/subscription";

export function useSubscriptions(filters: AdminSubscriptionFilters) {
  return useQuery({
    queryKey: queryKeys.subscriptions(filters),
    queryFn: () => getAdminSubscriptions(filters),
  });
}
