"use client";

import { format } from "date-fns";
import { BookOpen, ChevronLeft, ChevronRight, Eye, MessageSquareText, RefreshCw, Search, Star, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { UserAvatar } from "@/components/admin/user-management";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteReview, useReviews } from "@/hooks/use-reviews";
import type { AdminReview, AdminReviewFilters } from "@/types/review";

const pageSize = 10;

export function ReviewManagement() {
  const [filters, setFilters] = useState<AdminReviewFilters>({ page: 0, size: pageSize });
  const [reviewToView, setReviewToView] = useState<AdminReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(null);
  const deferredSearch = useDeferredValue(filters.search);
  const reviewsQuery = useReviews({ ...filters, search: deferredSearch });
  const reviews = reviewsQuery.data;

  const updateFilters = (changes: Partial<AdminReviewFilters>) => {
    setFilters((current) => ({ ...current, ...changes, page: changes.page ?? 0 }));
  };

  return (
    <div className="space-y-readora-lg">
      <div>
        <p className="text-sm text-muted-foreground">Review reader feedback and remove content when moderation is necessary.</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground">Reviews</h1>
      </div>

      <ReviewFilters filters={filters} onChange={updateFilters} />

      {reviewsQuery.isLoading ? <ReviewTableSkeleton /> : null}
      {reviewsQuery.isError ? (
        <EmptyState
          title="Couldn’t load reviews"
          description="Please check the connection and try again."
          action={<Button onClick={() => void reviewsQuery.refetch()} type="button"><RefreshCw aria-hidden="true" />Retry</Button>}
        />
      ) : null}
      {!reviewsQuery.isLoading && !reviewsQuery.isError && reviews?.content.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Try a different search or rating filter."
          icon={<MessageSquareText aria-hidden="true" className="size-6" />}
        />
      ) : null}
      {reviews?.content.length ? (
        <>
          <ReviewTable onDelete={setReviewToDelete} onView={setReviewToView} reviews={reviews.content} />
          <ReviewPagination
            currentPage={reviews.page}
            isLastPage={reviews.last}
            onPageChange={(page) => updateFilters({ page })}
            totalElements={reviews.totalElements}
            totalPages={reviews.totalPages}
          />
        </>
      ) : null}

      <ReviewDetailDialog onOpenChange={(open) => { if (!open) setReviewToView(null); }} review={reviewToView} />
      <ReviewDeleteDialog onOpenChange={(open) => { if (!open) setReviewToDelete(null); }} review={reviewToDelete} />
    </div>
  );
}

function ReviewFilters({ filters, onChange }: { filters: AdminReviewFilters; onChange: (changes: Partial<AdminReviewFilters>) => void }) {
  const hasFilters = filters.search !== undefined || filters.rating !== undefined;

  return (
      <div aria-label="Review filters" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_auto]">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
          <Input className="h-10 bg-card pl-9" onChange={(event) => onChange({ search: event.target.value || undefined })} placeholder="Search reader, book, or comment…" type="search" value={filters.search ?? ""} />
        </div>
        <label className="sr-only" htmlFor="rating-filter">Filter by rating</label>
        <select
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="rating-filter"
          onChange={(event) => onChange({ rating: event.target.value ? Number(event.target.value) : undefined })}
          value={filters.rating ?? ""}
        >
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
        </select>
        {hasFilters ? <Button className="h-10 justify-self-start px-3 md:justify-self-auto" onClick={() => onChange({ search: undefined, rating: undefined })} type="button" variant="ghost"><X aria-hidden="true" />Clear</Button> : null}
      </div>
  );
}

function ReviewTable({ onDelete, onView, reviews }: { onDelete: (review: AdminReview) => void; onView: (review: AdminReview) => void; reviews: AdminReview[] }) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Reviewer</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="px-4">
                  <div className="flex min-w-48 items-center gap-3">
                    <UserAvatar imageUrl={review.user.profileImageUrl} name={review.user.name} />
                    <div className="min-w-0"><p className="truncate font-medium">{review.user.name}</p><p className="truncate text-xs text-muted-foreground">{review.user.email}</p></div>
                  </div>
                </TableCell>
                <TableCell><BookIdentity book={review.book} /></TableCell>
                <TableCell><Rating value={review.rating} /></TableCell>
                <TableCell className="max-w-72 whitespace-normal text-muted-foreground"><p className="line-clamp-2">{review.comment || "No comment provided."}</p></TableCell>
                <TableCell className="text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
                <TableCell className="px-4 text-right"><div className="flex justify-end gap-1"><Button aria-label={`View review by ${review.user.name}`} onClick={() => onView(review)} size="icon-sm" type="button" variant="ghost"><Eye aria-hidden="true" /></Button><Button aria-label={`Delete review by ${review.user.name}`} onClick={() => onDelete(review)} size="icon-sm" type="button" variant="ghost"><Trash2 aria-hidden="true" className="text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ReviewPagination({ currentPage, isLastPage, onPageChange, totalElements, totalPages }: { currentPage: number; isLastPage: boolean; onPageChange: (page: number) => void; totalElements: number; totalPages: number }) {
  return <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>{totalElements} {totalElements === 1 ? "review" : "reviews"} found</span><div className="flex items-center gap-2 self-end sm:self-auto"><Button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)} size="sm" type="button" variant="outline"><ChevronLeft aria-hidden="true" />Previous</Button><span className="whitespace-nowrap">Page {currentPage + 1} of {Math.max(totalPages, 1)}</span><Button disabled={isLastPage} onClick={() => onPageChange(currentPage + 1)} size="sm" type="button" variant="outline">Next<ChevronRight aria-hidden="true" /></Button></div></div>;
}

