import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import type { PaginatedResponse } from "@/types/api";
import type { AdminSubscription } from "@/types/subscription";

export const dynamic = "force-dynamic";

const filterKeys = ["search", "status", "plan", "page", "size"] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();

  for (const key of filterKeys) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }

  const query = params.size ? `?${params.toString()}` : "";

  try {
    return NextResponse.json(
      await authorizedApiRequest<PaginatedResponse<AdminSubscription>>(`/api/admin/subscriptions${query}`),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (isApiError(error)) {
    return NextResponse.json(
      { success: false, message: error.message, data: error.validationErrors },
      { status: error.status || 500 },
    );
  }

  return NextResponse.json(
    { success: false, message: getApiErrorMessage(500), data: null },
    { status: 500 },
  );
}
