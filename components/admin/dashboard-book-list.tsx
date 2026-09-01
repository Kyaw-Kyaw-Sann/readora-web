import { format } from "date-fns";
import { BookOpen, Eye, Inbox, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookListItem } from "@/types/book";

interface DashboardBookListProps {
  title: string;
  description: string;
  books?: BookListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  showViews?: boolean;
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : format(date, "MMM d, yyyy");
}

export function DashboardBookList({
  title,
  description,
  books,
  isLoading,
  isError,
  onRetry,
  showViews = false,
}: DashboardBookListProps) {
  return (
    <Card className="border border-border py-0 shadow-card">
      <CardHeader className="border-b py-readora-md">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="p-readora-md">
        {isLoading ? <BookListSkeleton /> : null}
        {isError ? (
          <EmptyState
            className="min-h-44 shadow-none"
            title="Couldn’t load books"
            description="Please check the connection and try again."
            action={
              <Button onClick={onRetry} size="sm" type="button">
                <RefreshCw aria-hidden="true" />
                Retry
              </Button>
            }
          />
        ) : null}
        {!isLoading && !isError && !books?.length ? (
          <EmptyState
            className="min-h-44 shadow-none"
            title="No books to show yet"
            description="Books will appear here once they are available."
            icon={<Inbox aria-hidden="true" className="size-6" />}
          />
        ) : null}
        {!isLoading && !isError && books?.length ? (
          <ul className="divide-y divide-border">
            {books.slice(0, 5).map((book) => (
              <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={book.id}>
                <BookCover book={book} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{book.author}</p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  {showViews ? (
                    <span className="inline-flex items-center gap-1">
                      <Eye aria-hidden="true" className="size-3" />
                      {book.viewCount?.toLocaleString() ?? "—"}
                    </span>
                  ) : (
                    formatCreatedAt(book.createdAt)
                  )}
                </div>
                <Badge
                  className={book.accessType === "PREMIUM" ? "bg-premium text-primary-foreground" : "bg-success/10 text-success"}
                  variant="secondary"
                >
                  {book.accessType === "PREMIUM" ? "Premium" : "Free"}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

function BookCover({ book }: { book: BookListItem }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!book.coverUrl || hasImageError) {
    return (
      <span className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <BookOpen aria-hidden="true" className="size-4" />
      </span>
    );
  }

  return (
    <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-secondary shadow-sm">
      <Image
        alt={`Cover of ${book.title}`}
        className="object-cover"
        fill
        onError={() => setHasImageError(true)}
        sizes="36px"
        src={book.coverUrl}
      />
    </span>
  );
}

function BookListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3, 4].map((item) => (
        <div className="flex items-center gap-3" key={item}>
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
