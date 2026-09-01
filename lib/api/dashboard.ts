import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { BookListItem } from "@/types/book";
import type { DashboardStats } from "@/types/dashboard";

async function getDashboardData<T>(path: string): Promise<T> {
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
    // The status-based error below provides a useful fallback for invalid responses.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(getApiErrorMessage(response.status, payload?.message), {
      status: response.status,
      response: payload,
    });
  }

  return payload.data;
}

export function getDashboardStats() {
  return getDashboardData<DashboardStats>("/api/admin/dashboard");
}

export async function getPopularBooks() {
  const response = await getDashboardData<PaginatedResponse<BookListItem>>("/api/books/popular");
  return response.content;
}

export async function getRecentlyAddedBooks() {
  const response = await getDashboardData<PaginatedResponse<BookListItem>>("/api/books/new");
  return response.content;
}
