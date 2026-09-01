import "server-only";

import { jsonRequest } from "@/lib/api/request";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth";

export const authApi = {
  login: (data: LoginRequest) =>
    jsonRequest<LoginResponse, LoginRequest>("/api/auth/login", { data }),
  refresh: (data: RefreshTokenRequest) =>
    jsonRequest<RefreshTokenResponse, RefreshTokenRequest>("/api/auth/refresh", { data }),
  logout: (data: RefreshTokenRequest) =>
    jsonRequest<null, RefreshTokenRequest>("/api/auth/logout", { data }),
};
