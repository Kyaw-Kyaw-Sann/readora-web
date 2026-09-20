import type { ReactNode } from "react";

import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AdminHeaderProps {
  mobileNavigationTrigger: ReactNode;
}

export function AdminHeader({ mobileNavigationTrigger }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border/80 bg-background/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-readora-sm">
        <div className="lg:hidden">{mobileNavigationTrigger}</div>
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
          <div className="flex size-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
            A
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-foreground">Admin</p>
            <p className="text-[10px] text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
