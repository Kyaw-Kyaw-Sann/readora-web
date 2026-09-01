"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  admin: "Overview",
  books: "Books",
  categories: "Categories",
  reviews: "Reviews",
  subscriptions: "Subscriptions",
  users: "Users",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {segments.map((segment, index) => {
          const isCurrent = index === segments.length - 1;
          const label = segmentLabels[segment] ?? "Details";

          return (
            <li className="flex min-w-0 items-center gap-1.5" key={`${segment}-${index}`}>
              {index > 0 ? (
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
              ) : null}
              <span
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? "truncate font-medium text-foreground" : "truncate text-muted-foreground"}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
