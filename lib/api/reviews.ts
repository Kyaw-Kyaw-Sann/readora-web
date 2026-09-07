import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminReview, AdminReviewFilters } from "@/types/review";

async function reviewRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch (error) {
    throw new ApiError(getApiErrorMessage(0), { status: 0, response: error });
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // Use the status-based fallback for malformed responses.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(getApiErrorMessage(response.status, payload?.message), {
      status: response.status,
      response: payload,
    });
  }

  return payload.data;
}

export function getAdminReviews(filters: AdminReviewFilters) {
  const parameters = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") parameters.set(key, String(value));
  }

  const query = parameters.size ? `?${parameters.toString()}` : "";
  return reviewRequest<PaginatedResponse<AdminReview>>(`/api/admin/reviews${query}`);
}

export function deleteReview(reviewId: number) {
  return reviewRequest<null>(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
}
