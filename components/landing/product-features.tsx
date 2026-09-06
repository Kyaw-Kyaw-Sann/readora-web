import { Headphones, MapPinCheck, Sparkles, TrendingUp } from "lucide-react";

const features = [
  { icon: MapPinCheck, title: "Read Anywhere", description: "Pick up on any device and never lose your place." },
  { icon: Headphones, title: "Listen Anywhere", description: "Take audiobooks with you for stories on the move." },
  { icon: Sparkles, title: "Personalized Recommendations", description: "Discover thoughtful picks shaped by your reading interests." },
  { icon: TrendingUp, title: "Track Progress", description: "See your progress and keep your reading momentum growing." },
];

export function ProductFeatures() {
  return <section className="scroll-mt-20 py-20 sm:py-24" id="features"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Made for every chapter</p><h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Everything you need to enjoy your books</h2><p className="mt-4 text-muted-foreground">A calm, connected reading experience—whether you read, listen, or switch between both.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, description }) => <article className="rounded-2xl border border-border bg-card p-6 text-center shadow-card" key={title}><span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></span><h3 className="mt-5 font-sans text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div></div></section>;
}
