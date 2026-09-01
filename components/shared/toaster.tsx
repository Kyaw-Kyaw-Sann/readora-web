"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return <Sonner position="top-right" theme={resolvedTheme === "dark" ? "dark" : "light"} />;
}
