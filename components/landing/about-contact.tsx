import { BookOpen, Headphones, Heart, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: BookOpen,
    title: "A library that feels personal",
    description: "Keep your books, favorite finds, and reading journey together in one calm place.",
  },
  {
    icon: Headphones,
    title: "Stories in every format",
    description: "Move naturally between reading and listening, whenever the moment is right.",
  },
  {
    icon: Heart,
    title: "Made for returning",
    description: "Pick up the books you love and continue from where you last left off.",
  },
];

export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="scroll-mt-20 border-y border-border/70 bg-card/45 py-20 sm:py-24" id="about">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">ABOUT READORA</p>
          <h2 className="mt-3 font-heading text-3xl leading-tight text-foreground sm:text-4xl" id="about-heading">A quieter, more connected way to enjoy books.</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Readora brings your digital library, audiobooks, progress, and favorite stories into one warm home for reading. It is built for unhurried discovery and the simple pleasure of coming back to a good book.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {highlights.map(({ icon: Icon, title, description }) => (
            <article className="rounded-[var(--radius-card)] border border-border bg-background p-5 shadow-card" key={title}>
              <Icon aria-hidden="true" className="size-5 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
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
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-8 text-center shadow-float sm:p-12">
          <Mail aria-hidden="true" className="mx-auto size-6 text-primary" />
          <p className="mt-4 text-sm font-semibold tracking-wide text-primary">CONTACT</p>
          <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl" id="contact-heading">Let&apos;s talk books.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">Have a question, feedback, or an idea for Readora? We would love to hear from you.</p>
          <Button className="mt-7" nativeButton={false} render={<a href="mailto:hello@readora.app" />}>Email Readora</Button>
        </div>
      </div>
    </section>
  );
}
