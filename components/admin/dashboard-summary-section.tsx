import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryItem {
  label: string;
  value: string;
  tone?: "default" | "success" | "premium" | "muted";
}

interface DashboardSummarySectionProps {
  title: string;
  description: string;
  items: SummaryItem[];
}

const toneClasses = {
  default: "text-foreground",
  success: "text-success",
  premium: "text-primary",
  muted: "text-muted-foreground",
};

export function DashboardSummarySection({
  title,
  description,
  items,
}: DashboardSummarySectionProps) {
  return (
    <Card className="border border-border/80 py-0 shadow-card">
      <CardHeader className="border-b border-border/80 px-5 py-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-px bg-border/70 p-0 sm:grid-cols-3">
        {items.map((item) => (
          <div className="bg-card p-4" key={item.label}>
            <p className="text-[11px] font-medium text-muted-foreground">{item.label}</p>
            <p className={`mt-1.5 text-lg font-semibold tracking-tight ${toneClasses[item.tone ?? "default"]}`}>
              {item.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
