import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/api";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

async function requestCategoryData<T>(path: string, init?: RequestInit): Promise<T> {
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
    // Fall back to a status-based error when a malformed response is received.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(getApiErrorMessage(response.status, payload?.message), {
      status: response.status,
      response: payload,
    });
  }

  return payload.data;
}

export function getCategories() {
  return requestCategoryData<Category[]>("/api/categories");
}

export function getCategory(id: number) {
  return requestCategoryData<Category>(`/api/categories/${id}`);
}

export function createCategory(data: CreateCategoryRequest) {
  return requestCategoryData<Category>("/api/admin/categories", {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

export function updateCategory(id: number, data: UpdateCategoryRequest) {
  return requestCategoryData<Category>(`/api/admin/categories/${id}`, {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });
}

export function deleteCategory(id: number) {
  return requestCategoryData<null>(`/api/admin/categories/${id}`, { method: "DELETE" });
}
