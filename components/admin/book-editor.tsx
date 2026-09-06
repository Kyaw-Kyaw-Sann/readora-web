"use client";
import { BookForm } from "@/components/admin/book-form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useBook } from "@/hooks/use-books";
export function BookEditor({ id }: { id: number }) { const bookQuery = useBook(id); if (bookQuery.isLoading) return <div className="h-80 animate-pulse rounded-xl bg-card ring-1 ring-border" />; if (bookQuery.isError || !bookQuery.data) return <EmptyState title="Couldn’t load this book" description="Please check the connection and try again." action={<Button onClick={() => void bookQuery.refetch()} type="button">Retry</Button>} />; return <BookForm book={bookQuery.data} />; }
