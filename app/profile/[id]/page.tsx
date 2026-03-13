import Link from "next/link";
import { notFound } from "next/navigation";

import { getUser } from "@/services/userService";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: {
    id: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">Profile</p>
        <h1 className="mt-2 text-3xl font-bold">{user.username}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">Reputation</p>
            <p className="mt-2 text-2xl font-bold">{user.reputation}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">Polls created</p>
            <p className="mt-2 text-2xl font-bold">{user.pollsCreated}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">Polls participated</p>
            <p className="mt-2 text-2xl font-bold">{user.pollsParticipated}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <h2 className="text-xl font-semibold">Recent polls</h2>
        <div className="mt-4 space-y-3">
          {user.polls.length > 0 ? (
            user.polls.map((poll) => (
              <Link
                key={poll.id}
                href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
              >
                {poll.title}
              </Link>
            ))
          ) : (
            <p className="text-zinc-400">No polls created yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
