import "server-only";

import { apiClient, type ApiRequestOptions, type ApiResponse } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { ApiError, isApiError } from "@/lib/api/errors";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from "@/lib/auth/session";

/**
 * Makes an authenticated backend request with the current HttpOnly session.
 * A single refresh/retry is attempted when the access token has expired.
 */
export async function authorizedApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new ApiError("Your session has expired. Please sign in again.", { status: 401 });
  }

  try {
    return await apiClient<T>(path, { ...options, accessToken });
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) {
      throw error;
    }
  }

  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthSession();
    throw new ApiError("Your session has expired. Please sign in again.", { status: 401 });
  }

  try {
    const refreshResponse = await authApi.refresh({ refreshToken });
    const refreshedAccessToken = refreshResponse.data.accessToken;

    await updateAccessToken(refreshedAccessToken);

    return await apiClient<T>(path, { ...options, accessToken: refreshedAccessToken });
  } catch (error) {
    await clearAuthSession();
    throw error;
  }
}
