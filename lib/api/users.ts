import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminUserDetail, AdminUserFilters, AdminUserListItem } from "@/types/user";

async function userRequest<T>(path: string): Promise<T> {
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
    // The HTTP status still yields a useful error for malformed responses.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(getApiErrorMessage(response.status, payload?.message), {
      status: response.status,
      response: payload,
    });
  }

  return payload.data;
}

export function getAdminUsers(filters: AdminUserFilters) {
  const parameters = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      parameters.set(key, String(value));
    }
  }

  const query = parameters.size ? `?${parameters.toString()}` : "";
  return userRequest<PaginatedResponse<AdminUserListItem>>(`/api/admin/users${query}`);
}

export function getAdminUser(id: number) {
  return userRequest<AdminUserDetail>(`/api/admin/users/${id}`);
}
