import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIE_NAMES, AUTH_COOKIE_OPTIONS } from "@/lib/auth/constants";
import type { AuthTokens } from "@/lib/auth/tokens";

export async function saveAuthTokens(tokens: AuthTokens) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAMES.accessToken, tokens.accessToken, AUTH_COOKIE_OPTIONS);
  cookieStore.set(AUTH_COOKIE_NAMES.refreshToken, tokens.refreshToken, AUTH_COOKIE_OPTIONS);
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value;
}

export async function updateAccessToken(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAMES.accessToken, accessToken, AUTH_COOKIE_OPTIONS);
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAMES.accessToken);
  cookieStore.delete(AUTH_COOKIE_NAMES.refreshToken);
}
