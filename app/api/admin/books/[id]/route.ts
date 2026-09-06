import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { bookFormSchema } from "@/lib/validations/book";
import type { Book } from "@/types/book";

export const dynamic = "force-dynamic";

interface RouteContext { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || Number(id) < 1) return invalidIdResponse();

  let formData: FormData;
  try { formData = await request.formData(); } catch { return invalidRequestResponse(); }

  const requestValue = formData.get("request");
  try {
    const parsed = bookFormSchema.safeParse(typeof requestValue === "string" ? JSON.parse(requestValue) : null);
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors);
  } catch { return invalidRequestResponse(); }

  try {
    return NextResponse.json(await authorizedApiRequest<Book>(`/api/admin/books/${id}`, { body: formData, method: "PUT" }));
  } catch (error) { return toErrorResponse(error); }
}

function invalidIdResponse() { return NextResponse.json({ success: false, message: "A valid book id is required.", data: null }, { status: 400 }); }
function invalidRequestResponse() { return NextResponse.json({ success: false, message: "Enter valid book details.", data: null }, { status: 400 }); }
function validationErrorResponse(data: Record<string, string[] | undefined>) { return NextResponse.json({ success: false, message: "Please correct the highlighted fields.", data }, { status: 422 }); }
function toErrorResponse(error: unknown) {
  if (isApiError(error)) return NextResponse.json({ success: false, message: error.message, data: error.validationErrors }, { status: error.status || 500 });
  return NextResponse.json({ success: false, message: getApiErrorMessage(500), data: null }, { status: 500 });
}
