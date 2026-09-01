import { NextResponse } from "next/server";

import { authApi } from "@/lib/api/auth";
import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { clearAuthSession, getRefreshToken } from "@/lib/auth/session";

export async function POST() {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await authApi.logout({ refreshToken });
    }
  } catch (error) {
    if (isApiError(error)) {
      await clearAuthSession();

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: error.validationErrors,
        },
        { status: error.status || 500 },
      );
    }

    await clearAuthSession();

    return NextResponse.json(
      {
        success: false,
        message: getApiErrorMessage(500),
        data: null,
      },
      { status: 500 },
    );
  }

  await clearAuthSession();

  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
    data: null,
  });
}
