import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingStateProps extends ComponentProps<"div"> {
  label?: string;
}

function LoadingState({
  label = "Loading…",
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-readora-sm rounded-xl border border-border bg-card px-readora-lg py-readora-xl text-sm text-muted-foreground shadow-card",
        className,
      )}
      role="status"
      {...props}
    >
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}

export { LoadingState };
export type { LoadingStateProps };
