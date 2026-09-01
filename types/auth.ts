export type Role = "USER" | "ADMIN";

export type AuthProvider = "LOCAL" | "GOOGLE";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  provider: AuthProvider;
  emailVerified: boolean;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
