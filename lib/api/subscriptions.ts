import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminSubscription, AdminSubscriptionFilters } from "@/types/subscription";

async function subscriptionRequest<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, { headers: { Accept: "application/json" } });
  } catch (error) {
    throw new ApiError(getApiErrorMessage(0), { status: 0, response: error });
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // Use the HTTP status for malformed responses.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(getApiErrorMessage(response.status, payload?.message), {
      status: response.status,
      response: payload,
    });
  }

  return payload.data;
}

export function getAdminSubscriptions(filters: AdminSubscriptionFilters) {
  const parameters = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") parameters.set(key, String(value));
  }

  const query = parameters.size ? `?${parameters.toString()}` : "";
  return subscriptionRequest<PaginatedResponse<AdminSubscription>>(`/api/admin/subscriptions${query}`);
}
