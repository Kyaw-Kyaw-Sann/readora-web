import { apiClient, type ApiRequestOptions, type ApiResponse } from "@/lib/api/client";

type RequestOptions = Omit<ApiRequestOptions, "body" | "method">;

interface JsonRequestOptions<T> extends RequestOptions {
  data?: T;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
}

interface MultipartRequestOptions extends RequestOptions {
  method?: "POST" | "PUT" | "PATCH";
}

export function getRequest<T>(path: string, options: RequestOptions = {}) {
  return apiClient<T>(path, { ...options, method: "GET" });
}

export function deleteRequest<T>(path: string, options: RequestOptions = {}) {
  return apiClient<T>(path, { ...options, method: "DELETE" });
}

export function jsonRequest<TResponse, TData>(
  path: string,
  { data, headers: requestHeaders, method = "POST", ...options }: JsonRequestOptions<TData> = {},
): Promise<ApiResponse<TResponse>> {
  const headers = new Headers(requestHeaders);
  headers.set("Content-Type", "application/json");

  return apiClient<TResponse>(path, {
    ...options,
    body: data === undefined ? undefined : JSON.stringify(data),
    headers,
    method,
  });
}

export function multipartRequest<T>(
  path: string,
  formData: FormData,
  { method = "POST", ...options }: MultipartRequestOptions = {},
): Promise<ApiResponse<T>> {
  return apiClient<T>(path, {
    ...options,
    body: formData,
    method,
  });
}
