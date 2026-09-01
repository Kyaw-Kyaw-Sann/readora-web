import type { ComponentProps, ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends ComponentProps<"div"> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function EmptyState({
  title,
  description,
  icon = <Inbox aria-hidden="true" className="size-6" />,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-readora-lg py-readora-xl text-center shadow-card",
        className,
      )}
      {...props}
    >
      <div className="mb-readora-md flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      {description ? (
        <p className="mt-readora-xs max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-readora-lg">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
