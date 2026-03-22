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
        <p className="kicker">Welcome back</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-[color:var(--text)] sm:text-6xl">
          Sign in to keep up.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Log in to create posts, vote in polls, and follow what the community is talking about.
        </p>
      </section>
      <LoginForm />
    </main>
  );
}
