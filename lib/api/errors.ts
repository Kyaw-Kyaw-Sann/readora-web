export type ValidationErrors = Record<string, string[]>;

interface ApiErrorOptions {
  status: number;
  validationErrors?: ValidationErrors;
  response?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors: ValidationErrors;
  readonly response?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.validationErrors = options.validationErrors ?? {};
    this.response = options.response;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(status: number, message?: string): string {
  if (status === 0) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource could not be found.";
  }

  if (status === 409) {
    return "This request conflicts with the current data. Please refresh and try again.";
  }

  if (status === 413) {
    return "The selected file or upload is too large.";
  }

  if (status === 415) {
    return "The upload format is not supported. Please check the selected files and try again.";
  }

  if (status === 422) {
    return message || "Please review the highlighted fields and try again.";
  }

  if (status >= 500) {
    return "The server encountered an error. Please try again later.";
  }

  return message || "Something went wrong. Please try again.";
}

export function normalizeValidationErrors(value: unknown): ValidationErrors {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([field, messages]) => {
      if (typeof messages === "string") {
        return [[field, [messages]]];
      }

      if (Array.isArray(messages) && messages.every((message) => typeof message === "string")) {
        return [[field, messages]];
      }

      return [];
    }),
  );
}
