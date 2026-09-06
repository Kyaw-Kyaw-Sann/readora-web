import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-y border-border py-18 sm:py-22" id="download">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_13%,transparent),transparent_55%)]" />
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="size-6" /></span>
        <h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Ready to dive into your next favorite book?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join readers who keep every chapter, listen, and discovery close at hand with Readora.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="h-11 px-6" nativeButton={false} render={<a aria-label="Download Readora app" href="#download" />}>Download App<ArrowRight /></Button>
          <Button className="h-11 px-6" nativeButton={false} render={<a href="#popular" />} variant="outline">Explore Books</Button>
        </div>
      </div>
    </section>
  );
}
