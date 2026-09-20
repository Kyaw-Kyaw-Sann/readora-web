"use client";

import { BookOpen, Eye, RefreshCw, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularBooks } from "@/hooks/use-dashboard";
import type { BookListItem } from "@/types/book";

type RatedBook = BookListItem & { averageRating?: number; rating?: number };

const localCoverByTitle: Record<string, string> = {
  "clean code": "/Clean Code.jpg",
  "rich dad poor dad": "/Rich Dad.jpg",
  sapiens: "/Sapiens.jpg",
  "the hobbit": "/The Hobbit.jpg",
};

export function PopularBooks() {
  const query = usePopularBooks();

  return (
    <section className="scroll-mt-20 bg-card/45 py-20 sm:py-24" id="popular">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-border/80 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Curated by readers</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Popular on Readora</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground sm:block">
            The titles readers are opening, finishing, and returning to most.
          </p>
        </div>

        {query.isLoading ? <PopularBooksSkeleton /> : null}
        {query.isError ? (
          <EmptyState
            className="bg-background/60"
            title="Couldn’t load popular books"
            description="The library is taking a little longer than expected."
            icon={<BookOpen className="size-6" />}
            action={<Button onClick={() => void query.refetch()} type="button"><RefreshCw />Try again</Button>}
          />
        ) : null}
        {!query.isLoading && !query.isError && !query.data?.length ? (
          <EmptyState
            className="bg-background/60"
            title="No popular books yet"
            description="Reader favourites will appear here as the library grows."
            icon={<BookOpen className="size-6" />}
          />
        ) : null}
        {query.data?.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
            {query.data.slice(0, 5).map((book) => <PopularBookCard book={book} key={book.id} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PopularBookCard({ book }: { book: RatedBook }) {
  const [imageFailed, setImageFailed] = useState(false);
  const localCover = localCoverByTitle[book.title.trim().toLowerCase()];
  const cover = !imageFailed ? book.coverUrl ?? localCover : undefined;
  const rating = book.averageRating ?? book.rating;

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/80 bg-secondary shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:shadow-float">
        {cover ? (
          <Image
            alt={`Cover of ${book.title}`}
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
            fill
            onError={() => setImageFailed(true)}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 220px"
            src={cover}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,var(--secondary),var(--muted))] p-5 text-center">
            <BookOpen aria-hidden="true" className="size-8 text-primary/75" />
            <span className="line-clamp-3 font-heading text-sm font-semibold text-secondary-foreground">{book.title}</span>
          </div>
        )}
        <span className={`absolute top-2.5 left-2.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-[0.08em] uppercase shadow-sm backdrop-blur ${book.accessType === "PREMIUM" ? "border-primary/30 bg-primary text-primary-foreground" : "border-white/50 bg-background/88 text-foreground"}`}>
          {book.accessType === "PREMIUM" ? "Premium" : "Free"}
        </span>
      </div>
      <div className="pt-3.5">
        <h3 className="line-clamp-2 text-sm leading-5 font-semibold text-foreground">{book.title}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">{book.author}</p>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {rating !== undefined ? (
            <><Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />{rating.toFixed(1)}</>
          ) : (
            <><Eye aria-hidden="true" className="size-3.5 text-primary" />{book.viewCount?.toLocaleString() ?? "Popular"}</>
          )}
        </p>
      </div>
    </article>
  );
}

function PopularBooksSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item}>
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="mt-3.5 h-4 w-4/5" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
