import type { Category } from "@/types/category";

export type BookAccessType = "FREE" | "PREMIUM";

export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  language: string;
  publicationDate: string;
  author: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  audioUrl: string | null;
  pageCount: number;
  audioDurationSeconds: number | null;
  accessType: BookAccessType;
  status: BookStatus;
  viewCount: number;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export type BookListItem = Pick<
  Book,
  "id" | "title" | "author" | "coverUrl" | "accessType" | "categories" | "createdAt"
> &
  Partial<Pick<Book, "status" | "viewCount">>;

export interface CreateBookRequest {
  title: string;
  description: string;
  isbn: string;
  language: string;
  publicationDate: string;
  author: string;
  pageCount: number;
  audioDurationSeconds: number | null;
  accessType: BookAccessType;
  categoryIds: number[];
}

// The exact update request contract must be verified in Swagger before implementation.
export type UpdateBookRequest = Partial<CreateBookRequest>;

export interface AdminBookFilters {
  search?: string;
  status?: BookStatus;
  accessType?: BookAccessType;
  categoryId?: number;
  page?: number;
  size?: number;
}
