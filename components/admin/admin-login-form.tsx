"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_ROUTES } from "@/lib/auth/constants";
import { loginSchema } from "@/lib/validations/auth";
import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginErrorResponse {
  message: string;
}

export function AdminLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(undefined);

    try {
      const response = await fetch(AUTH_ROUTES.login, {
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as
        | ApiResponse<{ user: AuthUser }>
        | LoginErrorResponse;

      if (!response.ok || !("success" in payload) || !payload.success) {
        const message = payload.message || "Unable to sign in. Please try again.";
        setServerError(message);
        toast.error(message);
        return;
      }

      toast.success(`Welcome back, ${payload.data.user.name}.`);
      router.replace("/admin");
      router.refresh();
    } catch {
      const message = "Unable to connect to the server. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form className="space-y-readora-lg" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-readora-sm">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email address
        </label>
        <Input
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          autoComplete="email"
          className="h-10"
          id="email"
          placeholder="admin@example.com"
          type="email"
          {...form.register("email")}
        />
        {emailError ? (
          <p className="text-sm text-destructive" id="email-error">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="space-y-readora-sm">
        <label className="text-sm font-medium text-foreground" htmlFor="password">
          Password
        </label>
        <Input
          aria-describedby={passwordError ? "password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          autoComplete="current-password"
          className="h-10"
          id="password"
          type="password"
          {...form.register("password")}
        />
        {passwordError ? (
          <p className="text-sm text-destructive" id="password-error">
            {passwordError}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p aria-live="polite" className="rounded-lg border border-destructive/30 bg-destructive/10 p-readora-sm text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      <Button className="h-10 w-full" disabled={form.formState.isSubmitting} size="lg" type="submit">
        <LogIn aria-hidden="true" />
        {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
