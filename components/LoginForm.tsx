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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6"
    >
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
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Login
      </button>
      {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}