function ReviewDetailDialog({ onOpenChange, review }: { onOpenChange: (open: boolean) => void; review: AdminReview | null }) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(review)}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>Review details</DialogTitle><DialogDescription>Reader feedback is displayed exactly as submitted.</DialogDescription></DialogHeader>
        {review ? <div className="space-y-5"><div className="grid gap-4 rounded-lg border border-border bg-muted/35 p-4 sm:grid-cols-2"><div className="flex items-center gap-3"><UserAvatar imageUrl={review.user.profileImageUrl} name={review.user.name} /><div className="min-w-0"><p className="truncate font-medium">{review.user.name}</p><p className="truncate text-sm text-muted-foreground">{review.user.email}</p></div></div><BookIdentity book={review.book} /></div><Separator /><div><p className="text-sm font-medium text-muted-foreground">Rating</p><div className="mt-2"><Rating value={review.rating} /></div></div><div><p className="text-sm font-medium text-muted-foreground">Comment</p><p className="mt-2 whitespace-pre-wrap leading-7 text-foreground">{review.comment || "No comment provided."}</p></div><dl className="grid gap-4 sm:grid-cols-2"><DateItem label="Created" value={formatDateTime(review.createdAt)} /><DateItem label="Last updated" value={formatDateTime(review.updatedAt)} /></dl></div> : null}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function ReviewDeleteDialog({ onOpenChange, review }: { onOpenChange: (open: boolean) => void; review: AdminReview | null }) {
  const deleteMutation = useDeleteReview();

  async function handleDelete() {
    if (!review) return;

    try {
      await deleteMutation.mutateAsync(review.id);
      toast.success("Review deleted successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete the review.");
    }
  }

  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(review)}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2 aria-hidden="true" /></AlertDialogMedia><AlertDialogTitle>Delete this review?</AlertDialogTitle><AlertDialogDescription>{review ? `This permanently removes ${review.user.name}’s review for “${review.book.title}”. This cannot be undone.` : "This permanently removes the selected review."}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel><AlertDialogAction disabled={deleteMutation.isPending || !review} onClick={() => void handleDelete()} variant="destructive">{deleteMutation.isPending ? "Deleting…" : "Delete review"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function BookIdentity({ book }: { book: AdminReview["book"] }) {
  return <div className="flex min-w-52 items-center gap-3"><BookCover coverUrl={book.coverUrl} title={book.title} /><div className="min-w-0"><p className="truncate font-medium">{book.title}</p><p className="truncate text-xs text-muted-foreground">{book.author}</p></div></div>;
}

function BookCover({ coverUrl, title }: { coverUrl: string | null; title: string }) {
  if (!coverUrl) return <span className="flex h-11 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"><BookOpen aria-hidden="true" className="size-4" /></span>;
  return <span className="relative h-11 w-8 shrink-0 overflow-hidden rounded-md bg-secondary"><Image alt={`Cover of ${title}`} className="object-cover" fill sizes="32px" src={coverUrl} /></span>;
}

function Rating({ value }: { value: number }) {
  return <span aria-label={`${value} out of 5 stars`} className="flex items-center gap-0.5 text-primary">{[1, 2, 3, 4, 5].map((star) => <Star aria-hidden="true" className={star <= value ? "size-3.5 fill-current" : "size-3.5 text-border"} key={star} />)}<span className="ml-1 text-xs font-medium text-foreground">{value.toFixed(1)}</span></span>;
}

function DateItem({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt><dd className="mt-1.5 font-medium">{value}</dd></div>;
}

function ReviewTableSkeleton() {
  return <Card className="border border-border py-0 shadow-card"><CardContent className="space-y-4 p-readora-md">{[0, 1, 2, 3, 4].map((item) => <Skeleton className="h-12 w-full" key={item} />)}</CardContent></Card>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy · h:mm a");
}
