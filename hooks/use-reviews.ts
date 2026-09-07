"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteReview, getAdminReviews } from "@/lib/api/reviews";
import { queryKeys } from "@/lib/query/query-keys";
import type { AdminReviewFilters } from "@/types/review";

export function useReviews(filters: AdminReviewFilters) {
  return useQuery({
    queryKey: queryKeys.reviews(filters),
    queryFn: () => getAdminReviews(filters),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
