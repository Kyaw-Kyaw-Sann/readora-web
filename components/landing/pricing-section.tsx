import { Check, Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const freeBenefits = ["Access to free published books", "Reading and listening progress", "Favorites", "Personalized recommendations"];
const premiumBenefits = ["Everything in Free", "Access to all premium books", "Full published library access"];

export function PricingSection() {
  return <section className="scroll-mt-20 bg-secondary/35 py-20 sm:py-24" id="premium"><div className="mx-auto max-w-5xl px-5 sm:px-8"><div className="text-center"><p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Choose your shelf</p><h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Free or Premium, the choice is yours</h2><p className="mt-4 text-muted-foreground">Premium pricing is shown for demonstration only. No live payment is processed.</p></div><div className="mt-10 grid gap-5 lg:grid-cols-2"><PlanCard benefits={freeBenefits} name="Free" price="$0" subtitle="A welcoming way to begin" /><PlanCard benefits={premiumBenefits} premium name="Premium" price="$4.99" subtitle="$39.99 yearly · best value" /></div></div></section>;
}

function PlanCard({ benefits, name, price, subtitle, premium = false }: { benefits: string[]; name: string; price: string; subtitle: string; premium?: boolean }) { return <article className={`relative rounded-2xl border bg-card p-7 shadow-card ${premium ? "border-primary/60 shadow-float" : "border-border"}`}>{premium ? <Badge className="absolute top-5 right-5"><Crown />Best value</Badge> : null}<h3 className="font-heading text-2xl font-semibold">{name}</h3><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p><div className="mt-6 flex items-end gap-2"><span className="text-4xl font-semibold tracking-tight">{price}</span><span className="pb-1 text-sm text-muted-foreground">/ month</span></div><ul className="mt-7 space-y-3">{benefits.map((benefit) => <li className="flex items-start gap-2.5 text-sm" key={benefit}><Check className="mt-0.5 size-4 shrink-0 text-primary" />{benefit}</li>)}</ul><Button className="mt-8 h-10 w-full" nativeButton={false} render={<a href="#download" />} variant={premium ? "default" : "outline"}>{premium ? "Explore Premium" : "Start Reading"}</Button></article>; }
