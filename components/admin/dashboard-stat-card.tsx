import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="relative border border-border/80 py-0 shadow-card">
      <span aria-hidden="true" className="absolute inset-y-5 left-0 w-0.5 rounded-full bg-primary" />
      <CardContent className="flex min-h-31 items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">{title}</p>
          <p className="mt-2.5 text-2xl font-semibold tracking-[-0.035em] text-foreground">{value}</p>
          <p className="mt-1.5 truncate text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
      </CardContent>
    </Card>
  );
}
