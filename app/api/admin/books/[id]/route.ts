import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import { updateBookPayloadSchema } from "@/lib/validations/book";
import type { Book } from "@/types/book";

export const dynamic = "force-dynamic";

interface RouteContext { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || Number(id) < 1) return invalidIdResponse();

  let formData: FormData;
  try { formData = await request.formData(); } catch { return invalidRequestResponse(); }

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
    return NextResponse.json(await authorizedApiRequest<Book>(`/api/admin/books/${id}`, { body: formData, method: "PUT" }));
  } catch (error) { return toErrorResponse(error); }
}

async function parseBookRequest(requestPart: Blob) {
  try {
    const result = updateBookPayloadSchema.safeParse(JSON.parse(await requestPart.text()));
    return result.success
      ? { success: true as const, data: result.data, errors: {} }
      : { success: false as const, errors: result.error.flatten().fieldErrors };
  } catch {
    return { success: false as const, errors: {} };
  }
}

function invalidIdResponse() { return NextResponse.json({ success: false, message: "A valid book id is required.", data: null }, { status: 400 }); }
function invalidRequestResponse() { return NextResponse.json({ success: false, message: "Enter valid book details.", data: null }, { status: 400 }); }
function unsupportedRequestPartResponse() { return NextResponse.json({ success: false, message: getApiErrorMessage(415), data: null }, { status: 415 }); }
function validationErrorResponse(data: Record<string, string[] | undefined>) { return NextResponse.json({ success: false, message: "Please correct the highlighted fields.", data }, { status: 400 }); }
function toErrorResponse(error: unknown) {
  if (isApiError(error)) return NextResponse.json({ success: false, message: error.message, data: error.validationErrors }, { status: error.status || 500 });
  return NextResponse.json({ success: false, message: getApiErrorMessage(500), data: null }, { status: 500 });
}
