import { redirect } from "next/navigation";

import { SignupForm } from "@/components/SignupForm";
import { auth } from "@/lib/auth";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Create node</p>
        <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
          Create your Banter account.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Sign-up remains wired to the same auth route and automatic login flow. This update only
          changes the interface.
        </p>
      </section>
      <SignupForm />
    </main>
  );
}
