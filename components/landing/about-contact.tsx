import { ArrowUpRight, BookOpen, Headphones, Heart, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  { icon: BookOpen, title: "One thoughtful library", description: "Books, favorites, and progress stay together in a focused reading space." },
  { icon: Headphones, title: "Two ways to enjoy a story", description: "Read or listen whenever the format—and the moment—feels right." },
  { icon: Heart, title: "Designed for returning", description: "The books you care about are always easy to find and continue." },
];

export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="scroll-mt-20 py-20 sm:py-24" id="about">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">About Readora</p>
          <h2 className="mt-3 max-w-lg font-heading text-3xl leading-tight font-semibold text-foreground sm:text-4xl" id="about-heading">A quieter, more connected way to enjoy books.</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Readora brings your digital library, audiobooks, progress, and favorite stories into one warm home—built for discovery and the simple pleasure of coming back to a good book.</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {highlights.map(({ icon: Icon, title, description }, index) => (
            <article className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr_auto] sm:items-start" key={title}>
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/9 text-primary"><Icon aria-hidden="true" className="size-5" /></span>
              <div><p className="text-base font-semibold text-foreground">{title}</p><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p></div>
              <span className="hidden text-xs font-medium text-muted-foreground sm:block">0{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className="scroll-mt-20 py-20 sm:py-24" id="contact">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="p-7 sm:p-10">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase"><Mail aria-hidden="true" className="size-4" />Contact</div>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-foreground sm:text-4xl" id="contact-heading">Let’s talk books.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Have a question, feedback, or an idea for Readora? We would love to hear from you.</p>
          </div>
          <div className="border-t border-border bg-muted/35 p-7 lg:border-t-0 lg:border-l lg:p-10">
            <Button className="h-11 w-full px-6 lg:w-auto" nativeButton={false} render={<a href="mailto:hello@readora.app" />}>Email Readora<ArrowUpRight aria-hidden="true" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
