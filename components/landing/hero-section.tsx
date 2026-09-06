import { ArrowRight, BookOpen, Headphones, Sparkles } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_38%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_34%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Stories that stay with you
          </div>
          <h1 className="font-heading text-5xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your library,<br /><span className="text-primary">always where</span><br />you left it.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
            Read books, listen to audiobooks, and continue seamlessly across your devices—wherever the next chapter finds you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button className="h-11 px-6 text-base shadow-float" nativeButton={false} render={<a href="#download" />}>Download App<ArrowRight /></Button>
            <Button className="h-11 px-6 text-base" nativeButton={false} render={<a href="#popular" />} variant="outline">Explore Books</Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
            <span className="inline-flex items-center gap-2"><BookOpen className="size-4 text-primary" />Read anywhere</span>
            <span className="inline-flex items-center gap-2"><Headphones className="size-4 text-primary" />Listen anytime</span>
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:min-h-150">
          <div className="absolute size-96 rounded-full border border-primary/20 sm:size-125" />
          <div className="absolute size-78 rotate-12 rounded-[42%_58%_62%_38%] bg-primary/10 blur-sm sm:size-108" />
          <div className="absolute left-2 top-1/3 size-20 rounded-full bg-primary/10 blur-xl sm:left-10" />
          <Sparkles className="absolute right-8 top-20 size-7 text-primary sm:right-12" />
          <Sparkles className="absolute bottom-24 left-6 size-5 text-primary sm:left-16" />
          <div className="relative w-[245px] rotate-1 overflow-hidden rounded-[2.7rem] border-[7px] border-[#2d261f] bg-card p-1.5 shadow-[0_30px_80px_rgba(91,57,15,0.25)] sm:w-[285px] dark:border-[#0e0d0b]">
            <div className="absolute top-2 left-1/2 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-[#191714]" />
            <Image alt="Readora mobile app home screen" className="h-auto w-full rounded-[2rem]" height={1671} priority sizes="(max-width: 640px) 245px, 285px" src="/UI11.png" width={942} />
          </div>
        </div>
      </div>
    </section>
  );
}
