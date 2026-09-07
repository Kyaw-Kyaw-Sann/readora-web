import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ reviewId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { reviewId: rawReviewId } = await params;
  const reviewId = Number(rawReviewId);

  if (!Number.isSafeInteger(reviewId) || reviewId <= 0) {
    return NextResponse.json(
      { success: false, message: "A valid review ID is required.", data: null },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      await authorizedApiRequest<null>(`/api/admin/reviews/${reviewId}`, { method: "DELETE" }),
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
