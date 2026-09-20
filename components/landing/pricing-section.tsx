import { Check, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";

const freeBenefits = ["Free published books", "Reading and listening progress", "Favorites", "Personalized recommendations"];
const premiumBenefits = ["Everything included in Free", "Every premium title", "The full published library"];

export function PricingSection() {
  return (
    <section className="scroll-mt-20 border-y border-border/70 bg-secondary/28 py-20 sm:py-24" id="premium">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Simple access</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Choose how you want to read.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Start with the free library or open every published title with Premium.</p>
        </div>

        <div className="mt-11 overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid lg:grid-cols-2">
          <Plan
            benefits={freeBenefits}
            description="The essentials for building a reading habit."
            name="Free"
            price="$0"
          />
          <Plan
            benefits={premiumBenefits}
            description="Complete access for curious, committed readers."
            name="Premium"
            premium
            price="$4.99"
          />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Pricing is presented for this demo experience only. No live payment is processed.</p>
      </div>
    </section>
  );
}

function Plan({ benefits, description, name, price, premium = false }: { benefits: string[]; description: string; name: string; price: string; premium?: boolean }) {
  return (
    <article className={`relative p-7 sm:p-9 ${premium ? "border-t border-primary/30 bg-primary/[0.045] lg:border-t-0 lg:border-l" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-foreground">{name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {premium ? <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground"><Crown aria-hidden="true" className="size-3.5" />Best value</span> : null}
      </div>
      <div className="mt-8 flex items-end gap-2 border-b border-border/80 pb-7">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        <span className="pb-1 text-sm text-muted-foreground">/ month</span>
        {premium ? <span className="ml-auto pb-1 text-xs text-muted-foreground">or $39.99 yearly</span> : null}
      </div>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {benefits.map((benefit) => <li className="flex items-start gap-2.5 text-sm" key={benefit}><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />{benefit}</li>)}
      </ul>
      <Button className="mt-8 h-10 w-full" nativeButton={false} render={<a href="#download" />} variant={premium ? "default" : "outline"}>
        {premium ? "Explore Premium" : "Start with Free"}
      </Button>
    </article>
  );
}
