"use client";

import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Library,
  MessageSquareText,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/books", icon: BookOpen, label: "Books" },
  { href: "/admin/categories", icon: Tags, label: "Categories" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/reviews", icon: MessageSquareText, label: "Reviews" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
] as const;

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full flex-col bg-sidebar", className)}>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-readora-lg">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
          <Library aria-hidden="true" className="size-4" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-sidebar-foreground">Readora</p>
          <p className="text-[11px] text-muted-foreground">Admin</p>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto p-readora-md">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
              )}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-readora-md">
        <ThemeToggle showLabel />
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
