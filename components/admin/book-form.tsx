"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileAudio, FileText, ImageIcon, LoaderCircle, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateBook, useUpdateBook } from "@/hooks/use-books";
import { bookFormSchema } from "@/lib/validations/book";
import type {
  Book,
  BookAccessType,
  BookFiles,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/types/book";

type BookFormValues = z.infer<typeof bookFormSchema>;
type FileField = keyof BookFiles;
type RemovalField = "removeCover" | "removePdf" | "removeAudio";

const megabyte = 1024 * 1024;
const fileRules: Record<FileField, { label: string; maxBytes: number; validType: (type: string) => boolean }> = {
  cover: { label: "Cover image", maxBytes: 10 * megabyte, validType: (type) => type.startsWith("image/") },
  pdf: { label: "PDF", maxBytes: 100 * megabyte, validType: (type) => type === "application/pdf" },
  audio: { label: "Audio", maxBytes: 200 * megabyte, validType: (type) => type.startsWith("audio/") },
};

const removalFields: Record<FileField, RemovalField> = {
  cover: "removeCover",
  pdf: "removePdf",
  audio: "removeAudio",
};

export function BookForm({ book }: { book?: Book }) {
  const categoriesQuery = useCategories();
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const [files, setFiles] = useState<BookFiles>({});
  const isEditing = Boolean(book);
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: getDefaults(book),
  });
  const isPending = createMutation.isPending || updateMutation.isPending;
  const selectedCategoryIds = useWatch({ control: form.control, name: "categoryIds" });
  const removeCover = useWatch({ control: form.control, name: "removeCover" });
  const removePdf = useWatch({ control: form.control, name: "removePdf" });
  const removeAudio = useWatch({ control: form.control, name: "removeAudio" });

  useEffect(() => {
    form.reset(getDefaults(book));
  }, [book, form]);

  async function submit(values: BookFormValues) {
    const createPayload = toCreatePayload(values);

    try {
      if (book) {
        const updatePayload: UpdateBookPayload = {
          ...createPayload,
          removeCover: values.removeCover,
          removePdf: values.removePdf,
          removeAudio: values.removeAudio,
        };
        const updatedBook = await updateMutation.mutateAsync({
          id: book.id,
          data: updatePayload,
          files,
        });
        form.reset(getDefaults(updatedBook));
        toast.success("Book updated successfully.");
      } else {
        await createMutation.mutateAsync({ data: createPayload, files });
        form.reset(getDefaults());
        toast.success("Book created successfully.");
      }

      setFiles({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save the book.");
    }
  }

  function selectFile(field: FileField, file?: File) {
    if (file) {
      const rule = fileRules[field];

      if (!rule.validType(file.type)) {
        toast.error(`${rule.label} has an unsupported file type.`);
        return false;
      }

      if (file.size > rule.maxBytes) {
        toast.error(`${rule.label} must be ${formatFileSize(rule.maxBytes)} or smaller.`);
        return false;
      }

      form.setValue(removalFields[field], false, { shouldDirty: true });
    }

    setFiles((current) => ({ ...current, [field]: file }));
    return true;
  }

  function setRemoval(field: FileField, checked: boolean) {
    form.setValue(removalFields[field], checked, { shouldDirty: true, shouldValidate: true });
    if (checked) setFiles((current) => ({ ...current, [field]: undefined }));
  }

  if (categoriesQuery.isLoading) return <BookFormSkeleton />;

  if (categoriesQuery.isError || !categoriesQuery.data) {
    return (
      <EmptyState
        title="Couldn’t load categories"
        description="Categories are required before a book can be saved."
        action={<Button onClick={() => void categoriesQuery.refetch()} type="button">Retry</Button>}
      />
    );
  }

  return (
    <form
      className="space-y-readora-lg"
      onSubmit={form.handleSubmit(submit, () => toast.error("Please correct the highlighted fields."))}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update this library title and its files." : "Add a new title to the Readora library."}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold">{isEditing ? "Edit book" : "Add book"}</h1>
        </div>
        <Button disabled={isPending} type="submit">
          {isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {isPending ? "Saving…" : isEditing ? "Save changes" : "Create book"}
        </Button>
      </div>

      <FormSection description="Only the title and author are required. Optional blank values are saved without a value." title="Basic information">
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={form.formState.errors.title?.message} label="Title">
            <Input disabled={isPending} {...form.register("title")} />
          </Field>
          <Field error={form.formState.errors.author?.message} label="Author">
            <Input disabled={isPending} {...form.register("author")} />
          </Field>
          <Field error={form.formState.errors.isbn?.message} label="ISBN (optional)">
            <Input disabled={isPending} {...form.register("isbn")} />
          </Field>
          <Field error={form.formState.errors.language?.message} label="Language (optional)">
            <Input disabled={isPending} {...form.register("language")} />
          </Field>
          <Field error={form.formState.errors.publicationDate?.message} label="Publication date (optional)">
            <Input disabled={isPending} type="date" {...form.register("publicationDate")} />
          </Field>
          <Field error={form.formState.errors.pageCount?.message} label="Page count (optional)">
            <Input
              disabled={isPending}
              min="1"
              type="number"
              {...form.register("pageCount", { setValueAs: optionalNumber })}
            />
          </Field>
        </div>
        <Field error={form.formState.errors.description?.message} label="Description (optional)">
          <Textarea disabled={isPending} rows={5} {...form.register("description")} />
        </Field>
      </FormSection>

      {book ? (
        <FormSection description="Keep, replace, or remove the media currently attached to this book." title="Existing media">
          <div className="grid gap-4 md:grid-cols-3">
            <ExistingMedia
              icon={ImageIcon}
              kind="cover"
              label="Cover image"
              onRemoveChange={(checked) => setRemoval("cover", checked)}
              pending={isPending}
              remove={removeCover}
              replacement={files.cover}
              title={book.title}
              url={book.coverUrl}
            />
            <ExistingMedia
              icon={FileText}
              kind="pdf"
              label="PDF file"
              onRemoveChange={(checked) => setRemoval("pdf", checked)}
              pending={isPending}
              remove={removePdf}
              replacement={files.pdf}
              title={book.title}
              url={book.pdfUrl}
            />
            <ExistingMedia
              icon={FileAudio}
              kind="audio"
              label="Audio file"
              onRemoveChange={(checked) => setRemoval("audio", checked)}
              pending={isPending}
              remove={removeAudio}
              replacement={files.audio}
              title={book.title}
              url={book.audioUrl}
            />
          </div>
        </FormSection>
      ) : null}

      <FormSection description="Uploads are optional. Selecting a replacement keeps the matching remove option off." title="Content files">
        <div className="grid gap-4 md:grid-cols-3">
          <FileUpload
            accept="image/*"
            icon={ImageIcon}
            inputKey={`cover-${files.cover?.name ?? "empty"}-${removeCover}`}
            label="Cover image"
            limit="10 MB maximum"
            onChange={(file) => selectFile("cover", file)}
            value={files.cover}
          />
          <FileUpload
            accept="application/pdf"
            icon={FileText}
            inputKey={`pdf-${files.pdf?.name ?? "empty"}-${removePdf}`}
            label="PDF file"
            limit="100 MB maximum"
            onChange={(file) => selectFile("pdf", file)}
            value={files.pdf}
          />
          <FileUpload
            accept="audio/*"
            icon={FileAudio}
            inputKey={`audio-${files.audio?.name ?? "empty"}-${removeAudio}`}
            label="Audio file"
            limit="200 MB maximum"
            onChange={(file) => selectFile("audio", file)}
            value={files.audio}
          />
        </div>
      </FormSection>

      <FormSection description="Control access and where this title appears." title="Library settings">
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={form.formState.errors.accessType?.message} label="Access type">
            <div className="flex gap-2">
              {(["FREE", "PREMIUM"] as BookAccessType[]).map((value) => (
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm" key={value}>
                  <input disabled={isPending} type="radio" value={value} {...form.register("accessType")} />
                  {value === "FREE" ? "Free" : "Premium"}
                </label>
              ))}
            </div>
          </Field>
          <Field error={form.formState.errors.audioDurationSeconds?.message} label="Audio duration in seconds (optional)">
            <Input
              disabled={isPending}
              min="1"
              placeholder="Optional"
              type="number"
              {...form.register("audioDurationSeconds", { setValueAs: optionalNumber })}
            />
          </Field>
        </div>
        <Field error={form.formState.errors.categoryIds?.message} label="Categories">
          <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesQuery.data.filter((category) => category.active).map((category) => (
              <label className="flex items-center gap-2 text-sm" key={category.id}>
                <input
                  checked={selectedCategoryIds.includes(category.id)}
                  disabled={isPending}
                  onChange={(event) => {
                    const currentIds = form.getValues("categoryIds");
                    form.setValue(
                      "categoryIds",
                      event.target.checked
                        ? [...new Set([...currentIds, category.id])]
                        : currentIds.filter((id) => id !== category.id),
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }}
                  type="checkbox"
                />
                {category.name}
              </label>
            ))}
          </div>
        </Field>
      </FormSection>
    </form>
  );
}

function ExistingMedia({
  icon: Icon,
  kind,
  label,
  onRemoveChange,
  pending,
  remove,
  replacement,
  title,
  url,
}: {
  icon: LucideIcon;
  kind: FileField;
  label: string;
  onRemoveChange: (checked: boolean) => void;
  pending: boolean;
  remove: boolean;
  replacement?: File | null;
  title: string;
  url: string | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/25 p-4">
      <div className="flex items-start gap-3">
        {kind === "cover" && url ? (
          <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
            <Image alt={`Current cover of ${title}`} className="object-cover" fill sizes="48px" src={url} />
          </span>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="font-medium">{label}</p>
          {replacement ? <p className="mt-1 truncate text-xs text-success">Replacement: {replacement.name}</p> : null}
          {!replacement && url ? (
            <a className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline" href={url} rel="noreferrer" target="_blank">
              View existing <ExternalLink aria-hidden="true" className="size-3" />
            </a>
          ) : null}
          {!replacement && !url ? <p className="mt-1 text-xs text-muted-foreground">No existing file</p> : null}
        </div>
      </div>
      {url ? (
        <label className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <input
            checked={remove}
            disabled={pending || Boolean(replacement)}
            onChange={(event) => onRemoveChange(event.target.checked)}
            type="checkbox"
          />
          <Trash2 aria-hidden="true" className="size-3.5 text-destructive" />
          Remove existing {kind}
        </label>
      ) : null}
    </div>
  );
}

function FileUpload({
  accept,
  icon: Icon,
  inputKey,
  label,
  limit,
  onChange,
  value,
}: {
  accept: string;
  icon: LucideIcon;
  inputKey: string;
  label: string;
  limit: string;
  onChange: (file?: File) => boolean;
  value?: File | null;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
      <Icon aria-hidden="true" className="size-5 text-primary" />
      <span className="text-sm font-medium">{label}</span>
      <span className="max-w-full truncate text-xs text-muted-foreground">{value?.name ?? "Choose file"}</span>
      <span className="text-xs text-muted-foreground">{limit}</span>
      <input
        accept={accept}
        className="sr-only"
        key={inputKey}
        onChange={(event) => {
          if (!onChange(event.target.files?.[0])) event.currentTarget.value = "";
        }}
        type="file"
      />
    </label>
  );
}

function FormSection({ children, description, title }: { children: React.ReactNode; description: string; title: string }) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardHeader className="border-b py-readora-md">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4 p-readora-md">{children}</CardContent>
    </Card>
  );
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <div className="space-y-1.5"><label className="text-sm font-medium">{label}</label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}

function getDefaults(book?: Book): BookFormValues {
  return book
    ? {
        title: book.title,
        description: book.description ?? "",
        isbn: book.isbn ?? "",
        language: book.language ?? "",
        publicationDate: book.publicationDate?.slice(0, 10) ?? "",
        author: book.author,
        pageCount: book.pageCount,
        audioDurationSeconds: book.audioDurationSeconds,
        accessType: book.accessType,
        categoryIds: book.categories.map((category) => category.id),
        removeCover: false,
        removePdf: false,
        removeAudio: false,
      }
    : {
        title: "",
        description: "",
        isbn: "",
        language: "English",
        publicationDate: "",
        author: "",
        pageCount: null,
        audioDurationSeconds: null,
        accessType: "FREE",
        categoryIds: [],
        removeCover: false,
        removePdf: false,
        removeAudio: false,
      };
}

function toCreatePayload(values: BookFormValues): CreateBookPayload {
  return {
    title: values.title.trim(),
    description: optionalText(values.description),
    isbn: optionalText(values.isbn),
    language: optionalText(values.language),
    publicationDate: optionalText(values.publicationDate),
    author: values.author.trim(),
    pageCount: values.pageCount,
    audioDurationSeconds: values.audioDurationSeconds,
    accessType: values.accessType,
    categoryIds: values.categoryIds,
  };
}

function optionalText(value: string) {
  const normalized = value.trim();
  return normalized || null;
}

function optionalNumber(value: unknown) {
  return value === "" || value === null || value === undefined ? null : Number(value);
}

function formatFileSize(bytes: number) {
  return `${bytes / megabyte} MB`;
}

function BookFormSkeleton() {
  return <div className="space-y-4"><div className="h-10 w-52 animate-pulse rounded-lg bg-muted" />{[0, 1, 2].map((item) => <div className="h-56 animate-pulse rounded-xl bg-card ring-1 ring-border" key={item} />)}</div>;
}
