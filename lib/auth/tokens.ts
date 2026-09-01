import type { LoginResponse } from "@/types/auth";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function getAuthTokens(response: LoginResponse): AuthTokens {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}
