import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { bookFormSchema } from "@/lib/validations/book";
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

  const parsed = parseBookRequest(formData);
  if (!parsed.success) return validationErrorResponse(parsed.errors);

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

function parseBookRequest(formData: FormData) {
  const requestValue = formData.get("request");
  if (typeof requestValue !== "string") return { success: false as const, errors: {} };

  try {
    const result = bookFormSchema.safeParse(JSON.parse(requestValue));
    return result.success
      ? { success: true as const, errors: {} }
      : { success: false as const, errors: result.error.flatten().fieldErrors };
  } catch {
    return { success: false as const, errors: {} };
  }
}

function invalidRequestResponse() {
  return NextResponse.json({ success: false, message: "Enter valid book details.", data: null }, { status: 400 });
}

function validationErrorResponse(data: Record<string, string[] | undefined>) {
  return NextResponse.json({ success: false, message: "Please correct the highlighted fields.", data }, { status: 422 });
}

function toErrorResponse(error: unknown) {
  if (isApiError(error)) {
    return NextResponse.json({ success: false, message: error.message, data: error.validationErrors }, { status: error.status || 500 });
  }
  return NextResponse.json({ success: false, message: getApiErrorMessage(500), data: null }, { status: 500 });
}
