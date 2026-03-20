import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfileColor, getReputationCategory } from "@/lib/profile";
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

  const profileColor = getProfileColor(user.id);
  const reputationCategory = getReputationCategory(user.reputation);

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">Profile</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
          <div
            className={`h-24 w-24 rounded-2xl border border-white/10 ${profileColor}`}
            aria-hidden="true"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">User ID</p>
                <p className="mt-2 break-all text-sm text-white">{user.id}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Name</p>
                <p className="mt-2 text-lg font-semibold text-white">{user.username}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">Profile picture</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`h-6 w-6 rounded-md ${profileColor}`} aria-hidden="true" />
                  <span className="text-sm text-white">{profileColor.replace("bg-", "")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <p className="text-sm text-zinc-400">Reputation score</p>
          <p className="mt-2 text-3xl font-bold text-white">{user.reputation}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <p className="text-sm text-zinc-400">User category</p>
          <p className="mt-2 text-3xl font-bold text-white">{reputationCategory}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent posted polls</h2>
            <span className="text-sm text-zinc-500">{user.pollsCreated} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {user.polls.length > 0 ? (
              user.polls.map((poll) => (
                <Link
                  key={poll.id}
                  href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
                >
                  <p className="font-medium text-white">{poll.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Posted {poll.createdAt.toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-zinc-400">No polls posted yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent answered polls</h2>
            <span className="text-sm text-zinc-500">{user.pollsParticipated} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {user.votes.length > 0 ? (
              user.votes.map((vote) => (
                <Link
                  key={vote.id}
                  href={
                    vote.poll.status === "CLOSED"
                      ? `/result/${vote.poll.id}`
                      : `/poll/${vote.poll.id}`
                  }
                  className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
                >
                  <p className="font-medium text-white">{vote.poll.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Answered {vote.createdAt.toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-zinc-400">No answered polls yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
