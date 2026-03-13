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
    <main className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
          Create poll
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Post the argument.
        </h1>
        <p className="mt-3 text-zinc-400">
          Keep it binary, sharp, and easy to judge.
        </p>
      </div>
      <CreatePollForm />
    </main>
  );
}
