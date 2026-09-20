import { Headphones, MapPinCheck, Sparkles, TrendingUp } from "lucide-react";

const features = [
  { icon: MapPinCheck, title: "Read Anywhere", description: "Move between devices and return to the page where you stopped." },
  { icon: Headphones, title: "Listen Anywhere", description: "Keep stories close on commutes, walks, and quiet evenings." },
  { icon: Sparkles, title: "Personalized Picks", description: "Discover books shaped by the categories and stories you enjoy." },
  { icon: TrendingUp, title: "Track Progress", description: "Follow your reading and listening journey without losing momentum." },
];

export function ProductFeatures() {
  return (
    <section className="scroll-mt-20 py-20 sm:py-24" id="features">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-border/80 pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Built around your reading</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight font-semibold sm:text-4xl">Everything you need, without the noise.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            A focused place for books and audiobooks, designed to make discovery easy and returning to a story effortless.
          </p>
        </div>
        <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article className="border-border py-6 sm:px-6 sm:first:pl-0 lg:border-l lg:py-2 lg:first:border-l-0" key={title}>
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/8 text-primary"><Icon aria-hidden="true" className="size-5" /></span>
                <span className="text-xs font-medium text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
