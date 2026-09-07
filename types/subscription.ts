export type SubscriptionPlan = "MONTHLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface Subscription {
  id: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  cancelledAt: string | null;
}

export interface AdminSubscription extends Subscription {
  user: {
    id: number;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
}

export interface AdminSubscriptionFilters {
  search?: string;
  status?: SubscriptionStatus;
  plan?: SubscriptionPlan;
  page?: number;
  size?: number;
}
