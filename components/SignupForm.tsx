"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Creating account...");

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Account creation failed.");
      return;
    }

    const loginResult = await signIn("credentials", {
      redirect: false,
      email: payload.email,
      password: payload.password,
      callbackUrl: "/"
    });

    if (!loginResult || loginResult.error) {
      setStatus("Account created. Please log in.");
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="shell-panel grid gap-6 p-6 sm:p-8">
      <div className="grid gap-5">
        <label className="block space-y-2">
          <span className="kicker">Username</span>
          <input name="username" required className="terminal-field" />
        </label>
        <label className="block space-y-2">
          <span className="kicker">Email</span>
          <input name="email" type="email" required className="terminal-field" />
        </label>
        <label className="block space-y-2">
          <span className="kicker">Password</span>
          <input name="password" type="password" minLength={8} required className="terminal-field" />
        </label>
      </div>

      <div className="grid gap-4">
        <button type="submit" className="primary-cta w-full">
          Create Account
        </button>
        {status ? (
          <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
        ) : null}
      </div>
    </form>
  );
}
