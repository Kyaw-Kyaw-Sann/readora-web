import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  AdminBookFilters,
  Book,
  BookFiles,
  BookListItem,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/types/book";

async function bookRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(path, { ...init, headers: { Accept: "application/json", ...init?.headers } }); }
  catch (error) { throw new ApiError(getApiErrorMessage(0), { status: 0, response: error }); }
  let payload: ApiResponse<T> | null = null;
  try { payload = (await response.json()) as ApiResponse<T>; } catch { /* status fallback below */ }
  if (!response.ok || !payload?.success) throw new ApiError(getApiErrorMessage(response.status, payload?.message), { status: response.status, response: payload });
  return payload.data;
}

export function getAdminBooks(filters: AdminBookFilters) {
  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value !== undefined && value !== "") parameters.set(key, String(value));
  const query = parameters.size ? `?${parameters}` : "";
  return bookRequest<PaginatedResponse<BookListItem>>(`/api/admin/books${query}`);
}

export function getBook(id: number) { return bookRequest<Book>(`/api/books/${id}`); }

export function buildBookFormData(
  payload: CreateBookPayload | UpdateBookPayload,
  files: BookFiles,
) {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );
  if (files.cover) formData.append("cover", files.cover);
  if (files.pdf) formData.append("pdf", files.pdf);
  if (files.audio) formData.append("audio", files.audio);
  return formData;
}

export function createBook(payload: CreateBookPayload, files: BookFiles) {
  return bookRequest<Book>("/api/admin/books", {
    body: buildBookFormData(payload, files),
    method: "POST",
  });
}

export function updateBook(id: number, payload: UpdateBookPayload, files: BookFiles) {
  const normalizedPayload: UpdateBookPayload = {
    ...payload,
    removeCover: payload.removeCover ?? false,
    removePdf: payload.removePdf ?? false,
    removeAudio: payload.removeAudio ?? false,
  };

  return bookRequest<Book>(`/api/admin/books/${id}`, {
    body: buildBookFormData(normalizedPayload, files),
    method: "PUT",
  });
}
