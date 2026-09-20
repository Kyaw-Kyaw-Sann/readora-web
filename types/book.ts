export type BookAccessType = "FREE" | "PREMIUM";

export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
}

export interface Book {
  id: number;
  title: string;
  description: string | null;
  isbn: string | null;
  language: string | null;
  publicationDate: string | null;
  author: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  audioUrl: string | null;
  pageCount: number | null;
  audioDurationSeconds: number | null;
  accessType: BookAccessType;
  status: BookStatus;
  viewCount: number;
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;
}

export type BookDetailResponse = Book;

export type BookListItem = Pick<
  Book,
  "id" | "title" | "author" | "coverUrl" | "accessType" | "categories" | "createdAt"
> &
  Partial<Pick<Book, "status" | "viewCount">>;

export interface CreateBookPayload {
  title: string;
  description?: string | null;
  isbn?: string | null;
  language?: string | null;
  publicationDate?: string | null;
  author: string;
  pageCount?: number | null;
  audioDurationSeconds?: number | null;
  accessType: BookAccessType;
  categoryIds: number[];
}

export interface UpdateBookPayload extends CreateBookPayload {
  removeCover?: boolean;
  removePdf?: boolean;
  removeAudio?: boolean;
}

export interface BookFiles {
  cover?: File | null;
  pdf?: File | null;
  audio?: File | null;
}

export interface AdminBookFilters {
  search?: string;
  status?: BookStatus;
  accessType?: BookAccessType;
  categoryId?: number;
  page?: number;
  size?: number;
}
