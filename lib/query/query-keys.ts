import type { AdminBookFilters } from "@/types/book";
import type { AdminReviewFilters } from "@/types/review";
import type { AdminSubscriptionFilters } from "@/types/subscription";
import type { AdminUserFilters } from "@/types/user";

export const queryKeys = {
  dashboard: () => ["dashboard"] as const,
  popularBooks: () => ["books", "popular"] as const,
  recentlyAddedBooks: () => ["books", "new"] as const,
  categories: () => ["categories"] as const,
  books: (filters: AdminBookFilters = {}) => ["books", filters] as const,
  book: (id: number) => ["book", id] as const,
  users: (filters: AdminUserFilters = {}) => ["users", filters] as const,
  user: (id: number) => ["user", id] as const,
  reviews: (filters: AdminReviewFilters = {}) => ["reviews", filters] as const,
  subscriptions: (filters: AdminSubscriptionFilters = {}) =>
    ["subscriptions", filters] as const,
};
