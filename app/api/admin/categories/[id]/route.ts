import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { updateCategorySchema } from "@/lib/validations/category";
import type { Category, UpdateCategoryRequest } from "@/types/category";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  const input = await getRequestInput(request);

  if (!input) {
    return invalidRequestResponse();
  }

  const result = updateCategorySchema.safeParse(input);

  if (!result.success) {
    return validationErrorResponse(result.error.flatten().fieldErrors);
  }

  try {
    const response = await authorizedApiRequest<Category>(`/api/admin/categories/${id}`, {
      body: JSON.stringify(result.data satisfies UpdateCategoryRequest),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    return NextResponse.json(response);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  try {
    return NextResponse.json(
      await authorizedApiRequest<null>(`/api/admin/categories/${id}`, { method: "DELETE" }),
    );
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

function isValidId(id: string) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, message: "A valid category id is required.", data: null },
    { status: 400 },
  );
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
