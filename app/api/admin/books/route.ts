import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { createBookPayloadSchema } from "@/lib/validations/book";
import type { PaginatedResponse } from "@/types/api";
import type { Book, BookListItem } from "@/types/book";

export const dynamic = "force-dynamic";

const filterKeys = ["search", "status", "accessType", "categoryId", "page", "size"] as const;

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
      await authorizedApiRequest<PaginatedResponse<BookListItem>>(`/api/admin/books${query}`),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const formData = await readFormData(request);
  if (!formData) return invalidRequestResponse();

  const requestPart = formData.get("request");
  if (!(requestPart instanceof Blob) || requestPart.type !== "application/json") {
    return unsupportedRequestPartResponse();
  }

  const parsed = await parseBookRequest(requestPart);
  if (!parsed.success) return validationErrorResponse(parsed.errors);

  formData.set(
    "request",
    new Blob([JSON.stringify(parsed.data)], { type: "application/json" }),
  );

  try {
    return NextResponse.json(
      await authorizedApiRequest<Book>("/api/admin/books", { body: formData, method: "POST" }),
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

async function readFormData(request: Request) {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}

async function parseBookRequest(requestPart: Blob) {
  try {
    const result = createBookPayloadSchema.safeParse(JSON.parse(await requestPart.text()));
    return result.success
      ? { success: true as const, data: result.data, errors: {} }
      : { success: false as const, errors: result.error.flatten().fieldErrors };
  } catch {
    return { success: false as const, errors: {} };
  }
}

function invalidRequestResponse() {
  return NextResponse.json({ success: false, message: "Enter valid book details.", data: null }, { status: 400 });
}

function unsupportedRequestPartResponse() {
  return NextResponse.json(
    { success: false, message: getApiErrorMessage(415), data: null },
    { status: 415 },
  );
}

function validationErrorResponse(data: Record<string, string[] | undefined>) {
  return NextResponse.json({ success: false, message: "Please correct the highlighted fields.", data }, { status: 400 });
}

function toErrorResponse(error: unknown) {
  if (isApiError(error)) {
    return NextResponse.json({ success: false, message: error.message, data: error.validationErrors }, { status: error.status || 500 });
  }
  return NextResponse.json({ success: false, message: getApiErrorMessage(500), data: null }, { status: 500 });
}
