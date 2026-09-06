"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ReadoraLogo } from "@/components/shared/readora-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Premium", href: "#premium" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <ReadoraLogo />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button className="h-10 px-5 shadow-card" nativeButton={false} render={<a href="#download" />}>Download App</Button>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)} size="icon" type="button" variant="ghost">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background p-5 shadow-float md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map((link) => (
              <Link className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent" href={link.href} key={link.label} onClick={() => setOpen(false)}>{link.label}</Link>
            ))}
            <Button className="mt-3 h-10" nativeButton={false} render={<a href="#download" />} onClick={() => setOpen(false)}>Download App</Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
