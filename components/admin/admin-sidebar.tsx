"use client";

import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  Tags,
  Users,
} from "lucide-react";
import Image from "next/image";
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
      <div className="flex h-18 items-center gap-3 border-b border-sidebar-border/80 px-5">
        <Image
          alt=""
          aria-hidden="true"
          className="size-9 object-contain"
          height={36}
          src="/favicon.svg"
          width={36}
        />
        <div>
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">Readora Admin</p>
          <p className="mt-0.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Library console</p>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Workspace</p>
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon aria-hidden="true" className={cn("size-4", isActive && "text-primary")} />
              {item.label}
              {isActive ? <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border/80 p-3">
        <ThemeToggle showLabel />
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
