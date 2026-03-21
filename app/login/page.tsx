import { redirect } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Access node</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
          Enter the arena.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Authenticate through the existing credentials flow and rejoin the live judgment feed
          without changing any backend behavior.
        </p>
      </section>
      <LoginForm />
    </main>
  );
}
