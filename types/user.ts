import type { AuthProvider, Role } from "@/types/auth";
import type { Subscription, SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

export interface AdminUserListItem {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  provider: AuthProvider;
  emailVerified: boolean;
  role: Role;
  premiumActive: boolean;
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
  createdAt: string;
}

export interface AdminUserDetail {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  provider: AuthProvider;
  emailVerified: boolean;
  role: Role;
  interests: string[];
  premiumActive: boolean;
  subscription: Subscription | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserFilters {
  search?: string;
  verified?: boolean;
  premium?: boolean;
  page?: number;
  size?: number;
}
