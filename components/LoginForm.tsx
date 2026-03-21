"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Signing in...");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      redirect: false,
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      callbackUrl
    });

    if (!result || result.error) {
      setStatus("Invalid email or password.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="shell-panel grid gap-6 p-6 sm:p-8">
      <div className="grid gap-5">
        <label className="block space-y-2">
          <span className="kicker">Email</span>
          <input name="email" type="email" required className="terminal-field" />
        </label>
        <label className="block space-y-2">
          <span className="kicker">Password</span>
          <input name="password" type="password" required className="terminal-field" />
        </label>
      </div>

      <div className="grid gap-4">
        <button type="submit" className="primary-cta w-full">
          Enter Arena
        </button>
        {status ? (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
        ) : null}
      </div>
    </form>
  );
}
