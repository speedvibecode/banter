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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6"
    >
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Username</span>
        <input
          name="username"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Create Account
      </button>
      {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}
