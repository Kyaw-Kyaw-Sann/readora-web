export interface AdminReview {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
  book: {
    id: number;
    title: string;
    author: string;
    coverUrl: string | null;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewFilters {
  search?: string;
  rating?: number;
  page?: number;
  size?: number;
}
