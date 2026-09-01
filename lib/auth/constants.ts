export const AUTH_COOKIE_NAMES = {
  accessToken: "readora_access_token",
  refreshToken: "readora_refresh_token",
} as const;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const AUTH_ROUTES = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  refresh: "/api/auth/refresh",
} as const;
