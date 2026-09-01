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
    <Card className="border border-border py-0 shadow-card">
      <CardHeader className="border-b py-readora-md">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-5 gap-y-4 p-readora-md sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`mt-1 text-lg font-semibold ${toneClasses[item.tone ?? "default"]}`}>
              {item.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
