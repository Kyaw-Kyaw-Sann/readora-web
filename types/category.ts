export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  active: boolean;
}
