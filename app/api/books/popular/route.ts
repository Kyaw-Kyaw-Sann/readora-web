import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import type { PaginatedResponse } from "@/types/api";
import type { BookListItem } from "@/types/book";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(
      await authorizedApiRequest<PaginatedResponse<BookListItem>>("/api/books/popular"),
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
