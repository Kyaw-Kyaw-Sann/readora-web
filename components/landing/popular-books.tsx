"use client";

import { BookOpen, RefreshCw, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularBooks } from "@/hooks/use-dashboard";
import type { BookListItem } from "@/types/book";

const fallbackCovers = ["/Rich Dad.jpg", "/Sapiens.jpg", "/The Hobbit.jpg", "/Clean Code.jpg"];
type RatedBook = BookListItem & { averageRating?: number; rating?: number };

export function PopularBooks() {
  const query = usePopularBooks();

  return (
    <section className="scroll-mt-20 border-y border-border/70 bg-card/45 py-18 sm:py-22" id="popular">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Reader favourites</p><h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Popular on Readora</h2></div>
          <span className="hidden text-sm text-muted-foreground sm:block">Stories readers return to</span>
        </div>
        {query.isLoading ? <PopularBooksSkeleton /> : null}
        {query.isError ? <EmptyState className="bg-background/60" title="Couldn’t load popular books" description="The library is taking a little longer than expected." icon={<BookOpen className="size-6" />} action={<Button onClick={() => void query.refetch()} type="button"><RefreshCw />Try again</Button>} /> : null}
        {!query.isLoading && !query.isError && !query.data?.length ? <EmptyState className="bg-background/60" title="No popular books yet" description="Reader favourites will appear here as the library grows." icon={<BookOpen className="size-6" />} /> : null}
        {query.data?.length ? <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{query.data.slice(0, 4).map((book, index) => <PopularBookCard book={book} fallback={fallbackCovers[index % fallbackCovers.length]} key={book.id} />)}</div> : null}
      </div>
    </section>
  );
}

function PopularBookCard({ book, fallback }: { book: RatedBook; fallback: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const source = !imageFailed && book.coverUrl ? book.coverUrl : fallback;
  const rating = book.averageRating ?? book.rating;
  return <article className="group rounded-2xl border border-border bg-card p-2.5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-float sm:p-3"><div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary"><Image alt={`Cover of ${book.title}`} className="object-cover transition duration-500 group-hover:scale-[1.03]" fill onError={() => setImageFailed(true)} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 250px" src={source} /><Badge className="absolute top-2 left-2 shadow-sm" variant={book.accessType === "PREMIUM" ? "default" : "secondary"}>{book.accessType === "PREMIUM" ? "Premium" : "Free"}</Badge></div><div className="px-1 pt-3 pb-1"><h3 className="line-clamp-2 min-h-10 font-sans text-sm font-semibold leading-5">{book.title}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{book.author}</p>{rating !== undefined ? <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"><Star className="size-3 fill-current" />{rating.toFixed(1)}</p> : <p className="mt-2 text-xs text-muted-foreground">Popular with readers</p>}</div></article>;
}

function PopularBooksSkeleton() { return <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{[0,1,2,3].map((item) => <div className="rounded-2xl border border-border bg-card p-3" key={item}><Skeleton className="aspect-[2/3] w-full rounded-xl" /><Skeleton className="mt-3 h-4 w-4/5" /><Skeleton className="mt-2 h-3 w-1/2" /></div>)}</div>; }
