import { AdminLoginForm } from "@/components/admin/admin-login-form";
import Image from "next/image";

const loginMessages = {
  forbidden: "Your account does not have administrator access.",
  "session-expired": "Your session has expired. Please sign in again.",
} as const;

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const { reason } = await props.searchParams;
  const loginMessage =
    typeof reason === "string" && reason in loginMessages
      ? loginMessages[reason as keyof typeof loginMessages]
      : undefined;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_42%)]" />
      <section className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-7 shadow-float sm:p-9">
        <div className="flex items-center gap-3">
          <Image alt="" aria-hidden="true" className="size-10 object-contain" height={40} src="/favicon.svg" width={40} />
          <div><p className="text-sm font-semibold text-foreground">Readora Admin</p><p className="text-xs text-muted-foreground">Library console</p></div>
        </div>
        <h1 className="mt-8 font-sans text-3xl font-semibold tracking-tight text-card-foreground">Welcome back</h1>
        <p className="mt-readora-sm text-sm text-muted-foreground">
          Sign in with an administrator account to manage your library.
        </p>
        {loginMessage ? (
          <p className="mt-readora-md rounded-lg border border-destructive/30 bg-destructive/10 p-readora-sm text-sm text-destructive">
            {loginMessage}
          </p>
        ) : null}
        <div className="mt-readora-xl">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
