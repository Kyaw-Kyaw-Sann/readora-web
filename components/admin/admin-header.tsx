import type { ReactNode } from "react";

import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AdminHeaderProps {
  mobileNavigationTrigger: ReactNode;
}

export function AdminHeader({ mobileNavigationTrigger }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-readora-md backdrop-blur lg:px-readora-xl">
      <div className="flex min-w-0 items-center gap-readora-sm">
        <div className="lg:hidden">{mobileNavigationTrigger}</div>
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-readora-sm">
        <ThemeToggle />
        <div className="hidden items-center gap-2 border-l border-border pl-readora-md sm:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            A
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-foreground">Admin</p>
            <p className="text-[11px] text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
