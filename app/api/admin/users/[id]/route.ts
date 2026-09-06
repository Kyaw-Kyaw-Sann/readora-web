import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import type { AdminUserDetail } from "@/types/user";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/users/[id]">) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json(
      { success: false, message: "A valid user ID is required.", data: null },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await authorizedApiRequest<AdminUserDetail>(`/api/admin/users/${id}`));
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
