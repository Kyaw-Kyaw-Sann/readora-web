"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, FileAudio, FileText, ImageIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import type { Book, BookAccessType, CreateBookRequest } from "@/types/book";

type BookFormValues = z.infer<typeof bookFormSchema>;
type FileField = "cover" | "pdf" | "audio";

export function BookForm({ book }: { book?: Book }) {
  const categoriesQuery = useCategories();
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const [files, setFiles] = useState<Record<FileField, File | undefined>>({ cover: undefined, pdf: undefined, audio: undefined });
  const isEditing = Boolean(book);
  const form = useForm<BookFormValues>({ resolver: zodResolver(bookFormSchema), defaultValues: getDefaults(book) });
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => { form.reset(getDefaults(book)); }, [book, form]);

  async function submit(values: BookFormValues) {
    const request: CreateBookRequest = values;
    try {
      if (book) await updateMutation.mutateAsync({ id: book.id, data: request, files });
      else await createMutation.mutateAsync({ data: request, files });
      toast.success(isEditing ? "Book updated successfully." : "Book created successfully.");
      if (!isEditing) form.reset(getDefaults());
      setFiles({ cover: undefined, pdf: undefined, audio: undefined });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to save the book."); }
  }

  if (categoriesQuery.isLoading) return <BookFormSkeleton />;
  if (categoriesQuery.isError || !categoriesQuery.data) return <EmptyState title="Couldn’t load categories" description="Categories are required before a book can be saved." action={<Button onClick={() => void categoriesQuery.refetch()} type="button">Retry</Button>} />;

  return (
    <form className="space-y-readora-lg" onSubmit={form.handleSubmit(submit)}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm text-muted-foreground">{isEditing ? "Update this library title and its files." : "Add a new title to the Readora library."}</p><h1 className="mt-1 font-heading text-3xl font-semibold">{isEditing ? "Edit book" : "Add book"}</h1></div>
        <Button disabled={isPending} type="submit">{isPending ? <LoaderCircle className="animate-spin" /> : null}{isPending ? "Saving…" : isEditing ? "Save changes" : "Create book"}</Button>
      </div>
      <FormSection title="Basic information" description="The details readers see in the library.">
        <div className="grid gap-4 md:grid-cols-2"><Field label="Title" error={form.formState.errors.title?.message}><Input disabled={isPending} {...form.register("title")} /></Field><Field label="Author" error={form.formState.errors.author?.message}><Input disabled={isPending} {...form.register("author")} /></Field><Field label="ISBN" error={form.formState.errors.isbn?.message}><Input disabled={isPending} {...form.register("isbn")} /></Field><Field label="Language" error={form.formState.errors.language?.message}><Input disabled={isPending} {...form.register("language")} /></Field><Field label="Publication date" error={form.formState.errors.publicationDate?.message}><Input disabled={isPending} type="date" {...form.register("publicationDate")} /></Field><Field label="Page count" error={form.formState.errors.pageCount?.message}><Input disabled={isPending} type="number" min="1" {...form.register("pageCount", { valueAsNumber: true })} /></Field></div>
        <Field label="Description" error={form.formState.errors.description?.message}><Textarea disabled={isPending} rows={5} {...form.register("description")} /></Field>
      </FormSection>
      <FormSection title="Content files" description="Uploads are optional; leave a file empty to keep the existing one when editing.">
        <div className="grid gap-4 md:grid-cols-3"><FileUpload accept="image/*" icon={ImageIcon} label="Cover image" onChange={(file) => setFiles((current) => ({ ...current, cover: file }))} value={files.cover} /><FileUpload accept="application/pdf" icon={FileText} label="PDF file" onChange={(file) => setFiles((current) => ({ ...current, pdf: file }))} value={files.pdf} /><FileUpload accept="audio/*" icon={FileAudio} label="Audio file" onChange={(file) => setFiles((current) => ({ ...current, audio: file }))} value={files.audio} /></div>
      </FormSection>
      <FormSection title="Library settings" description="Control access and where this title appears.">
        <div className="grid gap-4 md:grid-cols-2"><Field label="Access type" error={form.formState.errors.accessType?.message}><div className="flex gap-2">{(["FREE", "PREMIUM"] as BookAccessType[]).map((value) => <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm" key={value}><input disabled={isPending} type="radio" value={value} {...form.register("accessType")} />{value === "FREE" ? "Free" : "Premium"}</label>)}</div></Field><Field label="Audio duration (seconds)" error={form.formState.errors.audioDurationSeconds?.message}><Input disabled={isPending} min="0" placeholder="Optional" type="number" {...form.register("audioDurationSeconds", { setValueAs: (value) => value === "" ? null : Number(value) })} /></Field></div>
        <Field label="Categories" error={form.formState.errors.categoryIds?.message}><div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2 lg:grid-cols-3">{categoriesQuery.data.filter((category) => category.active).map((category) => <label className="flex items-center gap-2 text-sm" key={category.id}><input type="checkbox" value={category.id} {...form.register("categoryIds", { setValueAs: Number })} />{category.name}</label>)}</div></Field>
      </FormSection>
    </form>
  );
}

function getDefaults(book?: Book): BookFormValues { return book ? { title: book.title, description: book.description, isbn: book.isbn, language: book.language, publicationDate: book.publicationDate.slice(0, 10), author: book.author, pageCount: book.pageCount, audioDurationSeconds: book.audioDurationSeconds, accessType: book.accessType, categoryIds: book.categories.map((category) => category.id) } : { title: "", description: "", isbn: "", language: "English", publicationDate: "", author: "", pageCount: 1, audioDurationSeconds: null, accessType: "FREE", categoryIds: [] }; }
function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <Card className="border border-border py-0 shadow-card"><CardHeader className="border-b py-readora-md"><CardTitle>{title}</CardTitle><p className="text-xs text-muted-foreground">{description}</p></CardHeader><CardContent className="space-y-4 p-readora-md">{children}</CardContent></Card>; }
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <div className="space-y-1.5"><label className="text-sm font-medium">{label}</label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>; }
function FileUpload({ accept, icon: Icon, label, onChange, value }: { accept: string; icon: typeof ImageIcon; label: string; onChange: (file?: File) => void; value?: File }) { return <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center"><Icon className="size-5 text-primary" /><span className="text-sm font-medium">{label}</span><span className="max-w-full truncate text-xs text-muted-foreground">{value?.name ?? "Choose file"}</span><input accept={accept} className="sr-only" onChange={(event) => onChange(event.target.files?.[0])} type="file" /></label>; }
function BookFormSkeleton() { return <div className="space-y-4"><div className="h-10 w-52 animate-pulse rounded-lg bg-muted" />{[0, 1, 2].map((item) => <div className="h-56 animate-pulse rounded-xl bg-card ring-1 ring-border" key={item} />)}</div>; }
