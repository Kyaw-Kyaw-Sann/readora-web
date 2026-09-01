import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { createCategorySchema } from "@/lib/validations/category";
import type { Category, CreateCategoryRequest } from "@/types/category";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const input = await getRequestInput(request);

  if (!input) {
    return invalidRequestResponse();
  }

  const result = createCategorySchema.safeParse(input);

  if (!result.success) {
    return validationErrorResponse(result.error.flatten().fieldErrors);
  }

  try {
    const response = await authorizedApiRequest<Category>("/api/admin/categories", {
      body: JSON.stringify(result.data satisfies CreateCategoryRequest),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    return NextResponse.json(response);
  } catch (error) {
    return toErrorResponse(error);
  }
}

async function getRequestInput(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function invalidRequestResponse() {
  return NextResponse.json(
    { success: false, message: "Enter a category name and description.", data: null },
    { status: 400 },
  );
}

function validationErrorResponse(data: Record<string, string[] | undefined>) {
  return NextResponse.json(
    { success: false, message: "Please correct the highlighted fields.", data },
    { status: 422 },
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
