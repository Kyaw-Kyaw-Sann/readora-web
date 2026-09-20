import Link from "next/link";

import { ReadoraLogo } from "@/components/shared/readora-logo";

const groups = [
  { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Premium", href: "#premium" }, { label: "Download", href: "#download" }] },
  { title: "Company", links: [{ label: "About Us", href: "#about" }, { label: "Contact", href: "#contact" }] },
  { title: "Support", links: [{ label: "Help Center", href: "#" }, { label: "Terms of Service", href: "#" }, { label: "Privacy Policy", href: "#" }] },
];

export function LandingFooter() {
  return <footer className="bg-card py-14"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[1.15fr_1fr] lg:px-10"><div><ReadoraLogo /><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Your library, always with you. Read, listen, and return to every story that matters.</p></div><div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{groups.map((group) => <div key={group.title}><h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map((link) => <li key={link.label}><Link className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={link.href}>{link.label}</Link></li>)}</ul></div>)}</div></div><div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-border px-5 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><span>© {new Date().getFullYear()} Readora.</span><span>Demo portfolio experience · Payments are not live.</span></div></footer>;
}
