import { NextResponse } from "next/server";

import { authApi } from "@/lib/api/auth";
import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { saveAuthTokens } from "@/lib/auth/session";
import { getAuthTokens } from "@/lib/auth/tokens";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Enter your email address and password.",
        data: null,
      },
      { status: 400 },
    );
  }

  const result = loginSchema.safeParse(input);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please correct the highlighted fields.",
        data: result.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const response = await authApi.login(result.data);
    const { user } = response.data;

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "This account does not have administrator access.",
          data: null,
        },
        { status: 403 },
      );
    }

    await saveAuthTokens(getAuthTokens(response.data));

    return NextResponse.json({
      success: true,
      message: response.message,
      data: { user },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (isApiError(error)) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        data: error.validationErrors,
      },
      { status: error.status || 500 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: getApiErrorMessage(500),
      data: null,
    },
    { status: 500 },
  );
}
