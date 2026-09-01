import { AdminLoginForm } from "@/components/admin/admin-login-form";

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
    <main className="flex min-h-screen items-center justify-center bg-background p-readora-md">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-readora-xl shadow-float">
        <p className="text-sm font-medium text-primary">Readora Admin</p>
        <h1 className="mt-readora-sm text-3xl text-card-foreground">Welcome back</h1>
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
