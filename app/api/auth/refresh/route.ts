import { NextResponse } from "next/server";

import { authApi } from "@/lib/api/auth";
import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import { getRefreshToken, updateAccessToken } from "@/lib/auth/session";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: getApiErrorMessage(401),
        data: null,
      },
      { status: 401 },
    );
  }

  try {
    const response = await authApi.refresh({ refreshToken });
    await updateAccessToken(response.data.accessToken);

    return NextResponse.json({
      success: true,
      message: response.message,
      data: null,
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
