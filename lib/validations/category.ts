import { z } from "zod";

export const categoryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must contain at least 2 characters.")
    .max(100, "Category name cannot exceed 100 characters."),
  description: z
    .string()
    .trim()
    .min(2, "Description must contain at least 2 characters.")
    .max(500, "Description cannot exceed 500 characters."),
});

export const createCategorySchema = categoryFieldsSchema;

export const updateCategorySchema = categoryFieldsSchema.extend({
  active: z.boolean(),
});
