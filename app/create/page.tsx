import { redirect } from "next/navigation";

import { CreatePollForm } from "@/components/CreatePollForm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/create");
  }

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="shell-panel px-6 py-8 sm:px-8">
          <p className="kicker">Protocol // Create</p>
          <h1 className="mt-4 max-w-3xl font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl">
            Post the argument.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Keep the debate binary, keep the signal clear, and preserve the full create to vote to
            result loop exactly as it exists now.
          </p>
        </div>

        <aside className="grid gap-4">
          <div className="section-panel p-5">
            <p className="kicker">Ruleset</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <li>Two options only.</li>
              <li>Duration drives the verdict deadline.</li>
              <li>Existing API and Prisma flow remain untouched.</li>
            </ul>
          </div>
        </aside>
      </section>

      <CreatePollForm />
    </main>
  );
}
