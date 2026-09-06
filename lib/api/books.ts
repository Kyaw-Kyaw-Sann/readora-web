import { ApiError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminBookFilters, Book, BookListItem, CreateBookRequest } from "@/types/book";

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

function toBookFormData(data: CreateBookRequest, files: BookFiles) {
  const formData = new FormData();
  formData.append("request", JSON.stringify(data));
  if (files.cover) formData.append("cover", files.cover);
  if (files.pdf) formData.append("pdf", files.pdf);
  if (files.audio) formData.append("audio", files.audio);
  return formData;
}

export interface BookFiles { cover?: File; pdf?: File; audio?: File; }
export function createBook(data: CreateBookRequest, files: BookFiles) { return bookRequest<Book>("/api/admin/books", { body: toBookFormData(data, files), method: "POST" }); }
export function updateBook(id: number, data: CreateBookRequest, files: BookFiles) { return bookRequest<Book>(`/api/admin/books/${id}`, { body: toBookFormData(data, files), method: "PUT" }); }
