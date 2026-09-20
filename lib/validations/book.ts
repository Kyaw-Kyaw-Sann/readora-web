import { z } from "zod";

const requiredTitle = z.string().trim().min(1, "Title is required.").max(200);
const requiredAuthor = z.string().trim().min(1, "Author is required.").max(150);
const optionalIsbn = z.string().trim().max(50, "ISBN cannot exceed 50 characters.");
const optionalLanguage = z.string().trim().max(50, "Language cannot exceed 50 characters.");
const optionalDate = z.union([z.literal(""), z.string().date("Enter a valid publication date.")]);
const optionalPositiveInteger = (message: string) => z.number().int(message).positive(message).nullable();
const categoryIds = z
  .array(z.number().int().positive())
  .min(1, "Select at least one category.")
  .refine((ids) => new Set(ids).size === ids.length, "Select each category only once.");

export const bookFormSchema = z.object({
  title: requiredTitle,
  description: z.string().trim(),
  isbn: optionalIsbn,
  language: optionalLanguage,
  publicationDate: optionalDate,
  author: requiredAuthor,
  pageCount: optionalPositiveInteger("Page count must be a positive integer."),
  audioDurationSeconds: optionalPositiveInteger("Audio duration must be a positive integer."),
  accessType: z.enum(["FREE", "PREMIUM"]),
  categoryIds,
  removeCover: z.boolean(),
  removePdf: z.boolean(),
  removeAudio: z.boolean(),
});

const nullableText = (schema: z.ZodString) =>
  z.preprocess((value) => value === "" ? null : value, schema.nullable().optional());

const nullableNumber = (message: string) =>
  z.preprocess(
    (value) => value === "" ? null : value,
    z.number().int(message).positive(message).nullable().optional(),
  );

const bookPayloadFields = {
  title: requiredTitle,
  description: nullableText(z.string().trim()),
  isbn: nullableText(optionalIsbn),
  language: nullableText(optionalLanguage),
  publicationDate: z.preprocess(
    (value) => value === "" ? null : value,
    z.string().date("Enter a valid publication date.").nullable().optional(),
  ),
  author: requiredAuthor,
  pageCount: nullableNumber("Page count must be a positive integer."),
  audioDurationSeconds: nullableNumber("Audio duration must be a positive integer."),
  accessType: z.enum(["FREE", "PREMIUM"]),
  categoryIds,
};

export const createBookPayloadSchema = z.object(bookPayloadFields);

export const updateBookPayloadSchema = z.object({
  ...bookPayloadFields,
  removeCover: z.boolean().optional(),
  removePdf: z.boolean().optional(),
  removeAudio: z.boolean().optional(),
});
