import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().trim().min(2, "Title must contain at least 2 characters.").max(200),
  description: z.string().trim().min(10, "Description must contain at least 10 characters.").max(5000),
  isbn: z.string().trim().min(3, "Enter a valid ISBN.").max(32),
  language: z.string().trim().min(2, "Enter a language.").max(50),
  publicationDate: z.string().date("Enter a valid publication date."),
  author: z.string().trim().min(2, "Author must contain at least 2 characters.").max(150),
  pageCount: z.number().int().positive("Page count must be greater than zero."),
  audioDurationSeconds: z.number().int().nonnegative().nullable(),
  accessType: z.enum(["FREE", "PREMIUM"]),
  categoryIds: z.array(z.number().int().positive()).min(1, "Select at least one category."),
});
