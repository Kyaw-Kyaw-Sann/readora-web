import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-y border-border bg-foreground py-18 text-background sm:py-22" id="download">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_50%,color-mix(in_oklch,var(--primary)_34%,transparent),transparent_42%)]" />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          <span className="flex size-11 items-center justify-center rounded-lg border border-background/15 bg-background/8 text-primary"><BookOpen aria-hidden="true" className="size-5" /></span>
          <h2 className="mt-6 max-w-3xl font-heading text-3xl leading-tight font-semibold sm:text-5xl">Your next favorite book is already waiting.</h2>
          <p className="mt-4 max-w-xl text-background/70">Keep every chapter, listen, and discovery close at hand with Readora.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
          <Button className="h-11 px-6" nativeButton={false} render={<a aria-label="Download Readora app" href="#download" />}>Download App<ArrowRight /></Button>
          <Button className="h-11 px-6" nativeButton={false} render={<a href="#popular" />} variant="outline">Explore Books</Button>
        </div>
      </div>
    </section>
  );
}
