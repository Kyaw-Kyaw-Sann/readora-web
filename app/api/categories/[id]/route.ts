import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import type { Category } from "@/types/category";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  try {
    return NextResponse.json(await authorizedApiRequest<Category>(`/api/categories/${id}`));
  } catch (error) {
    return toErrorResponse(error);
  }
}

function isValidId(id: string) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, message: "A valid category id is required.", data: null },
    { status: 400 },
  );
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
