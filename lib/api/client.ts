import {
  ApiError,
  getApiErrorMessage,
  normalizeValidationErrors,
  type ValidationErrors,
} from "@/lib/api/errors";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "headers"> {
  accessToken?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
}

interface ApiErrorResponse {
  data?: unknown;
  errors?: unknown;
  message?: string;
  success?: boolean;
}

function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured.", { status: 0 });
  }

  return apiUrl.replace(/\/+$/, "");
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean" &&
    "message" in value &&
    typeof value.message === "string" &&
    "data" in value
  );
}

function getErrorDetails(value: unknown): {
  message?: string;
  validationErrors: ValidationErrors;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { validationErrors: {} };
  }

  const response = value as ApiErrorResponse;
  const validationSource = response.errors ?? response.data;

  return {
    message: typeof response.message === "string" ? response.message : undefined,
    validationErrors: normalizeValidationErrors(validationSource),
  };
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text ? { message: text } : null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  path: string,
  { accessToken, headers: requestHeaders, ...options }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(requestHeaders);
  headers.set("Accept", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(getApiErrorMessage(0), { status: 0, response: error });
  }

  const payload = await readResponseBody(response);

  if (!response.ok) {
    const { message, validationErrors } = getErrorDetails(payload);

    throw new ApiError(getApiErrorMessage(response.status, message), {
      status: response.status,
      validationErrors,
      response: payload,
    });
  }

  if (!isApiResponse<T>(payload)) {
    throw new ApiError("The server returned an invalid response.", {
      status: response.status,
      response: payload,
    });
  }

  if (!payload.success) {
    const { message, validationErrors } = getErrorDetails(payload);

    throw new ApiError(getApiErrorMessage(response.status, message ?? payload.message), {
      status: response.status,
      validationErrors,
      response: payload,
    });
  }

  return payload;
}
