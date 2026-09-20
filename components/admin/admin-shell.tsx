"use client";

import { type ReactNode, useState } from "react";
import { Menu } from "lucide-react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground lg:pl-62">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-62 border-r border-sidebar-border lg:block">
        <AdminSidebar />
      </div>

      <Dialog onOpenChange={setIsNavigationOpen} open={isNavigationOpen}>
        <AdminHeader
          mobileNavigationTrigger={
            <DialogTrigger
              render={<Button aria-label="Open navigation" size="icon" variant="ghost" />}
            >
              <Menu aria-hidden="true" />
            </DialogTrigger>
          }
        />
        <DialogContent
          className="!top-0 !left-0 h-dvh !w-72 max-w-[85vw] !translate-x-0 !translate-y-0 rounded-none border-0 p-0 shadow-float"
          showCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Admin navigation</DialogTitle>
          </DialogHeader>
          <AdminSidebar onNavigate={() => setIsNavigationOpen(false)} />
        </DialogContent>
      </Dialog>

      <main className="mx-auto w-full max-w-[1540px] p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
