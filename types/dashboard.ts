export interface UserDashboardStats {
  total: number;
  verified: number;
  unverified: number;
  activePremium: number;
}

export interface BookDashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  free: number;
  premium: number;
}

export interface ReviewDashboardStats {
  total: number;
  averageRating: number;
}

export interface SubscriptionDashboardStats {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
  monthly: number;
  yearly: number;
}

export interface DashboardStats {
  users: UserDashboardStats;
  books: BookDashboardStats;
  reviews: ReviewDashboardStats;
  subscriptions: SubscriptionDashboardStats;
}
