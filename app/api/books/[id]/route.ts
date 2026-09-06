import { NextResponse } from "next/server";

import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { authorizedApiRequest } from "@/lib/auth/authorized-request";
import type { Book } from "@/types/book";

export const dynamic = "force-dynamic";
interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!/^\d+$/.test(id) || Number(id) < 1) return NextResponse.json({ success: false, message: "A valid book id is required.", data: null }, { status: 400 });
  try { return NextResponse.json(await authorizedApiRequest<Book>(`/api/books/${id}`)); }
  catch (error) {
    if (isApiError(error)) return NextResponse.json({ success: false, message: error.message, data: error.validationErrors }, { status: error.status || 500 });
    return NextResponse.json({ success: false, message: getApiErrorMessage(500), data: null }, { status: 500 });
  }
}
