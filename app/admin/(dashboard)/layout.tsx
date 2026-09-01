import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
