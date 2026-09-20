import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function ReadoraLogo({ className }: { className?: string }) {
  return (
    <Link className={cn("inline-flex items-center gap-2.5", className)} href="/" aria-label="Readora home">
      <Image alt="" aria-hidden="true" className="size-9 object-contain" height={36} src="/favicon.svg" width={36} />
      <span className="font-heading text-xl font-semibold tracking-[-0.025em] text-foreground">Readora</span>
    </Link>
  );
}
