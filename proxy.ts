import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAMES, AUTH_COOKIE_OPTIONS } from "@/lib/auth/constants";
import type { ApiResponse } from "@/types/api";
import type { RefreshTokenResponse } from "@/types/auth";

type AccessStatus = "forbidden" | "unauthorized" | "unavailable" | "valid";

const loginPath = "/admin/login";
const adminPath = "/admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

  if (!accessToken) {
    return pathname === loginPath ? NextResponse.next() : redirectToLogin(request);
  }

  let accessStatus = await verifyAdminAccess(accessToken);
  let refreshedAccessToken: string | undefined;

  if (accessStatus === "unauthorized" && refreshToken) {
    refreshedAccessToken = await refreshAccessToken(refreshToken);
    accessStatus = refreshedAccessToken
      ? await verifyAdminAccess(refreshedAccessToken)
      : "unauthorized";
  }

  if (accessStatus === "valid") {
    const response = pathname === loginPath ? redirectToAdmin(request) : NextResponse.next();

    if (refreshedAccessToken) {
      response.cookies.set(
        AUTH_COOKIE_NAMES.accessToken,
        refreshedAccessToken,
        AUTH_COOKIE_OPTIONS,
      );
    }

    return response;
  }

  if (accessStatus === "unauthorized" || accessStatus === "forbidden") {
    const reason = accessStatus === "forbidden" ? "forbidden" : "session-expired";
    const response = pathname === loginPath ? NextResponse.next() : redirectToLogin(request, reason);
    clearAuthCookies(response);
    return response;
  }

  // Do not clear a potentially valid session when the backend is temporarily unavailable.
  return NextResponse.next();
}

async function verifyAdminAccess(accessToken: string): Promise<AccessStatus> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/dashboard`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return "valid";
    }

    if (response.status === 401) {
      return "unauthorized";
    }

    if (response.status === 403) {
      return "forbidden";
    }

    return "unavailable";
  } catch {
    return "unavailable";
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as ApiResponse<RefreshTokenResponse>;

    return payload.success && payload.data.accessToken ? payload.data.accessToken : undefined;
  } catch {
    return undefined;
  }
}

function redirectToLogin(request: NextRequest, reason?: "forbidden" | "session-expired") {
  const url = new URL(loginPath, request.url);

  if (reason) {
    url.searchParams.set("reason", reason);
  }

  return NextResponse.redirect(url);
}

function redirectToAdmin(request: NextRequest) {
  return NextResponse.redirect(new URL(adminPath, request.url));
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
}

function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl?.replace(/\/+$/, "") ?? "";
}

export const config = {
  matcher: ["/admin/:path*"],
};
