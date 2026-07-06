"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/infrastructure/auth/auth-client";
import { registerSchema } from "../schemas/register.schema";
import { Input, PasswordInput } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { FormError } from "@/shared/presentation/components/ui/form-error";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    const { data, error: signUpError } = await authClient.signUp.email(parsed.data);
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message ?? "Registrasi gagal, coba lagi.");
      return;
    }

    // DB hook di auth.ts sudah auto-create org + workspace saat user dibuat.
    // Hook ini asynchronous di sisi server — beri sedikit waktu agar konsisten,
    // lalu baca, lalu redirect.
    let firstOrg: { id: string; slug: string } | undefined;
    for (let i = 0; i < 10 && !firstOrg; i++) {
      console.log("Polling for organizations, attempt", i);
      const orgs = await authClient.organization.list();
      console.log("Got orgs:", orgs);
      firstOrg = orgs.data?.[0] as { id: string; slug: string } | undefined;
      console.log("firstOrg:", firstOrg);
      if (!firstOrg) await new Promise((r) => setTimeout(r, 200));
    }

    if (!firstOrg) {
      console.log("No firstOrg found, redirecting to /register");
      router.push("/register");
      return;
    }

    // Since our default team's slug is always the same as the org's slug:
    console.log("Redirecting to:", `/${firstOrg.slug}/${firstOrg.slug}`);
    router.push(`/${firstOrg.slug}/${firstOrg.slug}`);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-card-foreground">Buat akun</h1>
        <p className="text-sm text-muted-foreground">
          Mulai kelola konten kamu bersama Sahabat Kreator.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormError message={error} />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold text-card-foreground">Nama</Label>
          <Input id="name" name="name" placeholder="Nama lengkap" autoComplete="name" />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-card-foreground">Email</Label>
          <Input id="email" name="email" type="email" placeholder="nama@email.com" autoComplete="email" />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-bold text-card-foreground">Password</Label>
          <PasswordInput id="password" name="password" placeholder="Minimal 8 karakter" autoComplete="new-password" />
          {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
        </div>

        <Button type="submit" isLoading={isLoading}>Daftar</Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
