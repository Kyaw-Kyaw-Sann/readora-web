"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth/constants";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const response = await fetch(AUTH_ROUTES.logout, { method: "POST" });

      if (!response.ok) {
        toast.error("You have been signed out locally.");
      } else {
        toast.success("Signed out successfully.");
      }
    } catch {
      toast.error("You have been signed out locally.");
    } finally {
      router.replace("/admin/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      className="w-full justify-start text-muted-foreground hover:text-foreground"
      disabled={isLoggingOut}
      onClick={handleLogout}
      variant="ghost"
    >
      <LogOut aria-hidden="true" />
      {isLoggingOut ? "Signing out…" : "Logout"}
    </Button>
  );
}
