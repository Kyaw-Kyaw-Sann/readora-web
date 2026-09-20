"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      aria-label={label}
      className={showLabel ? "w-full justify-start gap-3" : undefined}
      disabled={!mounted}
      onClick={() => setTheme(nextTheme)}
      size={showLabel ? "default" : "icon"}
      title={label}
      type="button"
      variant="ghost"
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      {showLabel ? <span>{isDark ? "Light mode" : "Dark mode"}</span> : null}
    </Button>
  );
}
